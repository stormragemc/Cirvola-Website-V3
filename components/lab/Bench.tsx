'use client';

// R&D Lab: the Valorisation Bench. Combine a by-product with a process to discover
// what it can become. Progress is saved in this browser only.

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { lab as labData } from '@/content/lab';
import { postJSON, reducedMotion } from '@/lib/forms';
import { Icon } from '../Icon';

type Lab = typeof labData;
type Material = Lab['materials'][number];
type Process = Lab['processes'][number];
type Kind = 'material' | 'process';
type AiEntry = { m: string; p: string; name: string; blurb: string; safety?: string; kind?: string; demo?: boolean };
type Progress = { found: Set<string>; ai: AiEntry[] };

const STORE = 'cirvola-lab-v1';
const key = (m: string, p: string) => `${m}|${p}`;

function load(): Progress {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || '{}');
    return { found: new Set(s.found || []), ai: s.ai || [] };
  } catch {
    return { found: new Set(), ai: [] };
  }
}
function save(progress: Progress) {
  try {
    localStorage.setItem(STORE, JSON.stringify({ found: [...progress.found], ai: progress.ai }));
  } catch {}
}

function TokenVisual({ kind, item }: { kind: Kind; item: Material | Process }) {
  return kind === 'material' ? (
    <span className="token-swatch" style={{ '--swatch': (item as Material).color } as React.CSSProperties} aria-hidden="true"></span>
  ) : (
    <span className="token-icon">
      <Icon name={item.id} size={22} />
    </span>
  );
}

type Result =
  | { type: 'card'; cls: string; tag: string; name: string; blurb: string; combo: string; isNew?: boolean; recipe?: string; develop?: { material: string; idea: string } }
  | { type: 'ai'; entry: AiEntry; combo: string; m: Material; p: Process }
  | { type: 'uncharted'; combo: string; m: Material; p: Process };

const recipeHref = (material: string, idea?: string) =>
  `/recipes?material=${encodeURIComponent(material)}${idea !== undefined ? `&idea=${encodeURIComponent(idea)}` : ''}#studio`;

function ResultCard({ r }: { r: Extract<Result, { type: 'card' }> }) {
  return (
    <div className={`result-card ${r.cls}`}>
      <span className="result-tag">{r.tag}</span>
      <h3>{r.name}</h3>
      <p>{r.blurb}</p>
      <p className="disc-combo">
        {r.isNew ? `${r.combo} ` : r.combo}
        {r.isNew && <span className="result-new">New discovery!</span>}
      </p>
      {(r.recipe || r.develop) && (
        <div className="result-actions">
          {r.recipe && (
            <Link className="btn btn-secondary btn-sm" href={`/recipes#${r.recipe}`}>
              See the recipe
            </Link>
          )}
          {r.develop && (
            <Link className="btn btn-secondary btn-sm" href={recipeHref(r.develop.material, r.develop.idea)}>
              Develop a twist
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function AiCard({ entry, combo, m }: { entry: AiEntry; combo: string; m: Material }) {
  return (
    <div className="result-card is-ai">
      <span className="result-tag">{entry.demo ? 'Demo idea' : 'AI idea, untested'}</span>
      <h3>{entry.name}</h3>
      <p>{entry.blurb}</p>
      {entry.safety && (
        <p className="disc-combo">
          <strong>Check first:</strong>
          {` ${entry.safety}`}
        </p>
      )}
      <p className="disc-combo">{combo}</p>
      <div className="result-actions">
        <Link className="btn btn-primary btn-sm" href={recipeHref(m.name, `${entry.name}: ${entry.blurb}`)}>
          Develop and send to Cirvola
        </Link>
      </div>
    </div>
  );
}

function Uncharted({ m, p, onIdea }: { m: Material; p: Process; onIdea: (entry: AiEntry) => void }) {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  async function ask() {
    setBusy(true);
    try {
      const { idea, demo } = await postJSON<{ idea: Omit<AiEntry, 'm' | 'p'>; demo?: boolean }>('/api/lab-combine', {
        material: m.name,
        materialHint: m.hint,
        process: p.name,
        verb: p.verb,
      });
      onIdea({ m: m.id, p: p.id, name: idea.name, blurb: idea.blurb, safety: idea.safety, kind: idea.kind, demo: !!demo });
    } catch (err) {
      setErrors((e) => [...e, (err as Error).message]);
      setBusy(false);
    }
  }
  return (
    <div className="result-card">
      <span className="result-tag">Uncharted</span>
      <h3>No known recipe… yet</h3>
      <p>{`Nobody on our bench has ${p.verb} ${m.name.toLowerCase()} before. Want our AI lab assistant to imagine what it could become?`}</p>
      <div className="result-actions">
        <button type="button" className={`btn btn-primary btn-sm${busy ? ' is-busy' : ''}`} data-ask-ai="" disabled={busy} onClick={ask}>
          <span className="btn-label">{busy ? 'Thinking…' : 'Ask the AI lab'}</span>
        </button>
        <Link className="btn btn-secondary btn-sm" href={recipeHref(m.name)}>
          I have an idea
        </Link>
      </div>
      {errors.map((e, i) => (
        <p className="form-error" key={i}>
          {e}
        </p>
      ))}
    </div>
  );
}

// Small celebration burst from the button on a new discovery.
function burst(from: HTMLElement) {
  if (reducedMotion()) return;
  const r = from.getBoundingClientRect();
  const colors = ['#f7a928', '#e07609', '#24734f', '#c9d45c', '#b4235a'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'burst';
    const a = (Math.PI * 2 * i) / 14;
    const dist = 60 + Math.random() * 50;
    s.style.cssText = `left:${r.left + r.width / 2 + scrollX}px;top:${r.top + r.height / 2 + scrollY}px;background:${colors[i % colors.length]};--dx:${Math.cos(a) * dist}px;--dy:${Math.sin(a) * dist}px;--r:${Math.random() * 360}deg`;
    document.body.append(s);
    setTimeout(() => s.remove(), 800);
  }
}

export function LabGame({ lab }: { lab: Lab }) {
  const total = lab.discoveries.length;
  const mats = useMemo(() => Object.fromEntries(lab.materials.map((m) => [m.id, m])), [lab]);
  const procs = useMemo(() => Object.fromEntries(lab.processes.map((p) => [p.id, p])), [lab]);
  const disc = useMemo(() => new Map(lab.discoveries.map((d) => [key(d.m, d.p), d])), [lab]);
  const unsafe = lab.unsafe as Record<string, { name: string; blurb: string } | undefined>;

  const [progress, setProgress] = useState<Progress>({ found: new Set(), ai: [] });
  const [sel, setSel] = useState<Record<Kind, string | null>>({ material: null, process: null });
  const [result, setResult] = useState<{ id: number; r: Result } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<Kind | null>(null);
  const [armed, setArmed] = useState(false);
  const benchRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const resultId = useRef(0);
  const progressRef = useRef(progress);
  const selRef = useRef(sel);

  /** Show, remember and save new progress. */
  function commitProgress(next: Progress) {
    progressRef.current = next;
    save(next);
    setProgress(next);
  }

  // Saved progress lives in this browser only, so it's read after hydration.
  useEffect(() => {
    progressRef.current = load();
    setProgress(progressRef.current);
  }, []);

  const show = (r: Result) => setResult({ id: ++resultId.current, r });

  // ── Selecting ──
  function choose(kind: Kind, id: string) {
    const next = { ...selRef.current, [kind]: selRef.current[kind] === id ? null : id };
    selRef.current = next;
    setSel(next);
    if (next.material && next.process && matchMedia('(max-width: 1079px)').matches) {
      benchRef.current?.querySelector('.bench-centre')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── Valorise ──
  function valorise() {
    const m = mats[sel.material!];
    const p = procs[sel.process!];
    if (!m || !p) return;
    const combo = `${m.name} + ${p.name}`;
    const u = unsafe[m.id];
    if (u) return show({ type: 'card', cls: 'is-unsafe', tag: 'Not suitable', name: u.name, blurb: u.blurb, combo });
    const d = disc.get(key(m.id, p.id));
    if (d) {
      const k = key(d.m, d.p);
      const isNew = !progress.found.has(k);
      commitProgress({ found: new Set(progress.found).add(k), ai: progress.ai });
      show({
        type: 'card',
        cls: `${d.source === 'cirvola' ? 'is-cirvola' : ''}${isNew ? ' is-new' : ''}`,
        tag: d.source === 'cirvola' ? 'Made by Cirvola' : 'Known technique',
        name: d.name,
        blurb: d.blurb,
        combo,
        isNew,
        recipe: d.recipe,
        develop: { material: m.name, idea: `${d.name}: ${p.verb} ${m.name.toLowerCase()}.` },
      });
      if (isNew && goRef.current) burst(goRef.current);
      return;
    }
    const ai = progress.ai.find((x) => x.m === m.id && x.p === p.id);
    if (ai) return show({ type: 'ai', entry: ai, combo, m, p });
    show({ type: 'uncharted', combo, m, p });
  }

  function onIdea(entry: AiEntry, combo: string, m: Material, p: Process) {
    if (!entry.demo) commitProgress({ found: progressRef.current.found, ai: [...progressRef.current.ai, entry] });
    show({ type: 'ai', entry, combo, m, p });
  }

  // Two-tap reset, no blocking dialogs.
  const armTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  function reset() {
    if (!armed) {
      setArmed(true);
      armTimer.current = setTimeout(() => setArmed(false), 3000);
      return;
    }
    setArmed(false);
    commitProgress({ found: new Set<string>(), ai: [] });
    setResult(null);
  }
  useEffect(() => () => clearTimeout(armTimer.current), []);

  function slot(kind: Kind) {
    const id = sel[kind];
    const item = id ? (kind === 'material' ? mats[id] : procs[id]) : null;
    return (
      <div
        className={`slot${item ? ' is-filled' : ''}${over === kind ? ' is-over' : ''}`}
        data-slot={kind}
        aria-live="polite"
        onDragOver={(e) => {
          e.preventDefault();
          setOver(kind);
        }}
        onDragLeave={() => setOver(null)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(null);
          const [k, tokenId] = (e.dataTransfer.getData('text/plain') || '').split(':') as [Kind, string];
          if (k && tokenId) {
            if (selRef.current[k] === tokenId) return;
            choose(k, tokenId);
          }
        }}
      >
        {item ? (
          <div className="slot-fill">
            <TokenVisual kind={kind} item={item} />
            <strong>{item.name}</strong>
          </div>
        ) : (
          <span className="slot-empty">{kind === 'material' ? 'Drop or pick a by-product' : 'Then choose a process'}</span>
        )}
      </div>
    );
  }

  function token(kind: Kind, item: Material | Process) {
    const hint = (item as Material).hint;
    return (
      <li key={item.id}>
        <button
          type="button"
          className={`token token-${kind}${dragging === `${kind}:${item.id}` ? ' is-dragging' : ''}`}
          draggable="true"
          data-token={kind}
          data-id={item.id}
          aria-pressed={sel[kind] === item.id ? 'true' : 'false'}
          onClick={() => choose(kind, item.id)}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', `${kind}:${item.id}`);
            e.dataTransfer.effectAllowed = 'copy';
            setDragging(`${kind}:${item.id}`);
          }}
          onDragEnd={() => setDragging(null)}
        >
          <TokenVisual kind={kind} item={item} />
          <span className="token-text">
            <span className="token-name">{item.name}</span>
            {hint && <span className="token-hint">{hint}</span>}
          </span>
        </button>
      </li>
    );
  }

  let resultContent: ReactNode = null;
  if (result) {
    const r = result.r;
    if (r.type === 'card') resultContent = <ResultCard key={result.id} r={r} />;
    else if (r.type === 'ai') resultContent = <AiCard key={result.id} entry={r.entry} combo={r.combo} m={r.m} />;
    else resultContent = <Uncharted key={result.id} m={r.m} p={r.p} onIdea={(entry) => onIdea(entry, r.combo, r.m, r.p)} />;
  }

  const n = [...progress.found].filter((k) => disc.has(k)).length;

  return (
    <>
      <section className="lab-hero" aria-labelledby="lab-title">
        <div className="wrap">
          <div className="lab-intro">
            <h1 className="page-title" id="lab-title">What else could it be?</h1>
            <p className="page-intro">
              {`Welcome to the Cirvola R&D Lab. Put a by-product on the bench, choose a process, and see what it can become. Some are things we’ve made. Some are techniques cooks have used for generations. Some haven’t been invented yet. Can you find all ${total}?`}
            </p>
          </div>

          <div className="bench" data-bench="" ref={benchRef}>
            <div className="bench-tray bench-tray-materials">
              <h2 className="tray-title">By-products</h2>
              <ul className="token-list" data-tray="material">
                {lab.materials.map((m) => token('material', m))}
              </ul>
            </div>

            <div className="bench-centre">
              <div className="bench-slots">
                {slot('material')}
                <span className="bench-plus" aria-hidden="true">
                  <Icon name="plus" size={28} />
                </span>
                {slot('process')}
              </div>
              <button
                ref={goRef}
                type="button"
                className="btn btn-primary btn-lg bench-go"
                data-valorise=""
                disabled={!(sel.material && sel.process)}
                onClick={valorise}
              >
                <Icon name="flask" size={20} />
                <span className="btn-label">Valorise it</span>
              </button>
              <div className="bench-result" data-result="" aria-live="polite">
                {resultContent}
              </div>
            </div>

            <div className="bench-tray bench-tray-processes">
              <h2 className="tray-title">Processes</h2>
              <ul className="token-list" data-tray="process">
                {lab.processes.map((p) => token('process', p))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section collection" id="collection" aria-labelledby="collection-title">
        <div className="wrap">
          <div className="section-head section-head-row">
            <div>
              <h2 className="section-title" id="collection-title">Your collection</h2>
              <p className="section-intro">
                <span className="found-count" data-found="">
                  {n}
                </span>
                {` of ${total} discovered. `}
                <span className="legend">
                  <span className="legend-dot legend-cirvola"></span>
                  {'Made by Cirvola '}
                  <span className="legend-dot legend-known"></span>
                  {'Known technique '}
                  <span className="legend-dot legend-ai"></span>
                  Your AI inventions
                </span>
              </p>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" data-reset="" onClick={reset}>
              <Icon name="refresh" size={16} />
              <span className="btn-label">{armed ? 'Tap again to clear' : 'Start over'}</span>
            </button>
          </div>
          <div className="progress" aria-hidden="true">
            <span data-progress="" style={{ width: `${(n / total) * 100}%` }}></span>
          </div>
          <ul className="discovery-grid" data-collection="">
            {lab.discoveries.map((d) => {
              const m = mats[d.m];
              return progress.found.has(key(d.m, d.p)) ? (
                <li className={`disc src-${d.source}`} key={key(d.m, d.p)}>
                  <span className="disc-name">{d.name}</span>
                  <span className="disc-combo">{`${m.name} + ${procs[d.p].name}`}</span>
                  {d.recipe && <Link href={`/recipes#${d.recipe}`}>Recipe</Link>}
                </li>
              ) : (
                <li className={`disc is-locked src-${d.source}`} key={key(d.m, d.p)}>
                  <span className="disc-name" aria-label="Undiscovered">
                    ? ? ?
                  </span>
                  <span className="disc-combo">{`Starts with ${m.name.toLowerCase()}`}</span>
                </li>
              );
            })}
          </ul>
          <h3 className="sub-title" data-ai-list-title="" hidden={progress.ai.length === 0}>
            Your AI inventions
          </h3>
          <ul className="discovery-grid" data-ai-collection="">
            {progress.ai.map((a, i) => (
              <li className="disc src-ai" key={i}>
                <span className="disc-name">{a.name}</span>
                <span className="disc-combo">{`${mats[a.m]?.name} + ${procs[a.p]?.name}`}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
