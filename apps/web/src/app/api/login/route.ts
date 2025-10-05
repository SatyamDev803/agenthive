// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import { API_URL, AUTH_LOGIN_PATH } from '@/lib/config';

export async function POST(req: Request) {
  const { email, username, identifier, password } = await req.json();
  const id = identifier ?? email ?? username;

  let r = await fetch(`${API_URL}${AUTH_LOGIN_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: id, password }),
  });

  if (!r.ok) {
    r = await fetch(`${API_URL}${AUTH_LOGIN_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: id, password }),
    });
  }

  if (!r.ok) {
    const msg = await r.text().catch(() => '');
    return NextResponse.json({ error: msg || 'Invalid credentials' }, { status: r.status });
  }

  const { access_token } = await r.json();
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set('access_token', access_token, {
    httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 30,
  });
  return resp;
}
