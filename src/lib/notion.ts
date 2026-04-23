import {
  Client,
  collectPaginatedAPI,
  isFullDatabase,
  isFullPage,
} from '@notionhq/client';
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client';

// The 2025-09-03 Notion API splits a database into one or more data sources.
// A typical blog database has a single data source, so we just grab the first.
export const notion = new Client({ auth: process.env.NOTION_TOKEN });

function requireDatabaseId(): string {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) {
    throw new Error(
      'NOTION_DATABASE_ID is not set. Copy .env.example to .env.local and fill it in.',
    );
  }
  return id;
}

let cachedDataSourceId: string | null = null;
async function getFirstDataSourceId(): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId;
  const db = await notion.databases.retrieve({
    database_id: requireDatabaseId(),
  });
  if (!isFullDatabase(db)) {
    throw new Error(
      'Got a partial database response — check the integration has access.',
    );
  }
  if (db.data_sources.length === 0) {
    throw new Error('Database has no data sources. Add at least one.');
  }
  cachedDataSourceId = db.data_sources[0].id;
  return cachedDataSourceId;
}

export async function listPosts(): Promise<PageObjectResponse[]> {
  const data_source_id = await getFirstDataSourceId();
  const results = await collectPaginatedAPI(notion.dataSources.query, {
    data_source_id,
  });
  return results.filter(isFullPage);
}

export async function getPostMarkdown(pageId: string): Promise<string> {
  const res = await notion.pages.retrieveMarkdown({ page_id: pageId });
  return res.markdown;
}

export async function getPostById(
  pageId: string,
): Promise<PageObjectResponse | null> {
  const page = await notion.pages.retrieve({ page_id: pageId });
  return isFullPage(page) ? page : null;
}

// ---------- Property readers ----------

export function plainText(
  rich: RichTextItemResponse[] | undefined,
): string {
  if (!rich) return '';
  return rich.map((r) => r.plain_text).join('');
}

export function getPageTitle(page: PageObjectResponse): string {
  for (const prop of Object.values(page.properties)) {
    if (prop.type === 'title') return plainText(prop.title);
  }
  return '(untitled)';
}

export function getPageSummary(page: PageObjectResponse): string {
  const prop = page.properties['Summary'];
  if (prop && prop.type === 'rich_text') return plainText(prop.rich_text);
  return '';
}

export function getPagePublishedDate(
  page: PageObjectResponse,
): string | null {
  for (const name of ['Published', 'Published Date', 'Date']) {
    const prop = page.properties[name];
    if (prop && prop.type === 'date' && prop.date) return prop.date.start;
  }
  return page.created_time;
}

export function getPageCover(page: PageObjectResponse): string | null {
  if (!page.cover) return null;
  return page.cover.type === 'external'
    ? page.cover.external.url
    : page.cover.file.url;
}
