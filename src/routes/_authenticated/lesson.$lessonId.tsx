import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLessonOrPreview } from "@/lib/lessons";
import { LessonViewer } from "@/components/lesson-viewer";

export const Route = createFileRoute("/_authenticated/lesson/$lessonId")({
  loader: ({ params }) => {
    try {
      return getLessonOrPreview(params.lessonId);
    } catch {
      throw notFound();
    }
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
        <h1 className="mt-2 font-serif text-3xl">This lesson isn't in the catalog</h1>
        <p className="mt-2 text-muted-foreground">Try searching for a different skill.</p>
      </div>
    </div>
  ),
  component: LessonPage,
});

function LessonPage() {
  const { lesson, preview } = Route.useLoaderData();
  return (
    <div>
      {preview && (
        <div className="border-b border-ember/30 bg-ember/10 py-2 text-center text-xs">
          <span className="font-mono uppercase tracking-widest text-ember">Preview</span>
          <span className="ml-2 text-muted-foreground">
            Authored lesson coming soon — try the engine using our reference lesson.
          </span>
        </div>
      )}
      <LessonViewer lesson={lesson} />
    </div>
  );
}
