'use client';

import { useEffect } from 'react';
import { reducedMotion } from '@/lib/forms';

/** Fast, once-only fade-in for `.reveal` sections, plus sub-nav highlighting. */
export function RevealEffects() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    const reduce = reducedMotion();
    const observers: IntersectionObserver[] = [];

    if (!('IntersectionObserver' in window)) {
      document.documentElement.classList.add('reveal-off');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        // Stagger siblings that enter together, 40ms apart.
        let i = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = reduce ? '0ms' : `${Math.min(i, 6) * 40}ms`;
          el.classList.add('is-visible');
          io.unobserve(el);
          i++;
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    observers.push(io);

    // Highlight the sub-nav link for the section in view.
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.subnav a'));
    const targets = links.map((a) => document.querySelector(a.getAttribute('href')!)).filter(Boolean) as Element[];
    if (targets.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
          }
        },
        { rootMargin: '-35% 0px -60% 0px' }
      );
      targets.forEach((t) => spy.observe(t));
      observers.push(spy);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);
  return null;
}
