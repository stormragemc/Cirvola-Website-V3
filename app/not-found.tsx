import Link from 'next/link';
import { BodyClass } from '@/components/site/BodyClass';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({ path: '/404', title: 'Page not found' });

export default function NotFound() {
  return (
    <>
      <BodyClass name="page-404" />
      <section className="not-found">
        <div className="wrap">
          <p className="nf-code">404</p>
          <h1 className="page-title">This page has been composted.</h1>
          <p className="page-intro">It might have moved, or the link is wrong. Try one of these instead.</p>
          <div className="hero-ctas">
            <Link className="btn btn-primary" href="/">
              Go home
            </Link>
            <Link className="btn btn-secondary" href="/lab">
              Visit the R&amp;D Lab
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
