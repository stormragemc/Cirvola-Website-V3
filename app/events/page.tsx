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

// Each group keeps the order of content/events.ts: oldest first, upcoming last.
const inCategory = (category: string) => events.filter((e) => e.category === category);
const upcoming = events.filter((e) => e.status === 'upcoming');

const sections = [
  { id: 'workshops', label: 'Workshops' },
  { id: 'booths', label: 'Booths' },
  { id: 'funding', label: 'Funding' },
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
              <p>{`${upcoming.length} sessions coming up, from an eco-enzyme team workshop to a charity-run booth.`}</p>
              <a className="btn btn-secondary btn-lg" href={`#${upcoming[0].id}`}>
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

      <ListSection
        id="workshops"
        title="Workshops"
        intro="Hands-on sessions for communities, schools and companies, from our first eco-tour onwards. Dates marked “to be confirmed” are still being finalised with our partners."
        items={inCategory('workshops')}
      />
      <ListSection
        id="booths"
        title="Booths and public exhibitions"
        intro="Where we’ve set up shop to show the public what waste can become."
        items={inCategory('booths')}
      />
      <ListSection
        id="funding"
        title="Funding, pitch programmes and competitions"
        intro="The funds and competitions that have backed Cirvola along the way."
        items={inCategory('funding')}
      />

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
