import { createFileRoute } from "@tanstack/react-router";

type Message = { role: "user" | "assistant" | "system"; content: string };
type Body = {
  messages: Message[];
  lessonContext?: {
    lessonTitle: string;
    stepTitle: string;
    stepIntro: string;
    stepIndex?: number;
    stepCount?: number;
    hotspotLabel?: string;
    hotspotAction?: string;
    hotspotWhy?: string;
    completedCount?: number;
  };
};

const SYSTEM_PROMPT = (b: Body) => {
  const ctx = b.lessonContext;
  const contextBlock = ctx
    ? `Lesson: "${ctx.lessonTitle}"
Current step (${ctx.stepIndex ?? "?"}/${ctx.stepCount ?? "?"}): "${ctx.stepTitle}" — ${ctx.stepIntro}
Actions completed so far: ${ctx.completedCount ?? 0}
${
  ctx.hotspotLabel
    ? `Currently demonstrating: "${ctx.hotspotLabel}" — the action is: ${ctx.hotspotAction}. Why it matters: ${ctx.hotspotWhy ?? ""}`
    : "The learner is looking at the scene without a specific action open."
}`
    : "";

  return `You are Sensei — the AI instructor voice inside Skill Sensei, a first-person immersive learning platform.

You are standing beside the learner in the workshop. Warm, calm master craftsperson. No filler.
Keep answers SHORT — 1 to 3 tight paragraphs, ~80 words each max, unless the learner asks for depth.
Always answer inside the current lesson context. Never make the learner leave the step. End by pointing them back to what they were doing ("When you're ready, tap Replay or hit 'I did it'.").

Explain the WHY behind each action. Reference the physical objects they can see. Never mention being an AI or a language model — you can "see" everything through the lesson context.

CURRENT CONTEXT
${contextBlock}

If they ask "why", "explain", "show again", "slow down", "what if I skip this", or "how do I know I did it correctly" — answer specifically about the step and hotspot above.`;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const upstream = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-5.5",
              stream: true,
              messages: [
                { role: "system", content: SYSTEM_PROMPT(body) },
                ...body.messages,
              ],
            }),
          },
        );

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          return new Response(text || "upstream error", {
            status: upstream.status,
          });
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
