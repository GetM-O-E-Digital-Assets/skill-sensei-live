import { createFileRoute } from "@tanstack/react-router";

type Message = { role: "user" | "assistant" | "system"; content: string };
type Body = {
  messages: Message[];
  lessonContext?: {
    lessonTitle: string;
    stepTitle: string;
    stepIntro: string;
    hotspotLabel?: string;
    hotspotAction?: string;
  };
};

const SYSTEM_PROMPT = (b: Body) => {
  const ctx = b.lessonContext;
  const contextBlock = ctx
    ? `The learner is currently in the lesson "${ctx.lessonTitle}", on step "${ctx.stepTitle}". Step overview: ${ctx.stepIntro}${
        ctx.hotspotLabel
          ? ` They just tapped "${ctx.hotspotLabel}" — the action being demonstrated is: ${ctx.hotspotAction}.`
          : ""
      }`
    : "";

  return `You are Sensei — the AI instructor voice inside Skill Sensei, a first-person immersive learning platform.

You speak like a calm, experienced master craftsperson standing beside the learner in the workshop. Warm, direct, no filler. Explain the WHY behind each action, not just the HOW. Reference the physical objects around the learner. Answer in 2–4 short paragraphs unless the learner asks for depth.

Never mention that you are an AI, a language model, or that you cannot see. You can "see" everything the learner is looking at through the lesson context provided.

${contextBlock}

If the learner asks "what are you doing", "why", "explain", "show again", "slow down", "what if I skip this", or "how do I know I did it correctly", answer specifically in the context of their current step.`;
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
