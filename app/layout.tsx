import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { site } from '@/content/site';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ComposeProvider } from '@/components/site/Compose';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: 'Cirvola | Waste to wonder',
  description: site.description,
  icons: { icon: { url: '/favicon.png', type: 'image/png' }, apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#103D2C',
};

const orgJson = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/logos/cirvola-emblem.png`,
  email: site.email,
  sameAs: [site.instagram.url, site.linkedin.url],
  areaServed: 'Singapore',
  description: site.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-SG" data-scroll-behavior="smooth">
      <head>
        <link rel="preload" href="/fonts/anybody-var.woff" as="font" type="font/woff" crossOrigin="" />
        <link rel="preload" href="/fonts/hanken-grotesk-var.woff" as="font" type="font/woff" crossOrigin="" />
        <noscript dangerouslySetInnerHTML={{ __html: '<style>.reveal{opacity:1!important;transform:none!important}</style>' }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJson) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <ComposeProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </ComposeProvider>
      </body>
    </html>
  );
}
