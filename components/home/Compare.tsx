'use client';

import { useState } from 'react';
import { Icon } from '../Icon';

type Side = { label: string; image: string; alt: string };

/** Before/after image slider. */
export function Compare({ before, after }: { before: Side; after: Side }) {
  const [pos, setPos] = useState('55');
  return (
    <figure className="compare" data-compare="">
      <div className="compare-stage" style={{ '--pos': `${pos}%` } as React.CSSProperties}>
        <img className="compare-after" src={after.image} alt={`After: ${after.alt}`} loading="lazy" />
        <img className="compare-before" src={before.image} alt={`Before: ${before.alt}`} loading="lazy" />
        <div className="compare-handle" aria-hidden="true">
          <span></span>
        </div>
        <input
          className="compare-range"
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(e.target.value)}
          aria-label={`Reveal ${after.label}`}
        />
      </div>
      <figcaption>
        <span className="compare-from">{before.label}</span>
        <Icon name="arrow-right" size={18} />
        <span className="compare-to">{after.label}</span>
      </figcaption>
    </figure>
  );
}
