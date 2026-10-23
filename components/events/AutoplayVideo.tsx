'use client';

import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from '@/lib/forms';
import { Icon } from '../Icon';

/**
 * A YouTube video that starts playing (muted, as browsers require) once it scrolls into view,
 * and pauses when it scrolls away. Until then only the poster photo loads, so YouTube isn't
 * contacted for visitors who never reach it. With reduced motion, it waits for a click.
 */
export function AutoplayVideo({ id, title, poster }: { id: string; title: string; poster: string }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const command = (func: 'playVideo' | 'pauseVideo') =>
      frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!reducedMotion()) setLoaded(true);
          command('playVideo');
        } else command('pauseVideo');
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="autoplay-video">
      {loaded ? (
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className="autoplay-video-poster" onClick={() => setLoaded(true)} aria-label={`Play video: ${title}`}>
          <img src={poster} alt="" loading="lazy" />
          <span className="autoplay-video-play" aria-hidden="true">
            <Icon name="play" size={28} />
          </span>
        </button>
      )}
    </div>
  );
}
