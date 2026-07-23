import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { generateLesson } from "@/lib/generate-lesson.functions";
import { LessonViewer } from "@/components/lesson-viewer";
import type { Lesson } from "@/lib/lessons";
import heroImg from "@/assets/hero-workshop.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catWood from "@/assets/cat-woodshop.jpg";
import catElectronics from "@/assets/cat-electronics.jpg";
import scene1 from "@/assets/lesson-oil-scene-1-hood.jpg";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const COVER_BY_CAT: Record<string, string> = {
  Automotive: scene1,
  Mechanics: scene1,
  Cooking: catKitchen,
  Woodworking: catWood,
  Construction: catWood,
  Trades: catWood,
  Technology: catElectronics,
  Programming: catElectronics,
  Electrical: catElectronics,
};

export const Route = createFileRoute("/_authenticated/lesson/generated/$topic")({
  head: ({ params }) => {
    const decoded = decodeURIComponent(params.topic);
    return {
      meta: [
        { title: `${decoded} — AI Lesson · Skill Sensei` },
        { name: "description", content: `An AI-generated interactive lesson teaching ${decoded} step by step.` },
        { property: "og:title", content: `${decoded} — Skill Sensei` },
        { property: "og:description", content: `Learn ${decoded} with an AI-generated interactive lesson.` },
      ],
    };
  },
  component: GeneratedLessonPage,
});

function GeneratedLessonPage() {
  const { topic } = Route.useParams();
  const decoded = decodeURIComponent(topic);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["gen-lesson", decoded],
    queryFn: () => generateLesson({ data: { topic: decoded } }),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0,
  });

  if (isLoading || (isFetching && !data)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ember to-primary shadow-glow">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">Sensei is designing your lesson</p>
          <p className="mt-2 font-serif text-2xl">"{decoded}"</p>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Structuring learning objectives, tools, safety notes, and hands-on hotspots into an interactive lesson.
        </p>
        <Loader2 className="h-5 w-5 animate-spin text-ember" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ember">Generation failed</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {(error as Error)?.message ?? "Something went wrong. Try again in a moment."}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/library"><ArrowLeft className="mr-1 h-4 w-4" /> Library</Link>
          </Button>
          <Button onClick={() => refetch()} className="shadow-glow">Try again</Button>
        </div>
      </div>
    );
  }

  const cover = COVER_BY_CAT[data.category] ?? heroImg;
  const lesson: Lesson = {
    id: `ai-${topic}`,
    title: data.title,
    category: data.category,
    instructor: data.instructor,
    level: data.level,
    totalMinutes: data.totalMinutes,
    cover,
    summary: data.summary,
    environment: data.environment,
    steps: data.steps.map((s) => ({
      id: s.id,
      title: s.title,
      scene: cover,
      intro: s.intro,
      duration: s.duration,
      hotspots: s.hotspots.map((h) => ({
        id: h.id,
        label: h.label,
        x: h.x,
        y: h.y,
        action: h.action,
        why: h.why,
        tips: h.tips,
        warning: h.warning,
        mistake: h.mistake,
        demo: { kind: "scene-zoom" as const, scene: cover, x: h.x, y: h.y, duration: 4 },
      })),
    })),
  };

  return (
    <div>
      <div className="border-b border-ember/30 bg-ember/10 px-4 py-2 text-center text-xs">
        <span className="font-mono uppercase tracking-widest text-ember">AI-Generated</span>
        <span className="ml-2 text-muted-foreground">
          Designed live by Sensei · Objectives: {data.objectives.slice(0, 3).join(" · ")}
        </span>
      </div>
      <LessonViewer lesson={lesson} />
    </div>
  );
}
