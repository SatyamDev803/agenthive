import { NextResponse } from 'next/server';
import { API_URL, AUTH_REGISTER_PATH } from '@/lib/config';

export async function POST(req: Request) {
  if (!AUTH_REGISTER_PATH) {
    return NextResponse.json({ error: 'Registration disabled' }, { status: 404 });
  }
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const url = new URL(`${API_URL}${AUTH_REGISTER_PATH}`);
  url.searchParams.set('email', String(email));
  url.searchParams.set('password', String(password));
  if (name) url.searchParams.set('name', String(name));

  const r = await fetch(url.toString(), { method: 'POST' });

  if (!r.ok) {
    const msg = await r.text().catch(() => '');
    return NextResponse.json({ error: msg || 'Registration failed' }, { status: r.status });
  }
  return NextResponse.json({ ok: true });
}
