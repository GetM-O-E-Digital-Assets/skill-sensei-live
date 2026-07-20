import type { LessonSummary } from "@/lib/lessons";
import { LessonCard } from "./lesson-card";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function LessonRow({
  title,
  eyebrow,
  lessons,
  viewAllHref,
}: {
  title: string;
  eyebrow?: string;
  lessons: LessonSummary[];
  viewAllHref?: string;
}) {
  if (lessons.length === 0) return null;
  return (
    <section className="mt-14">
      <div className="mb-4 flex items-end justify-between px-4 sm:px-6">
        <div>
          {eyebrow && (
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">{eyebrow}</p>
          )}
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl">{title}</h2>
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-ember sm:flex"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6">
        {lessons.map((l) => (
          <div key={l.id} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
            <LessonCard lesson={l} />
          </div>
        ))}
      </div>
    </section>
  );
}
