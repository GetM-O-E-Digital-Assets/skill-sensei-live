import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SearchBar } from "@/components/search-bar";
import { LessonRow } from "@/components/lesson-row";
import { LessonCard } from "@/components/lesson-card";
import heroImg from "@/assets/hero-workshop.jpg";
import {
  CATEGORIES,
  LESSON_LIBRARY,
  popularLessons,
  recentlyAddedLessons,
  recommendedFor,
} from "@/lib/lessons";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyProgress, getMyBookmarks } from "@/lib/progress.functions";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skill Sensei — Learn any real-world skill" },
      {
        name: "description",
        content:
          "Search thousands of immersive first-person lessons. Cooking, cars, code, medicine, trades — learn by doing beside an AI instructor.",
      },
      { property: "og:title", content: "Skill Sensei — Learn any real-world skill" },
      {
        property: "og:description",
        content: "Immersive first-person lessons for every craft. Search, tap, master.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s?.user));
    return () => sub.subscription.unsubscribe();
  }, []);

  const getProgress = useServerFn(getMyProgress);
  const getBookmarks = useServerFn(getMyBookmarks);
  const progressQ = useQuery({
    queryKey: ["progress"],
    queryFn: () => getProgress(),
    enabled: signedIn,
  });
  const bookmarksQ = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks(),
    enabled: signedIn,
  });

  const progress = progressQ.data ?? [];
  const bookmarks = bookmarksQ.data ?? [];

  const continueLearning = progress
    .filter((p) => !p.completed)
    .map((p) => LESSON_LIBRARY.find((l) => l.id === p.lesson_id))
    .filter(Boolean) as typeof LESSON_LIBRARY;

  const completed = progress
    .filter((p) => p.completed)
    .map((p) => LESSON_LIBRARY.find((l) => l.id === p.lesson_id))
    .filter(Boolean) as typeof LESSON_LIBRARY;

  const bookmarked = bookmarks
    .map((b) => LESSON_LIBRARY.find((l) => l.id === b.lesson_id))
    .filter(Boolean) as typeof LESSON_LIBRARY;

  const seenIds = progress.map((p) => p.lesson_id);
  const recommended = recommendedFor(seenIds, 8);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO + SEARCH */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="ken-burns h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
          <div className="absolute inset-0 ember-radial" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-ember" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">
              Immersive AI Learning
            </span>
            <span className="h-px w-8 bg-ember" />
          </div>

          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Learn <span className="italic text-ember">any</span> skill.
            <br />
            One action at a time.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Search thousands of lessons — cars, cooking, code, medicine, trades. Step inside a real
            workshop beside an AI instructor.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar size="lg" showSuggestions />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-b border-border/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/search"
                search={{ category: c }}
                className="shrink-0 rounded-full border border-border/60 bg-surface px-4 py-1.5 text-xs text-muted-foreground transition hover:border-ember/40 hover:text-foreground"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAL SECTIONS (signed in) */}
      <div className="mx-auto max-w-7xl pt-4">
        {signedIn && continueLearning.length > 0 && (
          <LessonRow
            eyebrow="Pick up where you left off"
            title="Continue Learning"
            lessons={continueLearning}
          />
        )}
        {signedIn && bookmarked.length > 0 && (
          <LessonRow eyebrow="Saved" title="Bookmarks" lessons={bookmarked} />
        )}

        <LessonRow
          eyebrow="Trending this week"
          title="Popular Skills"
          lessons={popularLessons(10)}
        />
        <LessonRow
          eyebrow="Fresh off the workshop"
          title="Recently Added"
          lessons={recentlyAddedLessons(10)}
        />
        <LessonRow
          eyebrow="Tuned to you"
          title="Recommended For You"
          lessons={recommended}
        />

        {signedIn && completed.length > 0 && (
          <LessonRow eyebrow="Nice work" title="Completed Skills" lessons={completed} />
        )}
      </div>

      {/* BROWSE ALL */}
      <section className="mx-auto mt-16 max-w-7xl px-4 pb-24 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">
              The full library
            </p>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl">Browse every skill</h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {LESSON_LIBRARY.slice(0, 12).map((l) => (
            <LessonCard key={l.id} lesson={l} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/search"
            className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface px-5 py-2 text-sm text-muted-foreground hover:border-ember/40 hover:text-foreground"
          >
            See all {LESSON_LIBRARY.length} lessons
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Skill Sensei. Learn by doing.</p>
          <p className="font-mono uppercase tracking-widest">v0.2 · beta</p>
        </div>
      </footer>
    </div>
  );
}
