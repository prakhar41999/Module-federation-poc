import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function setCorsHeaders(headers: Headers, origin: string) {
  // Echo back the requesting origin so credentials (cookies) are allowed.
  // Using * would block credential-bearing requests (e.g. useSession).
  headers.set('Access-Control-Allow-Origin', origin || '*');
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';

  // Handle preflight OPTIONS — browser sends this before POST/credentialed GET
  if (request.method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 204 });
    setCorsHeaders(preflight.headers, origin);
    preflight.headers.set('Access-Control-Max-Age', '86400');
    return preflight;
  }

  const response = NextResponse.next();
  setCorsHeaders(response.headers, origin);
  return response;
}

export const config = {
  // basePath is stripped before middleware sees the path, so do NOT include it here
  matcher: '/api/:path*',
};
