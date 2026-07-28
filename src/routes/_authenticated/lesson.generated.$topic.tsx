import { createFileRoute } from "@tanstack/react-router";
import { AiLesson } from "@/components/ai-lesson";

export const Route = createFileRoute("/_authenticated/lesson/generated/$topic")({
  head: ({ params }) => {
    const decoded = decodeURIComponent(params.topic);
    return {
      meta: [
        { title: `${decoded} — AI Lesson · Skill Sensei` },
        {
          name: "description",
          content: `An AI-generated interactive lesson teaching ${decoded} step by step.`,
        },
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
  return <AiLesson key={decoded} lessonId={`ai-${topic}`} topic={decoded} />;
}
