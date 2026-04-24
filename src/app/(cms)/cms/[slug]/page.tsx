import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { payload } from '@/lib/payload';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function findBySlug(slug: string) {
  const cms = await payload();
  const { docs } = await cms.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return docs[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const post = await findBySlug(slug);
    if (!post) return {};
    return {
      title: post.title,
      description: post.summary || undefined,
    };
  } catch {
    return {};
  }
}

export default async function CmsPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await findBySlug(slug);
  if (!post) notFound();

  const cover =
    post.coverImage && typeof post.coverImage === 'object'
      ? (post.coverImage as { url?: string; alt?: string | null }).url
      : null;

  return (
    <article className="text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 pt-8">
        <Link
          href="/cms"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← All posts
        </Link>
      </div>

      <header className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        {post.summary && (
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {post.summary}
          </p>
        )}
        {post.publishedDate && (
          <p className="mt-6 text-sm text-zinc-500">
            {formatDate(post.publishedDate)}
          </p>
        )}
      </header>

      {cover && (
        <figure className="mx-auto max-w-5xl px-6">
          <div className="aspect-[2/1] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </figure>
      )}

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
          {post.content && (
            <RichText data={post.content as SerializedEditorState} />
          )}
        </div>
      </div>
    </article>
  );
}
