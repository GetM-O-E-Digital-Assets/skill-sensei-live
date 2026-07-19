import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", context.userId);
    if (error) throw error;
    return data ?? [];
  });

export const getMyBookmarks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", context.userId);
    if (error) throw error;
    return data ?? [];
  });

export const saveProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      lessonId: string;
      stepIndex: number;
      completedSteps: string[];
      completed: boolean;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: context.userId,
          lesson_id: data.lessonId,
          step_index: data.stepIndex,
          completed_steps: data.completedSteps,
          completed: data.completed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );
    if (error) throw error;
    return { ok: true };
  });

export const toggleBookmark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { lessonId: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", context.userId)
      .eq("lesson_id", data.lessonId)
      .maybeSingle();

    if (existing) {
      const { error } = await context.supabase
        .from("bookmarks")
        .delete()
        .eq("id", existing.id);
      if (error) throw error;
      return { bookmarked: false };
    }
    const { error } = await context.supabase.from("bookmarks").insert({
      user_id: context.userId,
      lesson_id: data.lessonId,
    });
    if (error) throw error;
    return { bookmarked: true };
  });
