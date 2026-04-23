import Link from 'next/link';
import { formatDate, getSortedPosts, resolveCoverSrc } from '@/lib/posts';

export const metadata = {
  title: 'Blog',
};

export default async function BlogIndex() {
  const sorted = await getSortedPosts();

  return (
    <div className="text-zinc-900 dark:text-zinc-100">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-5xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            All posts, newest first.
          </p>
        </header>

        {sorted.length === 0 ? (
          <p className="text-zinc-500">
            No posts yet. Add one from the{' '}
            <Link href="/keystatic" className="underline">
              admin
            </Link>
            .
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map(({ slug, entry }) => (
              <li key={slug}>
                <Link href={`/blog/${slug}`} className="group block">
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveCoverSrc(slug, entry.coverImage)}
                      alt={entry.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <h2 className="mt-4 text-xl font-medium tracking-tight group-hover:underline">
                    {entry.title}
                  </h2>
                  {entry.publishedDate && (
                    <p className="mt-1 text-sm text-zinc-500">
                      {formatDate(entry.publishedDate)}
                    </p>
                  )}
                  {entry.summary && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {entry.summary}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
