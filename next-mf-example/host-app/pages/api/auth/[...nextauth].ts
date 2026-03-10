import NextAuth from 'next-auth';
import { authOptions } from './authOptions';
import type { NextApiRequest, NextApiResponse } from 'next';

const nextAuthHandler = NextAuth(authOptions);

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // next-auth v4.22+ added App Router detection that reads req.nextUrl.pathname.
  // In Next.js 15 Pages Router, req.nextUrl is not set — polyfill it to prevent the crash.
  if (!req.nextUrl) {
    (req as any).nextUrl = new URL(req.url ?? '/', `http://${req.headers.host}`);
  }

  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return nextAuthHandler(req, res);
}
