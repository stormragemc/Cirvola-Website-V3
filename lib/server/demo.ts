// Demo mode: when no ANTHROPIC_API_KEY is set, build a believable sample from the
// visitor's own words so the Idea Studio and Lab can still be reviewed end to end.

type DemoInput = { material?: string; idea?: string; outcome?: string; audience?: string; origin?: string };
type DemoPlan = { input_material?: string; output?: string; steps?: { detail?: string }[] } | null | undefined;

const colorFor = (text = '') => {
  const t = text.toLowerCase();
  const map = [
    [/orange|citrus|calamansi|lime|lemon|peel/, '#F7A928'],
    [/coffee|ground|cocoa|chocolate/, '#5B3A29'],
    [/beet/, '#B4235A'],
    [/okara|soy|tofu/, '#EDE3C8'],
    [/bread|crust|grain|bran/, '#C98B4E'],
    [/banana|pineapple|mango/, '#E8D34F'],
    [/corn|husk|cob/, '#E9C46A'],
    [/egg/, '#F1E7DA'],
    [/watermelon|leaf|veg|herb|kale|green/, '#8DBF6A'],
  ];
  return (map.find(([re]) => (re as RegExp).test(t)) || [null, '#8DBF6A'])[1] as string;
};

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);
const xml = (s: string) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

export function demoPlan({ material = 'food by-product', idea = '', outcome = '', audience = '', origin = '' }: DemoInput) {
  const m = clip(material, 40);
  const out = outcome && outcome !== 'Not sure yet' ? outcome.toLowerCase() : 'useful product';
  const title = `${cap(m)}, reimagined`;
  return {
    title,
    tagline: `Turning ${m.toLowerCase()} into a ${out} people actually want.`,
    summary: idea ? clip(idea, 320) : `A way to give ${m.toLowerCase()} a second life.`,
    input_material: cap(m),
    output: cap(out),
    steps: [
      { title: 'Collect it clean', detail: `Gather ${m.toLowerCase()} on the day it’s produced${origin ? ` at the ${origin.toLowerCase()}` : ''}, kept separate from plate waste.`, kind: 'collect' },
      { title: 'Prepare', detail: 'Rinse, sort and trim. Remove anything mouldy or contaminated.', kind: 'clean' },
      { title: 'Transform', detail: 'Apply the core process from your idea: dry, ferment, bake or blend.', kind: 'transform' },
      { title: 'Shape and pack', detail: 'Portion it into something easy to use, store and share.', kind: 'package' },
      { title: 'Test with people', detail: `Try it with ${audience || 'a small group'} and note what they’d change.`, kind: 'test' },
    ],
    who_benefits: audience ? cap(audience) : 'Households, cafés and anyone who hates throwing good food away.',
    why_it_matters: `${cap(m)} usually ends up in the bin. This keeps its value in use and cuts waste at the source.`,
    safety_notes: ['Use only fresh, traceable by-products, never plate leftovers.', 'Check moisture and mould risk, and how long it keeps.', 'List allergens clearly.'],
    open_questions: ['How much can one source supply each week?', 'Would people pay for it, or use it at home?', 'What is the simplest version to test first?'],
  };
}

const scene = (inner: string, bg = '#fcf9f4') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="${bg}"/>${inner}</svg>`;

const blobs = (cx: number, cy: number, color: string, n = 7, r = 26) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * r * 2.2 + ((i * 37) % 19) - 9;
    const y = cy + Math.sin(a) * r * 1.1 + ((i * 23) % 13) - 6;
    return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r + (i % 3) * 4}" ry="${r * 0.7}" fill="${color}" stroke="#103d2c" stroke-width="3" transform="rotate(${(i * 29) % 60 - 30} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
  }).join('');

const label = (x: number, y: number, text: string, size = 26, fill = '#103d2c', anchor = 'middle') =>
  `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${xml(text)}</text>`;

function productShape(outcome: string | undefined, color: string) {
  const o = (outcome || '').toLowerCase();
  if (/drink/.test(o))
    return `<path d="M520 170h120l-14 210a20 20 0 0 1-20 18h-52a20 20 0 0 1-20-18z" fill="#fff" stroke="#103d2c" stroke-width="5"/><path d="M530 240h100l-9 135a14 14 0 0 1-14 13h-54a14 14 0 0 1-14-13z" fill="${color}"/><path d="M600 120l-20 60" stroke="#103d2c" stroke-width="6" stroke-linecap="round"/>`;
  if (/household|clean/.test(o))
    return `<rect x="535" y="190" width="90" height="200" rx="22" fill="${color}" stroke="#103d2c" stroke-width="5"/><rect x="560" y="150" width="40" height="44" rx="6" fill="#24734f" stroke="#103d2c" stroke-width="5"/><rect x="550" y="255" width="60" height="60" rx="10" fill="#fcf9f4" stroke="#103d2c" stroke-width="3"/>`;
  if (/material|packag|garden/.test(o))
    return `<path d="M500 230h160l-22 150h-116z" fill="${color}" stroke="#103d2c" stroke-width="5"/><path d="M580 230c-30-60 10-90 40-100-6 40-10 70-40 100z" fill="#24734f" stroke="#103d2c" stroke-width="4"/>`;
  return `<rect x="490" y="250" width="200" height="110" rx="16" fill="${color}" stroke="#103d2c" stroke-width="5"/><path d="M490 300h200M556 250v110M622 250v110" stroke="#103d2c" stroke-width="3" opacity=".5"/><ellipse cx="590" cy="380" rx="140" ry="16" fill="#103d2c" opacity=".12"/>`;
}

function person(x: number, y: number, shirt: string) {
  return `<circle cx="${x}" cy="${y}" r="26" fill="#c98b4e" stroke="#103d2c" stroke-width="4"/><path d="M${x - 44} ${y + 110}c0-50 20-74 44-74s44 24 44 74z" fill="${shirt}" stroke="#103d2c" stroke-width="4"/>`;
}

export function demoConcept({ material = '', outcome, plan }: DemoInput & { plan?: DemoPlan }) {
  const color = colorFor(material);
  return {
    concept_svg: scene(
      `<circle cx="210" cy="250" r="150" fill="#dce4d2"/>${blobs(210, 250, color, 8, 24)}
       <path d="M370 250h90" stroke="#e07609" stroke-width="10" stroke-linecap="round"/><path d="M440 220l34 30-34 30" fill="none" stroke="#e07609" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
       <circle cx="590" cy="270" r="160" fill="#fff4d6"/>${productShape(outcome, color)}
       ${label(210, 450, clip(plan?.input_material || material || 'By-product', 26), 24)}${label(590, 470, clip(plan?.output || 'New product', 26), 24)}`
    ),
    concept_caption: `From ${String(plan?.input_material || material).toLowerCase()} to ${String(plan?.output || 'something new').toLowerCase()}. (Demo sketch)`,
  };
}

export function demoStory({ material, outcome, plan }: DemoInput & { plan?: DemoPlan }) {
  const color = colorFor(material);
  const m = plan?.input_material || material || 'By-product';
  const steps = plan?.steps || [];
  return {
    storyboard: [
      {
        caption: `It starts as ${String(m).toLowerCase()}, usually headed for the bin.`,
        svg: scene(`<rect x="300" y="200" width="200" height="220" rx="20" fill="#48654b" stroke="#103d2c" stroke-width="5"/><rect x="280" y="180" width="240" height="34" rx="10" fill="#24734f" stroke="#103d2c" stroke-width="5"/>${blobs(400, 170, color, 6, 22)}`, '#f3eee3'),
      },
      {
        caption: steps[2]?.detail || 'We clean it, then transform it with a simple process.',
        svg: scene(`<path d="M250 260h300v90a60 60 0 0 1-60 60H310a60 60 0 0 1-60-60z" fill="#fcf9f4" stroke="#103d2c" stroke-width="6"/><path d="M230 260h340" stroke="#103d2c" stroke-width="8" stroke-linecap="round"/>${blobs(400, 300, color, 5, 18)}<path d="M330 220c-20-30 20-40 0-70M400 220c-20-30 20-40 0-70M470 220c-20-30 20-40 0-70" fill="none" stroke="#e07609" stroke-width="6" stroke-linecap="round"/>`, '#dce4d2'),
      },
      {
        caption: `It becomes ${String(plan?.output || 'something new').toLowerCase()}, ready to use.`,
        svg: scene(`<circle cx="590" cy="270" r="170" fill="#f7a928" opacity=".25"/>${productShape(outcome, color)}<path d="M200 160l20 40 44 6-32 30 8 44-40-22-40 22 8-44-32-30 44-6z" fill="#f7a928" stroke="#103d2c" stroke-width="4"/>`, '#fcf9f4'),
      },
      {
        caption: `People enjoy it, and less food goes to waste.`,
        svg: scene(`<rect x="160" y="330" width="480" height="24" rx="10" fill="#c98b4e" stroke="#103d2c" stroke-width="4"/>${person(240, 220, '#24734f')}${person(400, 200, '#e07609')}${person(560, 220, '#48654b')}<g transform="translate(-140 -40) scale(.55)">${productShape(outcome, color).replace(/x="(\d+)"/g, (_, v) => `x="${Number(v) + 400}"`)}</g>`, '#f3eee3'),
      },
    ],
  };
}

export function demoLabIdea({ material, process, verb }: { material: string; process: string; verb?: string }) {
  const v = verb || process.toLowerCase();
  return {
    name: `${cap(v)} ${material.toLowerCase()}`,
    blurb: `Nobody has tried this on our bench yet. ${cap(material)}, ${v}, might turn into something with a whole new texture and flavour. (Demo answer: switch on live AI for a real suggestion.)`,
    kind: 'food',
    safety: 'Start with a small, clean batch and check for spoilage.',
  };
}
