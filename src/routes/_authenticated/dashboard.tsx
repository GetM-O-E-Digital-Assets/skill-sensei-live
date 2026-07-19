import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { getMyProgress, getMyBookmarks } from "@/lib/progress.functions";
import { LESSON_LIBRARY } from "@/lib/lessons";
import { Bookmark, Trophy, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "My progress — Skill Sensei" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const getProgress = useServerFn(getMyProgress);
  const getBookmarks = useServerFn(getMyBookmarks);
  const progressQ = useQuery({ queryKey: ["progress"], queryFn: () => getProgress() });
  const bookmarksQ = useQuery({ queryKey: ["bookmarks"], queryFn: () => getBookmarks() });

  const progress = progressQ.data ?? [];
  const bookmarks = bookmarksQ.data ?? [];
  const completedCount = progress.filter((p) => p.completed).length;
  const inProgressCount = progress.filter((p) => !p.completed).length;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">
          Your workshop
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Welcome back.</h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Flame />} label="In progress" value={inProgressCount} />
          <StatCard icon={<Trophy />} label="Completed" value={completedCount} />
          <StatCard icon={<Bookmark />} label="Bookmarked" value={bookmarks.length} />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-serif text-2xl">Continue where you left off</h2>
            {progress.length === 0 ? (
              <EmptyState
                title="No lessons started yet"
                body="Pick one from the library and step into your first workshop."
              />
            ) : (
              <ul className="space-y-3">
                {progress.map((p) => {
                  const lesson = LESSON_LIBRARY.find((l) => l.id === p.lesson_id);
                  if (!lesson) return null;
                  return (
                    <LessonRow
                      key={p.id}
                      cover={lesson.cover}
                      title={lesson.title}
                      subtitle={p.completed ? "Completed" : `Step ${p.step_index + 1}`}
                      to={lesson.id}
                    />
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl">Bookmarks</h2>
            {bookmarks.length === 0 ? (
              <EmptyState title="Nothing saved" body="Bookmark a lesson to return to it later." />
            ) : (
              <ul className="space-y-3">
                {bookmarks.map((b) => {
                  const lesson = LESSON_LIBRARY.find((l) => l.id === b.lesson_id);
                  if (!lesson) return null;
                  return (
                    <LessonRow
                      key={b.id}
                      cover={lesson.cover}
                      title={lesson.title}
                      subtitle={lesson.category}
                      to={lesson.id}
                    />
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-ember">
          {icon}
        </div>
        <span className="font-serif text-4xl">{value}</span>
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function LessonRow({
  cover,
  title,
  subtitle,
  to,
}: {
  cover: string;
  title: string;
  subtitle: string;
  to: string;
}) {
  return (
    <li>
      <Link
        to="/lesson/$lessonId"
        params={{ lessonId: to }}
        className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-3 transition hover:border-ember/40"
      >
        <img src={cover} alt="" className="h-14 w-20 rounded-md object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-ember" />
      </Link>
    </li>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/50 bg-surface/30 p-8 text-center">
      <p className="font-serif text-xl">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Button asChild className="mt-4" variant="outline">
        <Link to="/library">Browse the library</Link>
      </Button>
    </div>
  );
}
