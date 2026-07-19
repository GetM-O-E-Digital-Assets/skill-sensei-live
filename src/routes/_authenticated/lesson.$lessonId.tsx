import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLesson } from "@/lib/lessons";
import { LessonViewer } from "@/components/lesson-viewer";

export const Route = createFileRoute("/_authenticated/lesson/$lessonId")({
  loader: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.lesson.title} — Skill Sensei` },
          { name: "description", content: loaderData.lesson.summary },
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
        <h1 className="mt-2 font-serif text-3xl">This lesson isn't available yet</h1>
        <p className="mt-2 text-muted-foreground">Check back soon — new workshops open weekly.</p>
      </div>
    </div>
  ),
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  return <LessonViewer lesson={lesson} />;
}
