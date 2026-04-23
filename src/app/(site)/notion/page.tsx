import Link from 'next/link';
import {
  getPageCover,
  getPagePublishedDate,
  getPageSummary,
  getPageTitle,
  listPosts,
} from '@/lib/notion';
import { formatDate } from '@/lib/posts';

export const metadata = { title: 'Notion' };
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function NotionIndex() {
  let posts;
  try {
    posts = await listPosts();
  } catch (err) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-zinc-900 dark:text-zinc-100">
        <h1 className="text-4xl font-semibold tracking-tight">Notion</h1>
        <p className="mt-6 text-red-600 dark:text-red-400">
          Couldn&apos;t load pages: {(err as Error).message}
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          Check that <code>NOTION_TOKEN</code> and{' '}
          <code>NOTION_DATABASE_ID</code> are set in <code>.env.local</code>,
          and that you&apos;ve shared the database with your integration.
        </p>
      </main>
    );
  }

  const sorted = [...posts].sort((a, b) => {
    const da = getPagePublishedDate(a) ?? '';
    const db = getPagePublishedDate(b) ?? '';
    return db.localeCompare(da);
  });

  return (
    <div className="text-zinc-900 dark:text-zinc-100">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-5xl font-semibold tracking-tight">Notion</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Pages pulled live from your Notion database.
          </p>
        </header>

        {sorted.length === 0 ? (
          <p className="text-zinc-500">
            No pages in the database yet. Add one in Notion and refresh.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((page) => {
              const cover = getPageCover(page);
              const publishedDate = getPagePublishedDate(page);
              const summary = getPageSummary(page);
              return (
                <li key={page.id}>
                  <Link href={`/notion/${page.id}`} className="group block">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                      {cover && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cover}
                          alt={getPageTitle(page)}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        />
                      )}
                    </div>
                    <h2 className="mt-4 text-xl font-medium tracking-tight group-hover:underline">
                      {getPageTitle(page)}
                    </h2>
                    {publishedDate && (
                      <p className="mt-1 text-sm text-zinc-500">
                        {formatDate(publishedDate)}
                      </p>
                    )}
                    {summary && (
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {summary}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
