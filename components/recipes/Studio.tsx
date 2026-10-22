'use client';

// Idea Studio: turns a valorisation idea into a concept image, process diagram,
// animated storyboard (downloadable as a video) and a brief, then emails it to Cirvola.

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { describeInvalid, formToObject, postJSON, validate } from '@/lib/forms';
import { Icon } from '../Icon';

type Step = { title: string; detail: string; kind?: string };
type Plan = {
  title: string;
  tagline: string;
  summary: string;
  input_material: string;
  output: string;
  steps: Step[];
  who_benefits: string;
  why_it_matters: string;
  safety_notes?: string[];
  open_questions?: string[];
};
type Scene = { caption: string; svg: string };
type Art = { concept_svg: string | null; concept_caption: string; storyboard: Scene[] };
type Panel = { status: 'empty' } | { status: 'pending' } | { status: 'ready' } | { status: 'error'; message: string };
type Brief = { id: string; title: string; material: string };

const materials = ['Calamansi pulp', 'Orange peel', 'Coffee grounds', 'Okara', 'Bread ends', 'Corn husks', 'Banana peel', 'Beetroot pulp'];
const origins = ['Home kitchen', 'Café or restaurant', 'School canteen', 'Market or hawker stall', 'Factory or brewery', 'Farm'];
const outcomes = ['Food', 'Drink', 'Household product', 'Material or packaging', 'Garden use', 'Not sure yet'];
const roles = ['Student', 'Chef or cook', 'Business owner', 'Teacher', 'Researcher', 'Something else'];
const ideaPlaceholders = [
  'Dry the peel, grind it into a powder and bake it into crackers for school snacks.',
  'Ferment the okara with spices into a spread that cafés could sell.',
  'Press the coffee grounds with a natural binder into plant pots.',
];
const loadingLines = ['Reading your idea…', 'Working out the process…', 'Sketching the concept…', 'Storyboarding the journey…', 'Adding the finishing touches…'];
const tabNames = [
  ['concept', 'Concept'],
  ['process', 'Process'],
  ['story', 'Storyboard'],
  ['brief', 'Brief'],
] as const;
type TabName = (typeof tabNames)[number][0];

const SCENE_MS = 5000;
const svgUrl = (svg: string | null) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(String(svg))}`;

function Chips({ name, values }: { name: string; values: string[] }) {
  return (
    <div className="chip-set">
      {values.map((v) => (
        <label className="chip" key={v}>
          <input type="radio" name={name} value={v} />
          <span>{v}</span>
        </label>
      ))}
    </div>
  );
}

function Pending({ text }: { text: string }) {
  return (
    <div className="canvas-loading">
      <div className="loading-orb"></div>
      <p>{text}</p>
    </div>
  );
}

// ── Rasterise an SVG into a canvas-friendly image ──
function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not draw that image.'));
    img.src = src;
  });
}
function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, zoom: number) {
  const iw = img.naturalWidth || 800;
  const ih = img.naturalHeight || 500;
  const s = Math.max(w / iw, h / ih) * zoom;
  const dw = iw * s;
  const dh = ih * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}
async function svgToJpeg(svg: string, w = 1000, h = 625) {
  const img = await loadImage(svgUrl(svg));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fcf9f4';
  ctx.fillRect(0, 0, w, h);
  drawContain(ctx, img, 0, 0, w, h, 1);
  return c.toDataURL('image/jpeg', 0.86);
}
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = String(text).split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/** A button whose label changes while it's busy. */
function useBusy(idle: string) {
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState(idle);
  return {
    busy,
    label,
    start: (l: string) => {
      setBusy(true);
      setLabel(l);
    },
    stop: (l: string) => {
      setBusy(false);
      setLabel(l);
    },
  };
}

export function Studio({ briefs }: { briefs: Brief[] }) {
  const form = useRef<HTMLFormElement>(null);
  const canvas = useRef<HTMLElement>(null);
  const errorBox = useRef<HTMLParagraphElement>(null);
  const doneBox = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Data the async flows read (mirrors what's on screen).
  const st = useRef<{ plan: Plan | null; art: Art | null; demo: boolean; brief: string | null }>({ plan: null, art: null, demo: false, brief: null });

  const [modeHint, setModeHint] = useState('');
  const [placeholder, setPlaceholder] = useState(0);
  const [briefTitle, setBriefTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step2Complete, setStep2Complete] = useState(false);
  const [layoutHidden, setLayoutHidden] = useState(false);

  const [showEmpty, setShowEmpty] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingLines[0]);
  const loadingTimer = useRef<ReturnType<typeof setInterval>>(undefined);

  const [plan, setPlan] = useState<Plan | null>(null);
  const [demo, setDemo] = useState(false);
  const [tab, setTab] = useState<TabName>('concept');
  const [concept, setConcept] = useState<Panel>({ status: 'empty' });
  const [conceptArt, setConceptArt] = useState<{ svg: string | null; caption: string }>({ svg: null, caption: '' });
  const [storyPanel, setStoryPanel] = useState<Panel>({ status: 'empty' });

  // Storyboard player
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneTick, setSceneTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const story = useRef<{ i: number; playing: boolean; timer?: ReturnType<typeof setTimeout>; n: number } | null>(null);

  const visualiseBtn = useBusy('Visualise my idea');
  const revisualiseBtn = useBusy('Try another take');
  const sendBtn = useBusy('Send my idea to Cirvola');
  const downloadBtn = useBusy('Download video');

  // ── AI availability hint ──
  useEffect(() => {
    fetch('/api/visualize')
      .then((r) => r.json())
      .then((d) =>
        setModeHint(
          d.ai ? 'Sketched by Claude, Anthropic’s AI. Takes about 20 seconds.' : 'Demo mode: showing a sample sketch. Add an Anthropic API key to turn on live AI.'
        )
      )
      .catch(() => setModeHint(''));
  }, []);

  // ── Rotating placeholder ──
  useEffect(() => {
    const ta = form.current!.elements.namedItem('idea') as HTMLTextAreaElement;
    const id = setInterval(() => {
      if (document.activeElement === ta || ta.value) return;
      setPlaceholder((p) => (p + 1) % ideaPlaceholders.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // ── Prefill from the Lab (?brief=… or ?material=…&idea=…) ──
  useEffect(() => {
    const f = form.current!;
    const material = f.elements.namedItem('material') as HTMLInputElement;
    const params = new URLSearchParams(location.search);
    if (params.get('material')) material.value = params.get('material')!;
    if (params.get('idea')) (f.elements.namedItem('idea') as HTMLTextAreaElement).value = params.get('idea')!;
    const b = briefs.find((x) => x.id === params.get('brief'));
    if (b) {
      st.current.brief = b.title;
      if (!material.value) material.value = b.material;
      setBriefTitle(b.title);
    }
  }, [briefs]);

  // Clear invalid marks as soon as someone edits a flagged field.
  useEffect(() => {
    const f = form.current!;
    const onInput = (e: Event) => {
      const t = e.target as Element;
      if (t.getAttribute('aria-invalid') === 'true') t.setAttribute('aria-invalid', 'false');
    };
    f.addEventListener('input', onInput);
    return () => f.removeEventListener('input', onInput);
  }, []);

  // ── Tabs ──
  function selectTab(name: TabName, focus = false) {
    setTab(name);
    if (focus) tabRefs.current[name]?.focus();
  }

  // ── Storyboard player ──
  function stopStory() {
    if (story.current) clearTimeout(story.current.timer);
  }
  function showScene(i: number) {
    const s = story.current;
    if (!s || !s.n) return;
    s.i = i % s.n;
    setSceneIndex(s.i);
    setSceneTick((t) => t + 1);
    clearTimeout(s.timer);
    if (s.playing) s.timer = setTimeout(() => showScene(s.i + 1), SCENE_MS);
  }
  function buildStory(list: Scene[]) {
    stopStory();
    setScenes(list);
    setStoryPanel({ status: 'ready' });
    story.current = { i: 0, playing: true, n: list.length };
    showScene(0);
  }
  // Restart the Ken Burns zoom on the active scene and the progress fills each time a scene shows.
  useLayoutEffect(() => {
    if (!sceneTick) return;
    stage.current?.querySelectorAll<HTMLElement>('.story-scene').forEach((el, j) => {
      const img = el.querySelector('img');
      if (img && j === sceneIndex) {
        img.style.animation = 'none';
        void img.offsetWidth;
        img.style.animation = '';
      }
    });
    progress.current?.querySelectorAll<HTMLElement>('i').forEach((fill) => {
      fill.style.animation = 'none';
      void fill.offsetWidth;
      fill.style.animation = '';
    });
  }, [sceneTick, sceneIndex]);

  useEffect(() => {
    const onVisibility = () => {
      const s = story.current;
      if (!s) return;
      if (document.hidden) clearTimeout(s.timer);
      else if (s.playing) showScene(s.i);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stopStory();
      clearInterval(loadingTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleStory() {
    const s = story.current;
    if (!s) return;
    s.playing = !s.playing;
    setPaused(!s.playing);
    if (s.playing) showScene(s.i);
    else clearTimeout(s.timer);
  }

  // ── Visualise ──
  function loading(on: boolean) {
    setShowLoading(on);
    if (on) {
      setShowEmpty(false);
      setShowResult(false);
      let i = 0;
      setLoadingText(loadingLines[0]);
      clearInterval(loadingTimer.current);
      loadingTimer.current = setInterval(() => setLoadingText(loadingLines[Math.min(++i, loadingLines.length - 1)]), 3500);
    } else clearInterval(loadingTimer.current);
  }

  function ideaInput() {
    const d = formToObject(form.current!);
    return { material: d.material, origin: d.origin, amount: d.amount, idea: d.idea, outcome: d.outcome, audience: d.audience, brief: st.current.brief };
  }

  function checkIdeaFields() {
    for (const id of ['s-material', 's-idea']) {
      const el = document.getElementById(id) as HTMLInputElement;
      const bad = !el.value.trim();
      el.setAttribute('aria-invalid', String(bad));
      if (bad) {
        el.focus();
        return describeInvalid(el);
      }
    }
    return null;
  }

  async function visualise(btn: ReturnType<typeof useBusy>, idleLabel: string) {
    setError(null);
    const problem = checkIdeaFields();
    if (problem) {
      setError(problem);
      return;
    }
    btn.start('Visualising…');
    loading(true);
    if (matchMedia('(max-width: 1039px)').matches) canvas.current!.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      const input = ideaInput();
      const { plan: p, demo: isDemo } = await postJSON<{ plan: Plan; demo?: boolean }>('/api/visualize', { mode: 'plan', ...input });
      st.current.plan = p;
      st.current.demo = !!isDemo;
      setPlan(p);
      setDemo(!!isDemo);
      selectTab('concept');
      loading(false);
      setShowResult(true);
      setConcept({ status: 'pending' });
      stopStory();
      story.current = null;
      setScenes([]);
      setStoryPanel({ status: 'pending' });
      const art: Art = { concept_svg: null, concept_caption: '', storyboard: [] };
      st.current.art = art;
      const conceptReq = postJSON<{ art: Partial<Art> }>('/api/visualize', { mode: 'concept', ...input, plan: p }).then(({ art: a }) => {
        Object.assign(art, a);
        setConceptArt({ svg: art.concept_svg, caption: art.concept_caption });
        setConcept({ status: 'ready' });
      });
      const storyReq = postJSON<{ art: Partial<Art> }>('/api/visualize', { mode: 'story', ...input, plan: p }).then(({ art: a }) => {
        art.storyboard = a.storyboard || [];
        buildStory(art.storyboard);
      });
      const results = await Promise.allSettled([conceptReq, storyReq]);
      if (results[0].status === 'rejected') setConcept({ status: 'error', message: (results[0].reason as Error).message });
      if (results[1].status === 'rejected') setStoryPanel({ status: 'error', message: (results[1].reason as Error).message });
      if (results.every((r) => r.status === 'rejected')) st.current.art = null;
      setStep2Complete(true);
    } catch (err) {
      loading(false);
      if (!st.current.plan) setShowEmpty(true);
      flushSync(() => setError((err as Error).message));
      // the error lives in step 3's area; make sure people see it
      errorBox.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } finally {
      btn.stop(idleLabel);
    }
  }

  // ── Download storyboard as a video (WebM/MP4 via MediaRecorder) ──
  async function downloadVideo() {
    const list = st.current.art?.storyboard || [];
    if (!list.length) return;
    if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
      setError('Your browser can’t record video. Try Chrome, Edge or Firefox.');
      return;
    }
    downloadBtn.start('Recording…');
    try {
      const W = 1280;
      const H = 800;
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const ctx = c.getContext('2d')!;
      const imgs = await Promise.all(list.map((s) => loadImage(svgUrl(s.svg))));
      const types = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
      const mime = types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
      const stream = c.captureStream(30);
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 4_000_000 } : undefined);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      const stopped = new Promise((r) => (rec.onstop = r));
      rec.start(250);

      const per = 3200;
      const titleMs = 1800;
      const total = titleMs + per * list.length;
      const t0 = performance.now();
      await new Promise<void>((resolve) => {
        const frame = (t: number) => {
          const el = t - t0;
          ctx.fillStyle = '#103d2c';
          ctx.fillRect(0, 0, W, H);
          if (el < titleMs) {
            ctx.fillStyle = '#f7a928';
            ctx.font = '800 64px Anybody, sans-serif';
            wrapText(ctx, st.current.plan?.title || 'My valorisation idea', W - 200).forEach((l, i) => ctx.fillText(l, 100, 340 + i * 74));
            ctx.fillStyle = '#f6f1e6';
            ctx.font = '500 30px "Hanken Grotesk", sans-serif';
            ctx.fillText('An idea for the Cirvola R&D Lab', 100, 270);
          } else {
            const idx = Math.min(list.length - 1, Math.floor((el - titleMs) / per));
            const local = (el - titleMs - idx * per) / per;
            ctx.save();
            ctx.globalAlpha = Math.min(1, local * 4);
            drawContain(ctx, imgs[idx], 0, 0, W, H, 1 + local * 0.06);
            ctx.restore();
            ctx.font = '600 32px "Hanken Grotesk", sans-serif';
            const lines = wrapText(ctx, list[idx].caption, W - 160);
            const bh = 36 + lines.length * 42;
            ctx.fillStyle = 'rgba(16,61,44,0.9)';
            ctx.fillRect(40, H - bh - 40, W - 80, bh);
            ctx.fillStyle = '#f6f1e6';
            lines.forEach((l, i) => ctx.fillText(l, 80, H - bh - 40 + 50 + i * 42));
          }
          if (el < total) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });
      rec.stop();
      await stopped;
      const blob = new Blob(chunks, { type: mime.split(';')[0] || 'video/webm' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `cirvola-idea-storyboard.${blob.type.includes('mp4') ? 'mp4' : 'webm'}`;
      document.body.append(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 1000);
    } catch (err) {
      setError(`We couldn’t record the video: ${(err as Error).message}`);
    } finally {
      downloadBtn.stop('Download video');
    }
  }

  // ── Send to Cirvola ──
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    setError(null);
    const bad = validate(f);
    if (bad) {
      setError(describeInvalid(bad));
      bad.focus();
      return;
    }
    sendBtn.start('Sending…');
    try {
      const data = formToObject(f);
      const { art } = st.current;
      const images: { name: string; dataUrl: string }[] = [];
      if (art) {
        try {
          if (art.concept_svg) images.push({ name: 'concept.jpg', dataUrl: await svgToJpeg(art.concept_svg) });
          for (const [i, s] of (art.storyboard || []).slice(0, 4).entries()) {
            images.push({ name: `storyboard-${i + 1}.jpg`, dataUrl: await svgToJpeg(s.svg, 800, 500) });
          }
        } catch {
          /* images are a bonus; send without them */
        }
      }
      await postJSON('/api/idea', {
        ...data,
        brief: st.current.brief,
        plan: st.current.plan,
        art: art ? { concept_svg: art.concept_svg, concept_caption: art.concept_caption, storyboard: art.storyboard } : null,
        images,
        demo: st.current.demo,
      });
      flushSync(() => setLayoutHidden(true));
      doneBox.current?.focus();
      doneBox.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      sendBtn.stop('Send my idea to Cirvola');
    }
  }

  const p = plan;
  const list = (arr?: string[]) => (
    <ul>
      {(arr || []).map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );

  let conceptContent: ReactNode = null;
  if (concept.status === 'pending') conceptContent = <Pending text="Drawing the concept…" />;
  else if (concept.status === 'ready')
    conceptContent = (
      <>
        <img className="ai-visual" alt={conceptArt.caption || 'Concept sketch of the idea'} src={svgUrl(conceptArt.svg)} />
        <p className="concept-caption">{conceptArt.caption || ''}</p>
      </>
    );
  else if (concept.status === 'error') conceptContent = <p className="concept-caption">{concept.message}</p>;

  let stageContent: ReactNode = null;
  if (storyPanel.status === 'pending') stageContent = <Pending text="Storyboarding the journey…" />;
  else if (storyPanel.status === 'ready')
    stageContent = scenes.map((s, i) => (
      <figure className={`story-scene${i === sceneIndex ? ' is-active' : ''}`} key={i}>
        <img alt={s.caption} src={svgUrl(s.svg)} />
        <figcaption className="story-caption">{s.caption}</figcaption>
      </figure>
    ));
  else if (storyPanel.status === 'error')
    stageContent = (
      <p className="concept-caption" style={{ padding: 16, color: '#4b5a4f' }}>
        {storyPanel.message}
      </p>
    );

  return (
    <section className="section studio" id="studio" aria-labelledby="studio-title">
      <div className="wrap">
        <div className="studio-head">
          <h1 className="page-title" id="studio-title">Craft a recipe with us</h1>
          <p className="page-intro">
            Got a by-product and a hunch about what it could become? Tell us your valorisation idea. Our AI studio sketches it as a concept image, a process diagram
            and a short storyboard, then you can send it straight to the Cirvola team.
          </p>
        </div>

        <div className="studio-layout" hidden={layoutHidden}>
          <form ref={form} className="studio-form" data-studio-form="" noValidate onSubmit={onSubmit}>
            <ol className="studio-steps">
              <li className="studio-step" data-step="1">
                <h2 className="step-title">
                  <span className="step-num">1</span>What’s being wasted?
                </h2>
                <div className="field">
                  <label htmlFor="s-material">The by-product</label>
                  <input id="s-material" name="material" required maxLength={120} placeholder="e.g. orange peel from our juice stall" />
                  <div
                    className="suggestions"
                    data-suggest-for="s-material"
                    onClick={(e) => {
                      const b = (e.target as Element).closest<HTMLElement>('[data-value]');
                      if (!b) return;
                      const input = document.getElementById('s-material') as HTMLInputElement;
                      input.value = b.dataset.value!;
                      input.setAttribute('aria-invalid', 'false');
                      input.focus();
                    }}
                  >
                    {materials.map((m) => (
                      <button type="button" className="suggestion" data-value={m} key={m}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <fieldset className="field">
                  <legend>Where does it come from?</legend>
                  <Chips name="origin" values={origins} />
                </fieldset>
                <div className="field">
                  <label htmlFor="s-amount">
                    Roughly how much? <span className="optional">Optional</span>
                  </label>
                  <input id="s-amount" name="amount" maxLength={80} placeholder="e.g. 5 kg a day, one bin a week" />
                </div>
              </li>

              <li className={`studio-step${step2Complete ? ' is-complete' : ''}`} data-step="2">
                <h2 className="step-title">
                  <span className="step-num">2</span>What could it become?
                </h2>
                {briefTitle && (
                  <p className="field-hint">
                    Pitching for the open brief <strong>{`“${briefTitle}”`}</strong>.
                  </p>
                )}
                <div className="field">
                  <label htmlFor="s-idea">Your idea</label>
                  <textarea
                    id="s-idea"
                    name="idea"
                    required
                    maxLength={2000}
                    rows={5}
                    data-rotating-placeholder={ideaPlaceholders.join('|')}
                    placeholder={ideaPlaceholders[placeholder]}
                  ></textarea>
                  <p className="field-hint">Rough is fine. Say what you’d do to it, and why someone would want the result.</p>
                </div>
                <fieldset className="field">
                  <legend>It becomes a…</legend>
                  <Chips name="outcome" values={outcomes} />
                </fieldset>
                <div className="field">
                  <label htmlFor="s-audience">
                    Who is it for? <span className="optional">Optional</span>
                  </label>
                  <input id="s-audience" name="audience" maxLength={120} placeholder="e.g. students, cafés, families at home" />
                </div>
                <div className="studio-visualise">
                  <button
                    type="button"
                    className={`btn btn-primary btn-lg${visualiseBtn.busy ? ' is-busy' : ''}`}
                    data-visualise=""
                    disabled={visualiseBtn.busy}
                    onClick={() => visualise(visualiseBtn, 'Visualise my idea')}
                  >
                    <Icon name="sparkle" size={18} />
                    <span className="btn-label">{visualiseBtn.label}</span>
                  </button>
                  <p className="field-hint" data-ai-mode-hint="">
                    {modeHint}
                  </p>
                </div>
              </li>

              <li className="studio-step" data-step="3">
                <h2 className="step-title">
                  <span className="step-num">3</span>Send it to Cirvola
                </h2>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="s-name">Your name</label>
                    <input id="s-name" name="name" required autoComplete="name" maxLength={120} />
                  </div>
                  <div className="field">
                    <label htmlFor="s-email">Email</label>
                    <input id="s-email" name="email" type="email" required autoComplete="email" maxLength={200} />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="s-country">Country</label>
                    <input id="s-country" name="country" autoComplete="country-name" maxLength={80} placeholder="Singapore" />
                  </div>
                  <div className="field">
                    <label htmlFor="s-org">
                      Organisation <span className="optional">Optional</span>
                    </label>
                    <input id="s-org" name="organisation" autoComplete="organization" maxLength={160} />
                  </div>
                </div>
                <fieldset className="field">
                  <legend>I am a…</legend>
                  <Chips name="role" values={roles} />
                </fieldset>
                <div className="hp" aria-hidden="true">
                  <label>
                    Leave this empty <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <label className="consent">
                  <input type="checkbox" name="credit" defaultChecked />
                  <span>If Cirvola features or develops this idea, credit me by name.</span>
                </label>
                <label className="consent">
                  <input type="checkbox" name="consent" required />
                  <span>
                    {'I agree to the '}
                    <a href="/terms#ideas" target="_blank">
                      terms for idea submissions
                    </a>
                    {' and the '}
                    <a href="/privacy" target="_blank">
                      privacy policy
                    </a>
                    .
                  </span>
                </label>
                <p ref={errorBox} className="form-error" data-studio-error="" role="alert" hidden={!error}>
                  {error}
                </p>
                <button type="submit" className={`btn btn-primary btn-lg${sendBtn.busy ? ' is-busy' : ''}`} data-studio-send="" disabled={sendBtn.busy}>
                  <Icon name="send" size={18} />
                  <span className="btn-label">{sendBtn.label}</span>
                </button>
              </li>
            </ol>
          </form>

          <aside ref={canvas} className="studio-canvas" data-canvas="" aria-live="polite" aria-label="Your idea, visualised">
            <div className="canvas-empty" data-canvas-empty="" hidden={!showEmpty}>
              <svg viewBox="0 0 240 150" className="canvas-empty-art" aria-hidden="true">
                <path d="M20 120 C60 40, 100 140, 140 70 S 210 40, 220 30" className="sketch-line" />
                <circle cx="20" cy="120" r="9" className="sketch-dot sketch-dot-a" />
                <circle cx="140" cy="70" r="9" className="sketch-dot sketch-dot-b" />
                <circle cx="220" cy="30" r="12" className="sketch-dot sketch-dot-c" />
              </svg>
              <h3>Your idea will appear here</h3>
              <p>A concept image, a step-by-step process diagram, and a short animated storyboard you can download as a video.</p>
            </div>
            <div className="canvas-loading" data-canvas-loading="" hidden={!showLoading}>
              <div className="loading-orb" aria-hidden="true"></div>
              <p data-loading-text="">{loadingText}</p>
            </div>
            <div className="canvas-result" data-canvas-result="" hidden={!showResult}>
              <header className="result-head">
                <p className="result-badge" data-result-badge="">
                  {p ? (demo ? 'Demo sketch' : 'Sketched by Claude') : null}
                </p>
                <h3 data-result-title="">{p?.title}</h3>
                <p data-result-tagline="">{p?.tagline}</p>
              </header>
              <div
                className="tabs"
                role="tablist"
                aria-label="Visualisation views"
                onKeyDown={(e) => {
                  const i = tabNames.findIndex(([n]) => n === tab);
                  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                  if (!d) return;
                  e.preventDefault();
                  selectTab(tabNames[(i + d + tabNames.length) % tabNames.length][0], true);
                }}
              >
                {tabNames.map(([name, label]) => (
                  <button
                    key={name}
                    ref={(el) => {
                      tabRefs.current[name] = el;
                    }}
                    role="tab"
                    id={`tab-${name}`}
                    aria-controls={`panel-${name}`}
                    aria-selected={tab === name ? 'true' : 'false'}
                    tabIndex={tab === name ? undefined : -1}
                    data-tab={name}
                    onClick={() => selectTab(name)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="tab-panel" role="tabpanel" id="panel-concept" aria-labelledby="tab-concept" data-panel="concept" hidden={tab !== 'concept'}>
                {conceptContent}
              </div>
              <div className="tab-panel" role="tabpanel" id="panel-process" aria-labelledby="tab-process" data-panel="process" hidden={tab !== 'process'}>
                {p && (
                  <>
                    <div className="process-ends">
                      <span className="process-end">{p.input_material}</span>
                      <Icon name="arrow-right" />
                      <span className="process-end process-end-out">{p.output}</span>
                    </div>
                    <ol className="process-flow">
                      {p.steps.map((s, i) => (
                        <li key={i}>
                          <div>
                            <h4>
                              {s.title}
                              <span className="process-kind">{s.kind || ''}</span>
                            </h4>
                            <p>{s.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
              <div
                className={`tab-panel${paused ? ' story-paused' : ''}`}
                role="tabpanel"
                id="panel-story"
                aria-labelledby="tab-story"
                data-panel="story"
                hidden={tab !== 'story'}
              >
                <div ref={stage} className="story-stage" data-story-stage="">
                  {stageContent}
                </div>
                <div className="story-controls">
                  <button type="button" className="icon-btn" data-story-toggle="" aria-label={paused ? 'Play' : 'Pause'} onClick={toggleStory}>
                    <Icon name={paused ? 'play' : 'pause'} />
                  </button>
                  <div ref={progress} className="story-progress" data-story-progress="">
                    {storyPanel.status === 'ready' &&
                      scenes.map((_, j) => (
                        <span key={j} className={j < sceneIndex ? 'done' : j === sceneIndex ? 'active' : ''}>
                          <i></i>
                        </span>
                      ))}
                  </div>
                  <button
                    type="button"
                    className={`btn btn-secondary btn-sm${downloadBtn.busy ? ' is-busy' : ''}`}
                    data-story-download=""
                    disabled={downloadBtn.busy}
                    onClick={downloadVideo}
                  >
                    <Icon name="download" size={16} />
                    <span className="btn-label">{downloadBtn.label}</span>
                  </button>
                </div>
              </div>
              <div className="tab-panel" role="tabpanel" id="panel-brief" aria-labelledby="tab-brief" data-panel="brief" hidden={tab !== 'brief'}>
                {p && (
                  <dl className="brief-dl">
                    <div>
                      <dt>The idea</dt>
                      <dd>{p.summary}</dd>
                    </div>
                    <div>
                      <dt>Who benefits</dt>
                      <dd>{p.who_benefits}</dd>
                    </div>
                    <div>
                      <dt>Why it matters</dt>
                      <dd>{p.why_it_matters}</dd>
                    </div>
                    <div>
                      <dt>Safety to check</dt>
                      <dd>{list(p.safety_notes)}</dd>
                    </div>
                    <div>
                      <dt>Questions to test</dt>
                      <dd>{list(p.open_questions)}</dd>
                    </div>
                  </dl>
                )}
              </div>
              <footer className="result-foot">
                <button
                  type="button"
                  className={`btn btn-secondary btn-sm${revisualiseBtn.busy ? ' is-busy' : ''}`}
                  data-revisualise=""
                  disabled={revisualiseBtn.busy}
                  onClick={() => visualise(revisualiseBtn, 'Try another take')}
                >
                  <Icon name="refresh" size={16} />
                  <span className="btn-label">{revisualiseBtn.label}</span>
                </button>
                <a
                  className="btn btn-primary btn-sm"
                  href="#s-name"
                  data-goto-send=""
                  onClick={(e) => {
                    e.preventDefault();
                    const name = document.getElementById('s-name')!;
                    name.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    name.focus({ preventScroll: true });
                  }}
                >
                  Send to Cirvola
                </a>
              </footer>
              <p className="ai-note">AI-generated sketches to help explain an idea. They are not tested recipes or safety advice.</p>
            </div>
          </aside>
        </div>

        <div ref={doneBox} className="studio-done" data-studio-done="" hidden={!layoutHidden} tabIndex={-1}>
          <Icon name="check-circle" size={40} />
          <h2>Your idea is with the Cirvola team</h2>
          <p>We read every submission. If we want to develop it, feature it or turn it into an R&amp;D brief, we’ll email you first.</p>
          <a className="btn btn-secondary" href="/lab">
            Explore the R&amp;D Lab
          </a>
        </div>
      </div>
    </section>
  );
}
