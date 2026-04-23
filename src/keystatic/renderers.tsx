import type React from 'react';

type Intent = 'info' | 'warning' | 'danger';

const intentStyles: Record<Intent, string> = {
  info: 'border-blue-400 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100',
  warning:
    'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100',
  danger:
    'border-red-400 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100',
};

export function Callout({
  intent = 'info',
  children,
}: {
  intent?: Intent;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`my-6 border-l-4 rounded-r px-5 py-4 not-prose ${intentStyles[intent]}`}
    >
      <div className="prose prose-zinc dark:prose-invert prose-p:my-0 max-w-none">
        {children}
      </div>
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function YouTube({ url, caption }: { url: string; caption?: string }) {
  const id = extractYouTubeId(url ?? '');
  if (!id) {
    return (
      <div className="my-6 text-sm text-red-600">
        Invalid YouTube URL: {url}
      </div>
    );
  }
  return (
    <figure className="my-6 not-prose">
      <div className="aspect-video overflow-hidden rounded-lg">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={caption || 'YouTube video'}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

type GalleryItem = { image: string; alt?: string; caption?: string };

const columnClass: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 md:grid-cols-3',
  '4': 'sm:grid-cols-2 md:grid-cols-4',
};

function resolveImageSrc(src: string, imageBase?: string): string {
  if (!src) return '';
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/')) return src;
  if (!imageBase) return src;
  return `${imageBase.replace(/\/*$/, '')}/${src}`;
}

export function Gallery({
  images,
  columns = '3',
  imageBase,
}: {
  images: GalleryItem[];
  columns?: '2' | '3' | '4';
  imageBase?: string;
}) {
  if (!Array.isArray(images) || images.length === 0) return null;
  return (
    <div
      className={`my-6 grid grid-cols-1 gap-3 not-prose ${columnClass[columns] ?? columnClass['3']}`}
    >
      {images.map((item, i) => (
        <figure key={i} className="m-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImageSrc(item.image, imageBase)}
            alt={item.alt ?? ''}
            className="block w-full rounded-md object-cover aspect-square"
            loading="lazy"
          />
          {item.caption && (
            <figcaption className="mt-1 text-xs text-zinc-500 text-center">
              {item.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

export const renderComponents = {
  Callout,
  YouTube,
  Gallery,
};
