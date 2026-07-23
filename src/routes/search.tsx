import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SiteHeader } from "@/components/site-header";
import { SearchBar } from "@/components/search-bar";
import { LessonCard } from "@/components/lesson-card";
import { CATEGORIES, searchLessons } from "@/lib/lessons";
import { useMemo } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "").default(""),
  sort: fallback(z.string(), "relevance").default("relevance"),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search skills — Skill Sensei" },
      { name: "description", content: "Search thousands of immersive lessons across every craft." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q, category, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  const activeCategory = category || "All";

  const results = useMemo(() => {
    const list = searchLessons(q, activeCategory);
    if (sort === "popular") return [...list].sort((a, b) => b.popularityScore - a.popularityScore);
    if (sort === "newest") return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === "rating") return [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "shortest") return [...list].sort((a, b) => a.totalMinutes - b.totalMinutes);
    return list;
  }, [q, activeCategory, sort]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="border-b border-border/40 bg-surface/20 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SearchBar size="lg" initial={q} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {["All", ...CATEGORIES].map((c) => {
            const isActive = activeCategory === c;
            return (
              <button
                key={c}
                onClick={() =>
                  navigate({
                    search: { q, category: c === "All" ? "" : c, sort },
                  })
                }
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-ember text-primary-foreground shadow-glow"
                    : "border border-border/60 bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {results.length} lesson{results.length === 1 ? "" : "s"}
            {q ? ` for "${q}"` : ""}
            {category ? ` in ${category}` : ""}
          </p>
          <select
            value={sort}
            onChange={(e) =>
              navigate({ search: { q, category, sort: e.target.value } })
            }
            className="rounded-full border border-border/60 bg-surface px-3 py-1.5 text-xs text-foreground focus:outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="popular">Most popular</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest rated</option>
            <option value="shortest">Shortest first</option>
          </select>
        </div>

        {q && (
          <Link
            to="/lesson/generated/$topic"
            params={{ topic: encodeURIComponent(q) }}
            className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-ember/40 bg-gradient-to-r from-ember/10 via-surface/40 to-surface/20 p-4 transition hover:border-ember/60 hover:shadow-glow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ember to-primary shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">Ask Sensei</p>
                <p className="truncate font-serif text-base sm:text-lg">
                  Generate an interactive lesson for "{q}"
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Objectives · tools · safety · step-by-step hotspots · AI instructor
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-ember" />
          </Link>
        )}

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-surface/30 p-12 text-center">
            <p className="font-serif text-xl">
              {q ? `No lessons in the catalog match "${q}" yet` : "No lessons match yet"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {q
                ? "Tap the card above to have Sensei design one for you in seconds."
                : "Try a broader term — new lessons are added weekly."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((l) => (
              <LessonCard key={l.id} lesson={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
