import { events, achievements, schoolImpact } from '@/content/events';
import { ourNumbers } from '@/content/stats';
import { partners } from '@/content/home';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Text';
import { EventCard, ImpactNumbers, PartnerStrip, type CirvolaEvent } from '@/components/shared';
import { ComposeButton } from '@/components/site/Compose';
import { BodyClass } from '@/components/site/BodyClass';
import { RevealEffects } from '@/components/events/RevealEffects';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/events',
  title: 'Events and programmes',
  description:
    'Cirvola workshops, cooking sessions, school programmes, booths and appearances. Request a food valorisation programme for your school, community or company.',
});

const byDateDesc = (a: CirvolaEvent, b: CirvolaEvent) => (b.date || '0000').localeCompare(a.date || '0000');
const upcoming = events.filter((e) => e.status === 'upcoming').sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
const pastEvents = events.filter((e) => e.status === 'past' && ['workshop', 'cooking', 'school'].includes(e.kind)).sort(byDateDesc);
const booths = events.filter((e) => e.status === 'past' && e.kind === 'booth').sort(byDateDesc);
const appearances = events.filter((e) => e.status === 'past' && e.kind === 'appearance').sort(byDateDesc);

const sections = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'events', label: 'Events' },
  { id: 'booths', label: 'Booths' },
  { id: 'appearances', label: 'Appearances' },
  { id: 'impact', label: 'Impact' },
];

function ListSection({ id, title, intro, items }: { id: string; title: string; intro?: string; items: CirvolaEvent[] }) {
  return (
    <section className="section events-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <div className="section-head reveal">
          <h2 className="section-title" id={`${id}-title`}>{title}</h2>
          {intro && <p className="section-intro">{intro}</p>}
        </div>
        <div className="event-grid">
          {items.map((ev) => (
            <div className="reveal" key={ev.id}>
              <EventCard ev={ev} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function EventsPage() {
  return (
    <>
      <BodyClass name="page-events" />
      <RevealEffects />
      <section className="events-hero">
        <div className="wrap">
          <h1 className="sr-only">Events and programmes</h1>
          <div className="split-cta">
            <div className="split-panel split-request">
              <h2>Request a programme with us</h2>
              <p>
                Workshops for schools, communities and companies, from a one-hour session to a full innovation programme. Tell us about your group and we’ll
                shape it around you.
              </p>
              <ComposeButton className="btn btn-primary btn-lg">
                Write to us <Icon name="send" size={18} />
              </ComposeButton>
            </div>
            <div className="split-panel split-upcoming">
              <h2>See upcoming sessions</h2>
              <p>{`${upcoming.length} sessions coming up, from a charity-run booth to school kitchen rotations.`}</p>
              <a className="btn btn-secondary btn-lg" href="#upcoming">
                Browse sessions <Icon name="arrow-right" size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <nav className="subnav" aria-label="On this page">
        <div className="wrap">
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <ListSection id="upcoming" title="Upcoming sessions" intro="Dates marked “to be confirmed” are still being finalised with our partners." items={upcoming} />
      <ListSection id="events" title="Events" intro="Workshops, cooking sessions and school programmes we’ve run." items={pastEvents} />
      <ListSection id="booths" title="Booths" intro="Where we’ve set up shop to show the public what waste can become." items={booths} />
      <ListSection id="appearances" title="Appearances" intro="Pitches, competitions and stages we’ve stood on." items={appearances} />

      <section className="section impact" id="impact" aria-labelledby="impact-title">
        <div className="wrap">
          <div className="section-head reveal">
            <h2 className="section-title" id="impact-title">Impact and achievements</h2>
            <p className="section-intro">What we’ve earned, and what people have learned.</p>
          </div>
          <ul className="achievement-grid">
            {achievements.map((a) => (
              <li className="achievement reveal" key={a.title}>
                <span className="achievement-value">{a.value}</span>
                <h3>{a.title}</h3>
                <p>
                  <Txt text={a.detail} />
                </p>
              </li>
            ))}
          </ul>

          <div className="school-impact reveal">
            <div className="school-impact-head">
              <img src={schoolImpact.logo} alt={`${schoolImpact.school} crest`} width="96" height="102" loading="lazy" />
              <div>
                <h3>{`What ${schoolImpact.school} now knows`}</h3>
                <p>
                  {`${schoolImpact.students} students went through our School Innovation Lab: a mix of design thinking and live valorisation cooking. Here’s what we taught them.`}
                </p>
              </div>
            </div>
            <ol className="taught-list">
              {schoolImpact.taught.map((t) => (
                <li className="reveal" key={t.title}>
                  <h4>{t.title}</h4>
                  <p>{t.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <ImpactNumbers numbers={ourNumbers} className="impact-numbers impact-numbers-light reveal" />
          <div className="reveal">
            <PartnerStrip partners={partners} />
          </div>
        </div>
      </section>
    </>
  );
}
