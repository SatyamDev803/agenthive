import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const isProtected = path.startsWith('/dashboard');
  const isAuthPage = path === '/login' || path === '/register';

  if (isProtected && !token) { url.pathname = '/login'; return NextResponse.redirect(url); }
  if (isAuthPage && token) { url.pathname = '/dashboard'; return NextResponse.redirect(url); }
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*', '/login', '/register'] };
