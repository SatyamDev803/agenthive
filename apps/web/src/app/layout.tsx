import './globals.css';
import Navigation from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';

export const metadata = { title: 'AgentHive', description: 'FastAPI + Next.js' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navigation />
          <main className="container mx-auto p-6">{children}</main>
          <div className="fixed bottom-4 right-4"><ThemeToggle /></div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
