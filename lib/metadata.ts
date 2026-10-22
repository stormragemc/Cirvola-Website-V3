import type { Metadata } from 'next';
import { site } from '@/content/site';

/** Per-page <head> tags: title, description, canonical URL and social previews. */
export function pageMetadata({ path, title, description }: { path: string; title?: string; description?: string }): Metadata {
  const fullTitle = path === '/' ? 'Cirvola | Waste to wonder' : `${title} | Cirvola`;
  const desc = description || site.description;
  const url = `${site.url}${path === '/' ? '' : path}`;
  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'Cirvola',
      title: fullTitle,
      description: desc,
      url,
      images: [`${site.url}/images/og-cover.jpg`],
    },
    twitter: { card: 'summary_large_image' },
  };
}
