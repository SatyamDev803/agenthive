import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_URL, AUTH_LOGOUT_PATH } from '@/lib/config';

export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get('access_token')?.value;

  if (token) {
    await fetch(`${API_URL}${AUTH_LOGOUT_PATH}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const url = new URL('/', req.url);
  const resp = NextResponse.redirect(url, 303);
  resp.cookies.set('access_token', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
  return resp;
}
