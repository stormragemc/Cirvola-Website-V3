import Link from 'next/link';
import { hero, problem, loop, programmes, partners, testimonials } from '@/content/home';
import { events, schoolImpact } from '@/content/events';
import { problemStats as S, ourNumbers, ratings } from '@/content/stats';
import { Txt } from '@/components/Text';
import { ImpactNumbers, PartnerStrip, SourceLink } from '@/components/shared';
import { ComposeButton } from '@/components/site/Compose';
import { BodyClass } from '@/components/site/BodyClass';
import { Happening } from '@/components/home/Carousel';
import { Loop } from '@/components/home/Loop';
import { Compare } from '@/components/home/Compare';
import { CountUp } from '@/components/home/CountUp';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({ path: '/' });

const upcoming = events
  .filter((e) => e.status === 'upcoming')
  .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <h1 className="hero-title" id="hero-title">
          <span className="hero-word" aria-label="Cirvola">
            {'CIRVOLA'.split('').map((l, i) => (
              <span className="hero-letter" style={{ '--i': i } as React.CSSProperties} aria-hidden="true" key={i}>
                {l}
              </span>
            ))}
          </span>
          <span className="hero-line">
            <span className="w-waste">Waste</span> <span className="w-to">to</span> <span className="w-wonder">wonder.</span>
          </span>
        </h1>
        <div className="hero-foot">
          <p className="hero-intro">{hero.intro}</p>
          <div className="hero-ctas">
            <ComposeButton className="btn btn-primary">{hero.primary.label}</ComposeButton>
            <Link className="btn btn-ghost" href={hero.secondary.href}>
              {hero.secondary.label}
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-photos" aria-hidden="true">
        <img src="/images/photos/workshop-stirring.webp" alt="" width="1210" height="908" />
        <img src="/images/photos/ecotour-garden.webp" alt="" width="1000" height="1498" />
        <img src="/images/photos/ecotour-kitchen-group.webp" alt="" width="864" height="564" />
      </div>
    </section>
  );
}

function DotGrid({ filled }: { filled: number }) {
  return (
    <div className="dot-grid" role="img" aria-label={`${filled} out of 100 squares filled`}>
      {Array.from({ length: 100 }, (_, i) => (
        <span className={i < filled ? 'on' : ''} key={i}></span>
      ))}
    </div>
  );
}

function Stats() {
  const yearsLeft = S.landfill.year - new Date().getFullYear();
  return (
    <section className="section stats" aria-labelledby="stats-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="section-title" id="stats-title">The numbers behind the bin</h2>
          <p className="section-intro">Singapore is a small island with one landfill. Here’s what we’re throwing into it.</p>
        </div>
        <div className="stat-grid">
          <article className="stat stat-hero">
            <p className="stat-value">
              <CountUp value={S.generated.value} />
              <span className="stat-unit"> tonnes</span>
            </p>
            <p className="stat-label">{S.generated.label}</p>
            <p className="stat-note">{S.generated.perDay}</p>
            <SourceLink source={S.generated.source} />
          </article>
          <article className="stat stat-dots">
            <DotGrid filled={S.recycled.value} />
            <div>
              <p className="stat-value">{`Only ${S.recycled.value}%`}</p>
              <p className="stat-label">{S.recycled.label}</p>
              <p className="stat-note">{S.recycled.note}</p>
              <SourceLink source={S.recycled.source} />
            </div>
          </article>
          <article className="stat stat-money">
            <p className="stat-value">{S.household.value}</p>
            <p className="stat-label">{S.household.label}</p>
            <SourceLink source={S.household.source} />
          </article>
          <article className="stat stat-plate">
            <svg className="plate" viewBox="0 0 120 120" role="img" aria-label="A plate with one third missing">
              <circle cx="60" cy="60" r="56" className="plate-rim" />
              <circle cx="60" cy="60" r="42" className="plate-base" />
              <path d="M60 60 L60 18 A42 42 0 0 1 96.4 81 Z" className="plate-lost" />
            </svg>
            <div>
              <p className="stat-value">{S.global.value}</p>
              <p className="stat-label">{S.global.label}</p>
              <SourceLink source={S.global.source} />
            </div>
          </article>
          <article className="stat stat-landfill">
            <p className="stat-value">{S.landfill.year}</p>
            <p className="stat-label">{`${S.landfill.label}. That’s ${yearsLeft} years away.`}</p>
            <SourceLink source={S.landfill.source} />
          </article>
          <article className="stat stat-target">
            <p className="stat-value">{S.target.value}</p>
            <p className="stat-label">{S.target.label}</p>
            <SourceLink source={S.target.source} />
          </article>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="section problem" aria-labelledby="problem-title">
      <div className="wrap">
        <h2 className="problem-title" id="problem-title">{problem.headline}</h2>
        <div className="streams">
          <ul className="stream-list">
            {problem.streams.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="streams-note">{problem.streamsNote}</p>
        </div>
        <div className="pressures">
          {problem.pressures.map((p) => (
            <article className="pressure" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
        <blockquote className="hmw">
          <p>{problem.question}</p>
        </blockquote>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="section solution" aria-labelledby="solution-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="section-title" id="solution-title">{loop.headline}</h2>
          <p className="section-intro">{loop.intro}</p>
        </div>
        <Loop centre={loop.centre} steps={loop.steps} />

        <h3 className="sub-title">See it transform</h3>
        <p className="sub-intro">Drag the handle to turn waste into wonder.</p>
        <div className="compare-grid">
          {loop.transformations.map((t) => (
            <Compare key={t.after.label} before={t.before} after={t.after} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Voices() {
  return (
    <section className="section voices" aria-labelledby="voices-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="section-title" id="voices-title">What people say</h2>
        </div>
        <div className="voices-grid">
          <div className="quotes">
            {testimonials.map((t, i) => (
              <figure className="quote" key={i}>
                <blockquote>
                  <p>
                    <Txt text={t.quote} />
                  </p>
                </blockquote>
                <figcaption>
                  <strong>
                    <Txt text={t.name} />
                  </strong>
                  <span>
                    <Txt text={t.role} />
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <aside className="ratings" aria-labelledby="ratings-title">
            <h3 id="ratings-title">{ratings.title}</h3>
            <ul className="rating-legend">
              {ratings.sessions.map((s, i) => (
                <li key={s}>
                  <span className={`swatch swatch-${i}`}></span>
                  {s}
                </li>
              ))}
            </ul>
            {ratings.rows.map((r) => (
              <div className="rating-row" key={r.label}>
                <p>{r.label}</p>
                {r.values.map((v, i) => (
                  <div className={`rating-bar rating-bar-${i}`} key={i}>
                    <span style={{ '--w': `${(v / 5) * 100}%` } as React.CSSProperties}></span>
                    <b>{v.toFixed(1)}</b>
                  </div>
                ))}
              </div>
            ))}
            <p className="ratings-note">From participant feedback forms at two community workshops.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Programmes() {
  return (
    <section className="section programmes" aria-labelledby="programmes-title">
      <div className="wrap">
        <div className="section-head section-head-row">
          <div>
            <h2 className="section-title" id="programmes-title">Programmes and impact</h2>
            <p className="section-intro">Workshops, cooking sessions, school programmes and booths, all built around making something real.</p>
          </div>
          <Link className="btn btn-secondary" href="/events">
            See more programmes
          </Link>
        </div>
        <div className="programme-grid">
          {programmes.map((p) => (
            <article className="programme" key={p.title}>
              <img src={p.image} alt={p.alt} loading="lazy" />
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
        <div className="impact-band">
          <ImpactNumbers numbers={ourNumbers} />
          <div className="school-callout">
            <img src={schoolImpact.logo} alt="" width="64" height="68" loading="lazy" />
            <p>
              <strong>{schoolImpact.school}</strong>
              {` is our most recent school partner: ${schoolImpact.students} students learned design thinking alongside live valorisation cooking.`}
            </p>
          </div>
        </div>
        <PartnerStrip partners={partners} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <BodyClass name="page-home" />
      <Hero />
      <Happening upcoming={upcoming} />
      <Stats />
      <Problem />
      <Solution />
      <Voices />
      <Programmes />
    </>
  );
}
