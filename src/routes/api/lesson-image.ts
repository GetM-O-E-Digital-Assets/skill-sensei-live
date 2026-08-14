import { createFileRoute } from "@tanstack/react-router";

/**
 * Visual asset matching only: produces a simple illustration for a lesson
 * topic when the catalog has no semantically matching artwork. Returns a
 * single PNG data URL; the client caches it per topic.
 */
export const Route = createFileRoute("/api/lesson-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { topic, category, scene } = (await request.json()) as {
          topic?: string;
          category?: string;
          scene?: string;
        };
        if (!topic || topic.trim().length < 2) {
          return new Response(JSON.stringify({ error: "Missing topic" }), { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response(JSON.stringify({ error: "Missing key" }), { status: 500 });

        const cacheKey = `${topic.trim().toLowerCase()}::${(category ?? "").toLowerCase()}::${(scene ?? "").trim().toLowerCase()}`;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const cached = await supabaseAdmin
          .from("lesson_image_cache")
          .select("image")
          .eq("cache_key", cacheKey)
          .maybeSingle();
        if (cached.data?.image) {
          return new Response(JSON.stringify({ image: cached.data.image }), {
            headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=31536000" },
          });
        }

        const prompt = `A photoreal first-person point-of-view image for a hands-on lesson about "${topic}"${
          category ? ` in the ${category} category` : ""
        }.${scene ? ` This specific scene shows: ${scene}.` : ""} Show the real tools, materials and environment for this specific skill only. Cinematic lighting, shallow depth of field, no text, no logos, 16:10 framing. Never include cars, engines, garages or automotive tools unless the skill itself is automotive.`;


        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-3.1-flash-image",
              messages: [{ role: "user", content: prompt }],
              modalities: ["image", "text"],
            }),
          });

          if (!upstream.ok) {
            return new Response(JSON.stringify({ error: "Image generation failed" }), {
              status: upstream.status,
            });
          }

          const json = (await upstream.json()) as { data?: Array<{ b64_json?: string }> };
          const b64 = json.data?.[0]?.b64_json;
          if (!b64) {
            return new Response(JSON.stringify({ error: "No image returned" }), { status: 502 });
          }

          const image = `data:image/png;base64,${b64}`;
          await supabaseAdmin
            .from("lesson_image_cache")
            .upsert({ cache_key: cacheKey, image }, { onConflict: "cache_key" });

          return new Response(JSON.stringify({ image }), {
            headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=31536000" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "Image generation failed" }), { status: 500 });
        }
      },
    },
  },
});
