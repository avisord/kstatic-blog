import Link from 'next/link';
import { payload } from '@/lib/payload';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const metadata = { title: 'CMS' };
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function CmsIndex() {
  let posts;
  try {
    const cms = await payload();
    const result = await cms.find({
      collection: 'posts',
      limit: 50,
      sort: '-publishedDate',
      depth: 1,
    });
    posts = result.docs;
  } catch (err) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-zinc-900 dark:text-zinc-100">
        <h1 className="text-4xl font-semibold tracking-tight">CMS</h1>
        <p className="mt-6 text-red-600 dark:text-red-400">
          Couldn&apos;t load posts: {(err as Error).message}
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          Check <code>DATABASE_URI</code>, <code>PAYLOAD_SECRET</code>, and
          the Cloudinary vars in <code>.env.local</code>. Then sign in at{' '}
          <Link href="/admin" className="underline">
            /admin
          </Link>{' '}
          to create the first user and add a post.
        </p>
      </main>
    );
  }

  return (
    <div className="text-zinc-900 dark:text-zinc-100">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-5xl font-semibold tracking-tight">CMS</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Posts served from Payload + MongoDB. Media lives on Cloudinary.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-zinc-500">
            No posts yet. Create one at{' '}
            <Link href="/admin" className="underline">
              /admin
            </Link>
            .
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const cover =
                post.coverImage && typeof post.coverImage === 'object'
                  ? (post.coverImage as { url?: string }).url
                  : null;
              return (
                <li key={post.id}>
                  <Link href={`/cms/${post.slug}`} className="group block">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                      {cover && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cover}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        />
                      )}
                    </div>
                    <h2 className="mt-4 text-xl font-medium tracking-tight group-hover:underline">
                      {post.title}
                    </h2>
                    {post.publishedDate && (
                      <p className="mt-1 text-sm text-zinc-500">
                        {formatDate(post.publishedDate)}
                      </p>
                    )}
                    {post.summary && (
                      <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {post.summary}
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
