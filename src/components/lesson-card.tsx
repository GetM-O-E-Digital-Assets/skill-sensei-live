import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Users, Wrench, Package } from "lucide-react";
import type { LessonSummary } from "@/lib/lessons";

export function LessonCard({
  lesson,
  progress,
}: {
  lesson: LessonSummary;
  /** Optional 0-100 progress overlay. */
  progress?: number;
}) {
  return (
    <Link
      to="/lesson/$lessonId"
      params={{ lessonId: lesson.id }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition hover:-translate-y-0.5 hover:border-ember/40 hover:shadow-panel"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={lesson.cover}
          alt={lesson.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="border border-border/60 bg-background/70 font-mono text-[10px] uppercase tracking-widest backdrop-blur"
          >
            {lesson.category}
          </Badge>
          <Badge className="border border-border/60 bg-background/70 font-mono text-[10px] uppercase tracking-widest text-foreground backdrop-blur">
            {lesson.level}
          </Badge>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/70 px-2 py-0.5 text-[11px] backdrop-blur">
          <Star className="h-3 w-3 fill-ember text-ember" />
          <span className="font-medium">{lesson.rating.toFixed(1)}</span>
        </div>
        {typeof progress === "number" && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-background/40">
            <div className="h-full bg-ember" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-serif text-lg leading-tight">{lesson.title}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted-foreground">{lesson.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lesson.totalMinutes} min</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{formatCount(lesson.studentsCompleted)}</span>
          {lesson.tools.length > 0 && (
            <span className="flex items-center gap-1"><Wrench className="h-3 w-3" />{lesson.tools.length} tools</span>
          )}
          {lesson.materials.length > 0 && (
            <span className="flex items-center gap-1"><Package className="h-3 w-3" />{lesson.materials.length} materials</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `${n}`;
}
