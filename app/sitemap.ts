import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

const paths = ['/', '/events', '/recipes', '/lab', '/about', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: `${site.url}${p === '/' ? '' : p}` }));
}
