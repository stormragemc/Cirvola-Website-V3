'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { EventCard, type CirvolaEvent } from '../shared';
import { ComposeButton } from '../site/Compose';

/** "What's happening": a scroll-snap carousel of upcoming events with prev/next buttons. */
export function Happening({ upcoming }: { upcoming: CirvolaEvent[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateButtons = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth - 2;
    setAtStart(t.scrollLeft <= 2);
    setAtEnd(t.scrollLeft >= max);
  }, []);

  useEffect(() => {
    updateButtons();
    window.addEventListener('resize', updateButtons);
    return () => window.removeEventListener('resize', updateButtons);
  }, [updateButtons]);

  const step = () => {
    const item = track.current?.querySelector('.carousel-item');
    return item ? item.getBoundingClientRect().width + 20 : 300;
  };

  return (
    <section className="section happening" aria-labelledby="happening-title">
      <div className="wrap section-head section-head-row">
        <div>
          <h2 className="section-title" id="happening-title">What’s happening</h2>
          <p className="section-intro">Where we’ll be next. Come and make something with us.</p>
        </div>
        <div className="carousel-controls">
          <button
            type="button"
            className="icon-btn icon-btn-lg"
            data-carousel-prev=""
            aria-label="Previous"
            disabled={atStart}
            onClick={() => track.current?.scrollBy({ left: -step(), behavior: 'smooth' })}
          >
            <Icon name="arrow-left" />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn-lg"
            data-carousel-next=""
            aria-label="Next"
            disabled={atEnd}
            onClick={() => track.current?.scrollBy({ left: step(), behavior: 'smooth' })}
          >
            <Icon name="arrow-right" />
          </button>
        </div>
      </div>
      <div className="carousel" data-carousel="">
        <ul ref={track} className="carousel-track" tabIndex={0} aria-label="Upcoming events" onScroll={updateButtons}>
          {upcoming.map((ev) => (
            <li className="carousel-item" key={ev.id}>
              <Link className="card-link" href={`/events#${ev.id}`} aria-label={ev.title}>
                <EventCard ev={ev} compact />
              </Link>
            </li>
          ))}
          <li className="carousel-item">
            <div className="cta-card">
              <h3>Your school or team, next?</h3>
              <p>We bring the ingredients, the method and the know-how. You bring the people.</p>
              <ComposeButton className="btn btn-primary">Request a programme</ComposeButton>
            </div>
          </li>
        </ul>
      </div>
      <div className="wrap">
        <Link className="text-link" href="/events">
          See all events and programmes <Icon name="arrow-right" size={18} />
        </Link>
      </div>
    </section>
  );
}
