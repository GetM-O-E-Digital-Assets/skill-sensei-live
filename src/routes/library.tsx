import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { LESSON_LIBRARY, CATEGORIES } from "@/lib/lessons";
import { Badge } from "@/components/ui/badge";
import { Clock, Lock, Play } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Lesson Library — Skill Sensei" },
      {
        name: "description",
        content:
          "Browse immersive first-person lessons across automotive, cooking, woodworking, electronics and more.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(() => {
    if (active === "All") return LESSON_LIBRARY;
    return LESSON_LIBRARY.filter((l) => l.category === active);
  }, [active]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="border-b border-border/40 bg-surface/20 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">
            The library
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Pick a skill to learn.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Every lesson is a real environment. Every action is deliberate. Start with our
            featured automotive lesson — more workshops open weekly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                active === c
                  ? "bg-ember text-primary-foreground shadow-glow"
                  : "border border-border/60 bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <LessonCard key={l.id} lesson={l} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No lessons in that category yet — coming soon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function LessonCard({ lesson }: { lesson: (typeof LESSON_LIBRARY)[number] }) {
  const inner = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition hover:border-ember/40 hover:shadow-panel">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={lesson.cover}
          alt={lesson.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="border border-border/60 bg-background/70 font-mono text-[10px] uppercase tracking-widest backdrop-blur"
          >
            {lesson.category}
          </Badge>
          {!lesson.available && (
            <Badge className="bg-background/70 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
              <Lock className="mr-1 h-2.5 w-2.5" /> Soon
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl leading-tight">{lesson.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{lesson.summary}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> {lesson.totalMinutes} min · {lesson.level}
          </span>
          {lesson.available ? (
            <span className="flex items-center gap-1 font-medium text-ember">
              <Play className="h-3 w-3 fill-ember" /> Start
            </span>
          ) : (
            <span className="text-muted-foreground">In production</span>
          )}
        </div>
      </div>
    </div>
  );

  if (!lesson.available) {
    return <div className="cursor-not-allowed opacity-70">{inner}</div>;
  }
  return (
    <Link
      to="/lesson/$lessonId"
      params={{ lessonId: lesson.id }}
      className="block"
    >
      {inner}
    </Link>
  );
}
