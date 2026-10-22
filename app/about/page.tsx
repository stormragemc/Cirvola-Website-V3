import Link from 'next/link';
import { Fragment } from 'react';
import { timeline, mission, team, mentors } from '@/content/about';
import { Timeline } from '@/components/about/Timeline';
import { ComposeButton } from '@/components/site/Compose';
import { BodyClass } from '@/components/site/BodyClass';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/about',
  title: 'About',
  description: 'How Cirvola started, the problem we tackle, the team behind it, and where we’re heading next.',
});

export default function AboutPage() {
  return (
    <>
      <BodyClass name="page-about" />
      <section className="about-hero" aria-labelledby="about-title">
        <div className="wrap about-hero-inner">
          <div>
            <h1 className="page-title" id="about-title">Our story</h1>
            <p className="page-intro">
              Cirvola is a student-founded social enterprise from Singapore. We started with one question from a restaurant kitchen: if by-products can become
              the next dish there, why not everywhere?
            </p>
          </div>
          <dl className="mission">
            <div>
              <dt>Our vision</dt>
              <dd>{mission.vision}</dd>
            </div>
            <div>
              <dt>Our mission</dt>
              <dd>
                <ul>
                  {mission.mission.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <Timeline timeline={timeline} />
      <section className="section team" aria-labelledby="team-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title" id="team-title">The faces behind Cirvola</h2>
            <p className="section-intro">Built by dreamers, grounded by doers.</p>
          </div>
          <ul className="team-grid">
            {team.map((p) => (
              <li className="person" key={p.name}>
                <img src={p.photo} alt={`Portrait of ${p.name}`} loading="lazy" width="480" height="480" />
                <h3>{p.name}</h3>
                <p className="person-role">{p.role}</p>
                <p>{p.bio}</p>
              </li>
            ))}
          </ul>
          <p className="mentors">
            {'With guidance from '}
            {mentors.map((m, i) => (
              <Fragment key={m.name}>
                <strong>{m.name}</strong>
                {`, ${m.role}${i === mentors.length - 1 ? '.' : ''}`}
              </Fragment>
            ))}
          </p>
        </div>
      </section>
      <section className="section about-cta">
        <div className="wrap about-cta-inner">
          <h2 className="section-title">Want to be part of the next chapter?</h2>
          <div className="about-cta-actions">
            <ComposeButton className="btn btn-primary btn-lg">Request a programme</ComposeButton>
            <Link className="btn btn-ghost btn-lg" href="/lab#briefs">
              Take on a brief
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
