import { cookies } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Project = { id: number; name: string; description?: string | null };
type Task = { id: number; title: string; status: string };

export default async function DashboardPage() {
    const jar = await cookies();
    const token = jar.get('access_token')?.value;
    if (!token) return <section><h1 className="text-xl mb-2">Dashboard</h1><p>Not authenticated. Please sign in.</p></section>;

    const base = process.env.API_URL || 'http://0.0.0.0:8000';
    const [pr, tr] = await Promise.all([
        fetch(`${base}/api/projects/`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
        fetch(`${base}/api/tasks/`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
    ]);

    const projects: Project[] = pr.ok ? await pr.json() : [];
    const tasks: Task[] = tr.ok ? await tr.json() : [];
    const openTasks = tasks.filter(t => String(t.status).toLowerCase() !== 'done').length;

    return (
        <section className="space-y-8">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card><CardHeader><CardTitle>Projects</CardTitle><CardDescription>Total</CardDescription></CardHeader><CardContent><div className="text-3xl font-bold">{projects.length}</div></CardContent></Card>
                <Card><CardHeader><CardTitle>Tasks</CardTitle><CardDescription>Total</CardDescription></CardHeader><CardContent><div className="text-3xl font-bold">{tasks.length}</div></CardContent></Card>
                <Card><CardHeader><CardTitle>Open tasks</CardTitle><CardDescription>Remaining</CardDescription></CardHeader><CardContent><div className="text-3xl font-bold">{openTasks}</div></CardContent></Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {projects.map((p) => (
                            <div key={p.id} className="rounded-md border border-border p-3">
                                <div className="font-medium">{p.name}</div>
                                <div className="text-sm text-muted-foreground">{p.description ?? 'No description'}</div>
                            </div>
                        ))}
                        {!projects.length && <div className="text-sm text-muted-foreground">No projects yet.</div>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {tasks.map((t, i) => (
                                    <TableRow key={`${t.title}-${i}`}>
                                        <TableCell>{t.title}</TableCell>
                                        <TableCell><Badge>{t.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                                {!tasks.length && <TableRow><TableCell colSpan={2} className="text-sm text-muted-foreground">No tasks yet.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
