import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SearchBar } from "@/components/search-bar";
import { LessonCard } from "@/components/lesson-card";
import { CATEGORIES, LESSON_LIBRARY } from "@/lib/lessons";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Lesson Library — Skill Sensei" },
      {
        name: "description",
        content:
          "Browse immersive first-person lessons across every craft — automotive, cooking, coding, medicine, trades and more.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const [active, setActive] = useState<string>("All");
  const filtered = useMemo(
    () => (active === "All" ? LESSON_LIBRARY : LESSON_LIBRARY.filter((l) => l.category === active)),
    [active],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="border-b border-border/40 bg-surface/20 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">The library</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Every skill, one place.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {LESSON_LIBRARY.length} lessons across {CATEGORIES.length} categories — and thousands more on
            the way.
          </p>
          <div className="mt-6">
            <SearchBar size="md" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                active === c
                  ? "bg-ember text-primary-foreground shadow-glow"
                  : "border border-border/60 bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((l) => (
            <LessonCard key={l.id} lesson={l} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">No lessons in that category yet.</p>
        )}
      </section>
    </div>
  );
}
