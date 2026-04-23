import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import Markdoc from '@markdoc/markdoc';
import {
  getPageCover,
  getPagePublishedDate,
  getPageSummary,
  getPageTitle,
  getPostById,
  getPostMarkdown,
} from '@/lib/notion';
import { formatDate } from '@/lib/posts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const page = await getPostById(id);
    if (!page) return {};
    return {
      title: getPageTitle(page),
      description: getPageSummary(page) || undefined,
    };
  } catch {
    return {};
  }
}

export default async function NotionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const page = await getPostById(id);
  if (!page) notFound();

  const markdown = await getPostMarkdown(page.id);
  const ast = Markdoc.parse(markdown);
  const transformed = Markdoc.transform(ast);
  const rendered = Markdoc.renderers.react(transformed, React);

  const title = getPageTitle(page);
  const summary = getPageSummary(page);
  const cover = getPageCover(page);
  const publishedDate = getPagePublishedDate(page);

  return (
    <article className="text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 pt-8">
        <Link
          href="/notion"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← All pages
        </Link>
      </div>

      <header className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {summary && (
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {summary}
          </p>
        )}
        {publishedDate && (
          <p className="mt-6 text-sm text-zinc-500">
            {formatDate(publishedDate)}
          </p>
        )}
      </header>

      {cover && (
        <figure className="mx-auto max-w-5xl px-6">
          <div className="aspect-[2/1] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={title}
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
