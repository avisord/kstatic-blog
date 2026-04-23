import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export function resolveCoverSrc(slug: string, filename: string | null): string {
  if (!filename) return '';
  if (/^(https?:)?\/\//.test(filename) || filename.startsWith('/')) {
    return filename;
  }
  return `/images/posts/${slug}/${filename}`;
}

export async function getSortedPosts() {
  const posts = await reader.collections.posts.all();
  return [...posts].sort((a, b) => {
    const da = a.entry.publishedDate ?? '';
    const db = b.entry.publishedDate ?? '';
    return db.localeCompare(da);
  });
}

export function formatDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
