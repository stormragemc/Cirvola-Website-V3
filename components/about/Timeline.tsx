'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { timeline as timelineData } from '@/content/about';
import { reducedMotion } from '@/lib/forms';
import { Icon } from '../Icon';
import { Txt } from '../Text';

type Point = (typeof timelineData)[number];

/** About page: horizontal, clickable timeline that switches the story panel below. */
export function Timeline({ timeline }: { timeline: Point[] }) {
  const [current, setCurrent] = useState(0);
  const [fill, setFill] = useState<string | null>(null);
  const [edges, setEdges] = useState({ canScroll: false, atEnd: false });
  const [dragClass, setDragClass] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const section = useRef<HTMLElement>(null);
  const drag = useRef({ dragging: false, moved: false, startX: 0, startLeft: 0 });
  const currentRef = useRef(0);

  const select = useCallback(
    (i: number, { focus = false, scroll = true } = {}) => {
      const next = Math.max(0, Math.min(timeline.length - 1, i));
      currentRef.current = next;
      setCurrent(next);
      setFill(`${timeline.length > 1 ? (next / (timeline.length - 1)) * 100 : 0}%`);
      const tab = tabs.current[next]!;
      if (focus) tab.focus({ preventScroll: true });
      const sc = scroller.current;
      if (scroll && sc) {
        const left = tab.offsetLeft - sc.clientWidth / 2 + tab.offsetWidth / 2;
        sc.scrollTo({ left, behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
      history.replaceState(history.state, '', `#${timeline[next].id}`);
    },
    [timeline]
  );

  // Fade the right edge while there's more timeline to scroll to.
  const edge = useCallback(() => {
    const sc = scroller.current;
    if (!sc) return;
    setEdges({ canScroll: sc.scrollWidth > sc.clientWidth + 4, atEnd: sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    // Drag to scroll the timeline with a mouse (touch scrolls natively).
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.dragging || !scroller.current) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 4) {
        d.moved = true;
        setDragClass(true);
      }
      scroller.current.scrollLeft = d.startLeft - dx;
    };
    const onUp = () => {
      drag.current.dragging = false;
      setDragClass(false);
      setTimeout(() => (drag.current.moved = false), 0);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', edge);
    edge();

    // Deep link: /about#bsf opens that point.
    const fromHash = timeline.findIndex((t) => t.id === location.hash.slice(1));
    select(fromHash >= 0 ? fromHash : 0, { scroll: fromHash >= 0 });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', edge);
    };
  }, [edge, select, timeline]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in keys) {
      e.preventDefault();
      select(currentRef.current + keys[e.key], { focus: true });
    } else if (e.key === 'Home') {
      e.preventDefault();
      select(0, { focus: true });
    } else if (e.key === 'End') {
      e.preventDefault();
      select(timeline.length - 1, { focus: true });
    }
  };

  const scrollerClass = ['timeline-scroller', dragClass && 'is-dragging', edges.canScroll && 'can-scroll', edges.atEnd && 'at-end'].filter(Boolean).join(' ');

  return (
    <section ref={section} className="timeline-section" aria-labelledby="timeline-title">
      <div className="wrap">
        <h2 className="sr-only" id="timeline-title">Timeline</h2>
        <p className="timeline-hint">
          Select a point on the timeline to read that part of the story. Larger points are chapters; smaller ones are milestones along the way.
        </p>
      </div>
      <div className="timeline" data-timeline="">
        <div
          ref={scroller}
          className={scrollerClass}
          data-timeline-scroller=""
          onScroll={edge}
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse') return;
            drag.current = { dragging: true, moved: false, startX: e.clientX, startLeft: scroller.current!.scrollLeft };
          }}
        >
          <div className="timeline-track" role="tablist" aria-label="Cirvola timeline" style={{ '--count': timeline.length } as React.CSSProperties} onKeyDown={onKeyDown}>
            <span className="timeline-rail" aria-hidden="true">
              <span className="timeline-fill" data-timeline-fill="" style={fill === null ? undefined : ({ '--fill': fill } as React.CSSProperties)}></span>
            </span>
            {timeline.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                className={`tl-node tl-${t.kind}${i < current ? ' is-past' : ''}`}
                id={`tl-tab-${t.id}`}
                aria-controls={`tl-panel-${t.id}`}
                aria-selected={i === current ? 'true' : 'false'}
                tabIndex={i === current ? 0 : -1}
                data-tl-index={i}
                onClick={() => !drag.current.moved && select(i)}
              >
                <span className="tl-dot" aria-hidden="true">
                  {t.kind === 'milestone' ? <Icon name="sparkle" size={14} /> : <span>{timeline.filter((x, j) => x.kind === 'chapter' && j <= i).length}</span>}
                </span>
                <span className="tl-label">{t.label}</span>
                {t.when && (
                  <span className="tl-when">
                    <Txt text={t.when} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="timeline-panels">
          {timeline.map((t, i) => (
            <article
              key={t.id}
              className={`tl-panel tl-panel-${t.kind}`}
              role="tabpanel"
              id={`tl-panel-${t.id}`}
              aria-labelledby={`tl-tab-${t.id}`}
              data-tl-panel={i}
              hidden={i !== current}
            >
              <figure className="tl-figure">
                <img src={t.image} alt={t.alt} loading="lazy" />
              </figure>
              <div className="tl-copy">
                <p className="tl-kicker">
                  {`${t.kind === 'milestone' ? 'Milestone' : 'Chapter'}${t.when ? ' ' : ''}`}
                  {t.when && (
                    <span className="tl-kicker-when">
                      <Txt text={t.when} />
                    </span>
                  )}
                </p>
                <h3>
                  <Txt text={t.title} />
                </h3>
                {t.body.map((p, j) => (
                  <p key={j}>
                    <Txt text={p} />
                  </p>
                ))}
                <div className="tl-nav">
                  <button type="button" className="btn btn-secondary btn-sm" data-tl-prev="" disabled={i === 0} onClick={() => select(currentRef.current - 1)}>
                    <Icon name="arrow-left" size={16} />
                    <span className="btn-label">Previous</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-tl-next=""
                    disabled={i === timeline.length - 1}
                    onClick={() => {
                      select(currentRef.current + 1);
                      section.current?.querySelector('.timeline')?.scrollIntoView({ block: 'nearest' });
                    }}
                  >
                    <span className="btn-label">Next</span>
                    <Icon name="arrow-right" size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
