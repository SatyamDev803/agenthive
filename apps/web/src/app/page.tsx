import Link from 'next/link';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function HomePage() {
  const jar = await cookies();
  const token = jar.get('access_token')?.value;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-xl border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />
        <div className="relative p-10 md:p-16">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Build faster with AgentHive</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">FastAPI backend, Next.js App Router frontend, with secure, server‑only auth.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!token ? (
              <>
                <Button asChild><Link href="/login">Get started</Link></Button>
                <Button asChild variant="outline"><Link href="/register">Create account</Link></Button>
              </>
            ) : (
              <Button asChild><Link href="/dashboard">Go to dashboard</Link></Button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Server‑only Auth</CardTitle><CardDescription>JWT in httpOnly cookie.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground">No tokens in client JS; cookies() reads on the server.</CardContent></Card>
        <Card><CardHeader><CardTitle>Scalable Shell</CardTitle><CardDescription>Dynamic navbar & pages.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground">State derives from cookies; SSR consistent everywhere.</CardContent></Card>
        <Card><CardHeader><CardTitle>Modern UI</CardTitle><CardDescription>shadcn + Tailwind v4.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground">Gradients, grids, accessibility by default.</CardContent></Card>
      </section>
    </div>
  );
}
