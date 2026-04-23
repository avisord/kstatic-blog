import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazily construct the handler so env-var validation in makeRouteHandler
// does not run during Next.js's build-time module evaluation. Keystatic's
// GitHub-storage mode requires KEYSTATIC_GITHUB_CLIENT_ID / CLIENT_SECRET /
// SECRET, which aren't set until the /keystatic/setup wizard is run.
let handler: ReturnType<typeof makeRouteHandler> | null = null;
function getHandler() {
  if (!handler) handler = makeRouteHandler({ config });
  return handler;
}

export function GET(request: Request) {
  return getHandler().GET(request);
}

export function POST(request: Request) {
  return getHandler().POST(request);
}
