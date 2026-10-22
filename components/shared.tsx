import { Icon } from './Icon';
import { Txt } from './Text';
import type { events } from '@/content/events';

export type CirvolaEvent = (typeof events)[number];

export const kindLabel: Record<string, string> = {
  workshop: 'Workshop',
  cooking: 'Cooking session',
  school: 'School programme',
  booth: 'Booth',
  appearance: 'Appearance',
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function DateBlock({ ev }: { ev: CirvolaEvent }) {
  const label = String(ev.dateLabel || '');
  const precise = ev.date && !label.includes('[[') && /\b\d{1,2} [A-Z][a-z]{2}/.test(label) && !/ or /.test(label);
  if (!precise) {
    const year = !label.includes('[[') && /^\d{4}$/.test(label.trim()) ? label.trim() : null;
    return year ? (
      <span className="date-block date-block-tbc">
        <span>{year}</span>
      </span>
    ) : (
      <span className="date-block date-block-tbc">
        <Icon name="calendar" size={18} />
        <span>TBC</span>
      </span>
    );
  }
  const d = new Date(ev.date + 'T00:00:00');
  return (
    <span className="date-block">
      <span className="date-day">{d.getDate()}</span>
      <span className="date-month">{`${months[d.getMonth()]} ${d.getFullYear()}`}</span>
    </span>
  );
}

export function EventCard({ ev, compact = false }: { ev: CirvolaEvent; compact?: boolean }) {
  return (
    <article className={`event-card${compact ? ' event-card-compact' : ''}`} id={compact ? undefined : ev.id}>
      <div className={`event-media${ev.poster ? ' is-poster' : ''}`}>
        <img src={ev.image} alt={ev.imageAlt || ''} loading="lazy" decoding="async" />
        <DateBlock ev={ev} />
      </div>
      <div className="event-body">
        <p className="event-kind">
          {kindLabel[ev.kind] || ev.kind}
          {ev.status === 'upcoming' && (
            <>
              <span className="status-dot" aria-hidden="true"></span>
              <span className="status-text">Upcoming</span>
            </>
          )}
        </p>
        <h3 className="event-title">
          <Txt text={ev.title} />
        </h3>
        <p className="event-meta">
          <span>
            <Icon name="calendar" size={16} />
            <Txt text={ev.dateLabel} />
          </span>
          <span>
            <Icon name="pin" size={16} />
            <Txt text={ev.venue} />
          </span>
        </p>
        {!compact && (
          <p className="event-summary">
            <Txt text={ev.summary} />
          </p>
        )}
        {!compact && ev.highlights && (
          <ul className="tag-list">
            {ev.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function PartnerStrip({ partners, label = 'Organisations we’ve worked with' }: { partners: { name: string; logo: string | null }[]; label?: string }) {
  return (
    <div className="partners">
      <p className="partners-label">{label}</p>
      <ul className="partner-list">
        {partners.map((p) =>
          p.logo ? (
            <li className="partner" key={p.name}>
              <img src={p.logo} alt={p.name} loading="lazy" />
            </li>
          ) : (
            <li className="partner partner-text" title="Add the official logo file in content/home.ts" key={p.name}>
              <span>{p.name}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export function SourceLink({ source }: { source: { name: string; url: string } }) {
  return (
    <a className="source" href={source.url} target="_blank" rel="noopener">
      {`Source: ${source.name}`}
    </a>
  );
}

export function ImpactNumbers({ numbers, className = 'impact-numbers' }: { numbers: { value: string; label: string }[]; className?: string }) {
  return (
    <ul className={className}>
      {numbers.map((n) => (
        <li key={n.label}>
          <span className="impact-value">{n.value}</span>
          <span className="impact-label">{n.label}</span>
        </li>
      ))}
    </ul>
  );
}
