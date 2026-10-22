import Link from 'next/link';
import { site } from '@/content/site';
import { Icon } from '../Icon';
import { ComposeButton } from './Compose';

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/images/logos/cirvola-wordmark-light.png" alt="Cirvola" width="900" height="283" loading="lazy" />
            <p>Waste to wonder. Food valorisation workshops, recipes and R&amp;D, made in Singapore.</p>
            <div className="socials">
              <a href={site.linkedin.url} target="_blank" rel="noopener" aria-label="Cirvola on LinkedIn">
                <Icon name="linkedin" />
              </a>
              <a href={site.instagram.url} target="_blank" rel="noopener" aria-label="Cirvola on Instagram">
                <Icon name="instagram" />
              </a>
              <a href={`mailto:${site.email}`} aria-label="Email Cirvola">
                <Icon name="mail" />
              </a>
            </div>
          </div>
          <div>
            <h2 className="footer-heading">Explore</h2>
            <ul className="footer-links">
              <li><Link href="/events">Events and programmes</Link></li>
              <li><Link href="/recipes">Recipes and the Cookbook</Link></li>
              <li><Link href="/lab">R&amp;D Lab</Link></li>
              <li><Link href="/about">Our story</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">Work with us</h2>
            <ul className="footer-links">
              <li><ComposeButton className="link-button">Request a programme</ComposeButton></li>
              <li><Link href="/recipes#studio">Share a valorisation idea</Link></li>
              <li><Link href="/lab#briefs">Post a waste stream</Link></li>
              <li><Link href="/lab#join">Join the valorisers network</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">Contact</h2>
            <ul className="footer-links">
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><a href={site.phoneHref}>{site.phone}</a></li>
              <li><a href={site.instagram.url} target="_blank" rel="noopener">{site.instagram.handle}</a></li>
            </ul>
            <p className="footer-small">{site.location}</p>
          </div>
        </div>
        <p className="footer-disclaimer">
          {`
      Recipes and activities on this site are for general education. Check every ingredient for allergens and follow food-safety basics.
      Eco-enzyme is a home-made cleaner, not food or medicine. AI-generated visuals are illustrations, not tested results.
      Logos show organisations we have worked with and do not imply endorsement.
    `}
        </p>
        <div className="footer-bottom">
          <p>{`© ${year} ${site.legalName}. All rights reserved.`}</p>
          <ul>
            <li><Link href="/terms">Terms of use</Link></li>
            <li><Link href="/privacy">Privacy policy</Link></li>
            <li><Link href="/privacy#cookies">No tracking cookies</Link></li>
            <li>Made in Singapore</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
