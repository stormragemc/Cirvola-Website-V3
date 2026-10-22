'use client';

import { useState } from 'react';
import { Icon } from '../Icon';

type Step = { title: string; body: string };

// Four stations evenly spaced on a circle, connected by arrows, education at the centre.
const cx = 260;
const cy = 260;
const r = 190;
const pos = [-90, 0, 90, 180].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
});
const arcs = [0, 1, 2, 3].map((i) => {
  const a1 = ((-90 + i * 90 + 22) * Math.PI) / 180;
  const a2 = ((-90 + (i + 1) * 90 - 22) * Math.PI) / 180;
  const p1 = { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) };
  const p2 = { x: cx + r * Math.cos(a2), y: cy + r * Math.sin(a2) };
  return `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A${r} ${r} 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
});

/** The circular solution diagram: select a station to read about it. */
export function Loop({ centre, steps }: { centre: Step; steps: Step[] }) {
  const [selected, setSelected] = useState('centre');
  const all = [{ ...centre, key: 'centre', n: 0 }, ...steps.map((s, i) => ({ ...s, key: String(i), n: i + 1 }))];

  return (
    <div className="loop-layout">
      <div className="loop" data-loop="">
        <svg className="loop-svg" viewBox="0 0 520 520" aria-hidden="true">
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
            </marker>
          </defs>
          <circle cx={cx} cy={cy} r={r} className="loop-track" />
          {arcs.map((d) => (
            <path key={d} d={d} className="loop-arc" markerEnd="url(#arrowhead)" />
          ))}
          <circle cx={cx} cy={cy} r="92" className="loop-core" />
        </svg>
        <button
          type="button"
          className="loop-centre"
          data-loop-step="centre"
          aria-pressed={selected === 'centre' ? 'true' : 'false'}
          onClick={() => setSelected('centre')}
        >
          <Icon name="users" size={28} />
          <span>Community co-creation and education</span>
        </button>
        {steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            className="loop-node"
            style={{ '--x': `${((pos[i].x / 520) * 100).toFixed(2)}%`, '--y': `${((pos[i].y / 520) * 100).toFixed(2)}%` } as React.CSSProperties}
            data-loop-step={i}
            aria-pressed={selected === String(i) ? 'true' : 'false'}
            onClick={() => setSelected(String(i))}
          >
            <span className="loop-num">{i + 1}</span>
            <span className="loop-name">{s.title}</span>
          </button>
        ))}
      </div>
      <div className="loop-details" aria-live="polite">
        {all.map((s) => (
          <article className="loop-detail" data-loop-detail={s.key} hidden={s.key !== selected} key={s.key}>
            <p className="loop-detail-step">{s.n ? `Step ${s.n} of 4` : 'At the centre of everything'}</p>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </article>
        ))}
        <p className="loop-hint">Select a step in the loop to see how it works.</p>
      </div>
    </div>
  );
}
