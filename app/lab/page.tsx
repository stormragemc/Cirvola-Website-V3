import Link from 'next/link';
import { lab } from '@/content/lab';
import { site } from '@/content/site';
import { Icon } from '@/components/Icon';
import { ComposeButton } from '@/components/site/Compose';
import { BodyClass } from '@/components/site/BodyClass';
import { LabGame } from '@/components/lab/Bench';
import { JoinForm } from '@/components/lab/JoinForm';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/lab',
  title: 'R&D Lab',
  description:
    'Play the Cirvola Valorisation Bench: combine food by-products and processes to discover what they can become. Pitch ideas for open R&D briefs and join the valorisers network.',
});

function Briefs() {
  return (
    <section className="section briefs" id="briefs" aria-labelledby="briefs-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="section-title" id="briefs-title">Open briefs</h2>
          <p className="section-intro">
            Real problems we’re working on right now. Pitch an idea for any of them: students, chefs, makers and researchers from anywhere are welcome. The best
            ideas get tested in our kitchen, with credit to you.
          </p>
        </div>
        <ul className="brief-grid">
          {lab.briefs.map((b) => (
            <li className={`brief${b.cta ? ' brief-cta' : ''}`} key={b.id}>
              <p className="brief-material">{b.material}</p>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
              <ul className="tag-list">
                {b.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              {b.cta ? (
                <ComposeButton className="btn btn-primary btn-sm" preset="Post a waste stream">
                  Post your waste stream
                </ComposeButton>
              ) : (
                <Link className="btn btn-secondary btn-sm" href={`/recipes?brief=${b.id}#studio`}>
                  Pitch an idea
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Notebook() {
  return (
    <section className="section notebook" id="notebook" aria-labelledby="notebook-title">
      <div className="wrap notebook-layout">
        <div>
          <h2 className="section-title" id="notebook-title">Lab notebook</h2>
          <p className="section-intro">What’s on our bench, and how far along it is.</p>
          <img className="notebook-photo" src="/images/photos/product-tubs.webp" alt="Rows of small tubs stamped with the Cirvola logo" loading="lazy" />
        </div>
        <ol className="notebook-list">
          {lab.notebook.map((n) => (
            <li key={n.title}>
              <span className={`pill pill-${n.status.toLowerCase()}`}>{n.status}</span>
              <div>
                <h3>{n.title}</h3>
                <p>{n.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Play() {
  return (
    <section className="section play" id="play" aria-labelledby="play-title">
      <div className="wrap play-inner">
        <div className="play-copy">
          <h2 className="section-title" id="play-title">Play Valorise It!</h2>
          <p>
            Our browser game. You have 60 seconds and three hearts: slice the useful side-streams, like fruit pulp, coffee grounds and bagasse, and dodge the plastic
            and contaminated plate waste. Every good slice unlocks a valorised product for your badge bag. Can you collect all 17?
          </p>
          <a className="btn btn-primary btn-lg" href={site.gameUrl} target="_blank" rel="noopener">
            Play now <Icon name="external" size={18} />
          </a>
        </div>
        <div className="play-art" aria-hidden="true">
          <div className="play-screen">
            <span className="play-item play-item-1"></span>
            <span className="play-item play-item-2"></span>
            <span className="play-item play-item-3"></span>
            <span className="play-slash"></span>
            <span className="play-hud">0/17 ♥♥♥</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Join() {
  return (
    <section className="section join" id="join" aria-labelledby="join-title">
      <div className="wrap join-inner">
        <div>
          <h2 className="section-title" id="join-title">Join the valorisers network</h2>
          <p className="section-intro">
            For anyone, anywhere, who turns by-products into something better. We’ll share new briefs, recipes and collaboration calls. No spam: a few emails a
            year.
          </p>
        </div>
        <JoinForm />
      </div>
    </section>
  );
}

export default function LabPage() {
  return (
    <>
      <BodyClass name="page-lab" />
      <LabGame lab={lab} />
      <Briefs />
      <Notebook />
      <Play />
      <Join />
    </>
  );
}
