import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import Markdoc from '@markdoc/markdoc';
import { fields } from '@keystatic/core';
import { componentBlocks } from '@/keystatic/components';
import { renderComponents, Gallery } from '@/keystatic/renderers';
import { formatDate, reader, resolveCoverSrc } from '@/lib/posts';

const markdocConfig = fields.markdoc.createMarkdocConfig({
  components: componentBlocks,
  render: {
    tags: {
      callout: 'Callout',
      youtube: 'YouTube',
      gallery: 'Gallery',
    },
  },
});

export async function generateStaticParams() {
  const posts = await reader.collections.posts.list();
  return posts.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await reader.collections.posts.read(slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await reader.collections.posts.read(slug);
  if (!post) notFound();

  const { node } = await post.content();
  const transformed = Markdoc.transform(node, markdocConfig);
  const imageBase = `/images/posts/${slug}`;
  const rendered = Markdoc.renderers.react(transformed, React, {
    components: {
      ...renderComponents,
      Gallery: (props: React.ComponentProps<typeof Gallery>) => (
        <Gallery {...props} imageBase={imageBase} />
      ),
    },
  });

  const coverSrc = resolveCoverSrc(slug, post.coverImage);

  return (
    <article className="text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 pt-8">
        <Link
          href="/blog"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← All posts
        </Link>
      </div>

      <header className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl max-w-4xl">
          {post.title}
        </h1>
        {post.summary && (
          <p className="mt-5 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {post.summary}
          </p>
        )}
        {post.publishedDate && (
          <p className="mt-6 text-sm text-zinc-500">
            {formatDate(post.publishedDate)}
          </p>
        )}
      </header>

      {coverSrc && (
        <figure className="mx-auto max-w-5xl px-6">
          <div className="aspect-[2/1] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverSrc}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </figure>
      )}

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
          {rendered}
        </div>
      </div>
    </article>
  );
}
