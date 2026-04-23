import Link from 'next/link';
import { formatDate, getSortedPosts, resolveCoverSrc } from '@/lib/posts';

export default async function Home() {
  const posts = await getSortedPosts();
  const [hero, ...rest] = posts;
  const secondary = rest.slice(0, 4);

  return (
    <div className="text-zinc-900 dark:text-zinc-100">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
          A static home,
          <br />
          <span className="text-zinc-500">a dynamic blog.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          This home page is hand-coded. The blog is managed by the site owner
          through the Keystatic admin — no code, no deploy.
        </p>
      </section>

      {hero && (
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <Link
            href={`/blog/${hero.slug}`}
            className="group block overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="aspect-[2/1] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveCoverSrc(hero.slug, hero.entry.coverImage)}
                alt={hero.entry.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Latest post
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl group-hover:underline">
                {hero.entry.title}
              </h2>
              {hero.entry.summary && (
                <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
                  {hero.entry.summary}
                </p>
              )}
              {hero.entry.publishedDate && (
                <p className="mt-4 text-sm text-zinc-500">
                  {formatDate(hero.entry.publishedDate)}
                </p>
              )}
            </div>
          </Link>
        </section>
      )}

      {secondary.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500">
              More posts
            </h2>
            <Link
              href="/blog"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              All posts →
            </Link>
          </div>
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {secondary.map(({ slug, entry }) => (
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
                  <h3 className="mt-4 text-xl font-medium group-hover:underline">
                    {entry.title}
                  </h3>
                  {entry.publishedDate && (
                    <p className="mt-1 text-sm text-zinc-500">
                      {formatDate(entry.publishedDate)}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
