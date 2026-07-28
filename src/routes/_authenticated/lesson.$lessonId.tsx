import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLessonSummary } from "@/lib/lessons";
import { AiLesson } from "@/components/ai-lesson";

export const Route = createFileRoute("/_authenticated/lesson/$lessonId")({
  loader: ({ params }) => {
    const summary = getLessonSummary(params.lessonId);
    if (!summary) throw notFound();
    return { summary };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.summary.title} — Skill Sensei` },
          { name: "description", content: loaderData.summary.summary },
          { property: "og:title", content: `${loaderData.summary.title} — Skill Sensei` },
          { property: "og:description", content: loaderData.summary.summary },
        ]
      : [{ title: "Lesson — Skill Sensei" }],
  }),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ember">Lesson error</p>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ember">Not found</p>
        <h1 className="mt-2 font-serif text-3xl">This lesson isn't in the catalog</h1>
        <p className="mt-2 text-muted-foreground">Try searching for a different skill.</p>
      </div>
    </div>
  ),
  component: LessonPage,
});

function LessonPage() {
  const { summary } = Route.useLoaderData();
  return (
    <AiLesson
      key={summary.id}
      lessonId={summary.id}
      topic={`${summary.title} (${summary.category}) — ${summary.summary}`}
    />
  );
}
