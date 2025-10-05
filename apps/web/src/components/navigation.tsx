import Link from 'next/link';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { AUTH_REGISTER_PATH } from '@/lib/config';
import { Hexagon } from 'lucide-react';

export default async function Navigation() {
  const jar = await cookies();
  const token = jar.get('access_token')?.value;
  const registerEnabled = Boolean(AUTH_REGISTER_PATH);

  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border-b border-border">
      <div className="container mx-auto flex items-center justify-between p-2">
        <div className="flex items-center gap-3">
          <Hexagon className="h-6 w-6 text-primary" aria-hidden />
          <span className="text-lg font-semibold"><Link href="/">AgentHive</Link></span>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link href="/">Home</Link></Button>
          {token ? (
            <>
              <Button asChild variant="ghost"><Link href="/dashboard">Dashboard</Link></Button>
              <form action="/api/logout" method="POST">
                <Button type="submit" variant="outline">Logout</Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
              {registerEnabled && <Button asChild variant="default"><Link href="/register">Register</Link></Button>}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
