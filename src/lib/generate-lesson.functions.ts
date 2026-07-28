import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ topic: z.string().min(2).max(200) });

const ALLOWED_CATS = [
  "Automotive","Cooking","DIY","Home Repair","Construction","Woodworking","Electrical",
  "Plumbing","Mechanics","Technology","Programming","Business","Fitness","Medical",
  "Science","Music","Photography","Art","Trades","Outdoor","Gardening",
] as const;

export type GeneratedLessonRaw = {
  title: string;
  category: (typeof ALLOWED_CATS)[number];
  level: "Beginner" | "Intermediate" | "Advanced";
  totalMinutes: number;
  summary: string;
  environment: string;
  instructor: string;
  objectives: string[];
  tools: string[];
  materials: string[];
  safety: string[];
  steps: Array<{
    id: string;
    title: string;
    intro: string;
    duration: string;
    hotspots: Array<{
      id: string;
      label: string;
      x: number;
      y: number;
      action: string;
      why: string;
      tips?: string[];
      warning?: string;
      mistake?: string;
    }>;
  }>;
};

const SYSTEM = `You are a master curriculum designer for Skill Sensei, a first-person immersive skill learning platform.
Given a real-world skill topic, produce a complete interactive lesson as STRICT JSON — no prose, no code fences, no markdown.

Return an object with exactly this shape:
{
  "title": string (concise, imperative if possible),
  "category": one of: Automotive, Cooking, DIY, Home Repair, Construction, Woodworking, Electrical, Plumbing, Mechanics, Technology, Programming, Business, Fitness, Medical, Science, Music, Photography, Art, Trades, Outdoor, Gardening,
  "level": "Beginner" | "Intermediate" | "Advanced",
  "totalMinutes": integer between 10 and 120,
  "summary": one vivid sentence hook,
  "environment": short phrase (e.g. "Professional garage", "Home kitchen"),
  "instructor": realistic name + credential (e.g. "Marcus Reid, ASE Master Technician"),
  "objectives": array of 3-5 concrete learning outcomes,
  "tools": array of strings,
  "materials": array of strings,
  "safety": array of 2-4 short safety notes,
  "steps": array of 3-5 items, each:
    {
      "id": kebab-case,
      "title": short step title,
      "intro": one short orienting line,
      "duration": e.g. "5 min",
      "hotspots": array of 2-4 items, each:
        {
          "id": kebab-case,
          "label": short noun for the object (e.g. "Drain plug"),
          "x": number 20-80 (percentage across scene),
          "y": number 25-80 (percentage down scene),
          "action": imperative verb phrase (e.g. "Break the drain plug loose"),
          "why": one sentence explaining the reason,
          "tips": array of 1-3 short bullets,
          "warning": short safety warning (only when relevant),
          "mistake": one common mistake to avoid (only when relevant)
        }
    }
}

Every hotspot must be ONE physical object with ONE clear action a learner performs. Keep language tight, expert, warm.
Return ONLY the JSON object.`;

export const generateLesson = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<GeneratedLessonRaw> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-5.5",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Skill topic: ${data.topic}\n\nReturn the JSON lesson now.` },
        ],
      }),
    });

    if (r.status === 429) throw new Error("Rate limit hit — try again in a moment.");
    if (r.status === 402) throw new Error("AI credits exhausted. Add credits to keep generating lessons.");
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      throw new Error(`Generation failed (${r.status}): ${t.slice(0, 200)}`);
    }

    const j = (await r.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = j.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    let parsed: GeneratedLessonRaw;
    try {
      parsed = JSON.parse(content) as GeneratedLessonRaw;
    } catch {
      throw new Error("AI returned malformed JSON");
    }

    // Repair pass — if the model omitted fields, regenerate ONLY those fields.
    const missing = missingFields(parsed);
    if (missing.length) {
      const patch = await requestFields(key, data.topic, missing, parsed);
      parsed = { ...parsed, ...patch };
    }

    // Clamp numeric/enum values so the engine always receives valid data.
    if (!ALLOWED_CATS.includes(parsed.category)) {
      parsed.category = (await inferCategory(key, data.topic)) ?? "DIY";
    }
    if (!["Beginner", "Intermediate", "Advanced"].includes(parsed.level)) parsed.level = "Beginner";
    parsed.totalMinutes = Math.max(5, Math.min(180, Number(parsed.totalMinutes) || 30));
    parsed.steps = (parsed.steps ?? []).slice(0, 6).map((s, i) => ({
      ...s,
      id: s.id || `step-${i + 1}`,
      hotspots: (s.hotspots ?? []).slice(0, 5).map((h, j) => ({
        ...h,
        id: h.id || `hs-${j + 1}`,
        x: Math.max(15, Math.min(85, Number(h.x) || 50)),
        y: Math.max(20, Math.min(85, Number(h.y) || 55)),
      })),
    }));

    if (!parsed.steps.length) throw new Error("AI returned no lesson steps — please try again.");
    return parsed;
  });

// ---------- field-level repair helpers ----------

function missingFields(l: Partial<GeneratedLessonRaw>): string[] {
  const out: string[] = [];
  if (!l.title?.trim()) out.push("title");
  if (!l.summary?.trim()) out.push("summary");
  if (!l.environment?.trim()) out.push("environment");
  if (!l.instructor?.trim()) out.push("instructor");
  if (!Array.isArray(l.objectives) || !l.objectives.length) out.push("objectives");
  if (!Array.isArray(l.tools)) out.push("tools");
  if (!Array.isArray(l.materials)) out.push("materials");
  if (!Array.isArray(l.safety) || !l.safety.length) out.push("safety");
  if (!Array.isArray(l.steps) || !l.steps.length) out.push("steps");
  return out;
}

async function chatJson(key: string, system: string, user: string): Promise<Record<string, unknown>> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openai/gpt-5.5",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!r.ok) return {};
  const j = (await r.json()) as { choices?: Array<{ message?: { content?: string } }> };
  try {
    return JSON.parse(j.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Regenerate only the fields the model left out, in the lesson's own context. */
async function requestFields(
  key: string,
  topic: string,
  fields: string[],
  ctx: Partial<GeneratedLessonRaw>,
): Promise<Partial<GeneratedLessonRaw>> {
  const patch = await chatJson(
    key,
    SYSTEM,
    `Skill topic: ${topic}\n\nAn earlier lesson draft is missing these fields: ${fields.join(", ")}.\nExisting draft (for context): ${JSON.stringify(
      { title: ctx.title, category: ctx.category, summary: ctx.summary },
    )}\n\nReturn STRICT JSON containing ONLY these keys: ${fields.join(", ")}. Use the same schema as before.`,
  );
  const out: Partial<GeneratedLessonRaw> = {};
  for (const f of fields) {
    if (patch[f] !== undefined) (out as Record<string, unknown>)[f] = patch[f];
  }
  return out;
}

async function inferCategory(key: string, topic: string): Promise<GeneratedLessonRaw["category"] | undefined> {
  const patch = await chatJson(
    key,
    "You classify skills into exactly one category. Return JSON: {\"category\": \"<one of the list>\"}",
    `Categories: ${ALLOWED_CATS.join(", ")}\nSkill topic: ${topic}`,
  );
  const c = patch.category as GeneratedLessonRaw["category"];
  return ALLOWED_CATS.includes(c) ? c : undefined;
}

