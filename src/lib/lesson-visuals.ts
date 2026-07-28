/**
 * Lesson visual matching system.
 *
 * Single source of truth for choosing thumbnails, banners and scene
 * artwork for any lesson — catalog, preview or AI-generated. Nothing in
 * here touches the lesson engine, search or AI generation; it only
 * decides *which picture* a lesson shows.
 *
 * Rules:
 *  - visuals are chosen from the lesson's detected category + keywords
 *  - automotive imagery is only ever used for automotive topics
 *  - unknown topics fall back to an AI-generated illustration (cached)
 */

import scene1 from "@/assets/lesson-oil-scene-1-hood.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catWood from "@/assets/cat-woodshop.jpg";
import catElectronics from "@/assets/cat-electronics.jpg";
import catDiy from "@/assets/cat-diy.jpg";
import catHomeRepair from "@/assets/cat-home-repair.jpg";
import catPlumbing from "@/assets/cat-plumbing.jpg";
import catConstruction from "@/assets/cat-construction.jpg";
import catElectrical from "@/assets/cat-electrical.jpg";
import catTrades from "@/assets/cat-trades.jpg";
import catBusiness from "@/assets/cat-business.jpg";
import catFitness from "@/assets/cat-fitness.jpg";
import catMedical from "@/assets/cat-medical.jpg";
import catScience from "@/assets/cat-science.jpg";
import catMusic from "@/assets/cat-music.jpg";
import catPhotography from "@/assets/cat-photography.jpg";
import catArt from "@/assets/cat-art.jpg";
import catOutdoor from "@/assets/cat-outdoor.jpg";
import catGardening from "@/assets/cat-gardening.jpg";
import heroImg from "@/assets/hero-workshop.jpg";

/** Category -> matching artwork. Keys mirror the platform categories. */
export const CATEGORY_VISUALS: Record<string, string> = {
  Automotive: scene1,
  Mechanics: scene1,
  Cooking: catKitchen,
  DIY: catDiy,
  "Home Repair": catHomeRepair,
  Construction: catConstruction,
  Woodworking: catWood,
  Electrical: catElectrical,
  Plumbing: catPlumbing,
  Technology: catElectronics,
  Programming: catElectronics,
  Business: catBusiness,
  Fitness: catFitness,
  Medical: catMedical,
  Science: catScience,
  Music: catMusic,
  Photography: catPhotography,
  Art: catArt,
  Trades: catTrades,
  Outdoor: catOutdoor,
  Gardening: catGardening,
};

/** Keyword -> category, used to detect a topic from free-text search. */
const KEYWORD_CATEGORY: Array<[RegExp, string]> = [
  [/\b(oil change|brake|tire|engine|car|vehicle|automotive|spark plug|detailing|transmission|radiator)\b/i, "Automotive"],
  [/\b(cook|bake|bread|steak|recipe|kitchen|knife skills|sauce|grill|pastry|sourdough|food)\b/i, "Cooking"],
  [/\b(plumb|faucet|toilet|pipe|drain|sink|water heater)\b/i, "Plumbing"],
  [/\b(electric|outlet|wiring|breaker|dimmer|switch|circuit|voltage)\b/i, "Electrical"],
  [/\b(drywall|paint wall|caulk|tile|home repair|door hinge|window seal|patch)\b/i, "Home Repair"],
  [/\b(fram(e|ing)|concrete|roof|foundation|construction|stud wall)\b/i, "Construction"],
  [/\b(wood|joinery|dovetail|chisel|lathe|sand(ing)? wood|carpentry)\b/i, "Woodworking"],
  [/\b(weld|mig|tig|forge|machin(e|ing)|hvac|trade)\b/i, "Trades"],
  [/\b(python|javascript|code|coding|program|software|algorithm|git)\b/i, "Programming"],
  [/\b(excel|computer|laptop|spreadsheet|solder|electronics|network|technolog)\b/i, "Technology"],
  [/\b(business|marketing|sales|finance|startup|accounting|negotiat)\b/i, "Business"],
  [/\b(workout|fitness|squat|deadlift|yoga|run(ning)?|stretch|gym)\b/i, "Fitness"],
  [/\b(cpr|first aid|medical|wound|bandage|heimlich|injury|bleeding)\b/i, "Medical"],
  [/\b(chemistry|physics|biology|lab|experiment|microscope|science)\b/i, "Science"],
  [/\b(guitar|piano|music|chord|drum|sing|violin)\b/i, "Music"],
  [/\b(photo|camera|aperture|shutter|lens|lighting setup)\b/i, "Photography"],
  [/\b(draw|paint|sketch|art|watercolor|calligraph)\b/i, "Art"],
  [/\b(fish|camp|hik|kayak|knot|survival|outdoor)\b/i, "Outdoor"],
  [/\b(garden|plant|soil|prune|compost|seed|lawn)\b/i, "Gardening"],
  [/\b(diy|install|assemble|mount|shelf|drill)\b/i, "DIY"],
];

/** Detect a category from any free text (search query, title, summary). */
export function detectCategory(...text: Array<string | undefined>): string | undefined {
  const blob = text.filter(Boolean).join(" ");
  if (!blob.trim()) return undefined;
  for (const [re, cat] of KEYWORD_CATEGORY) {
    if (re.test(blob)) return cat;
  }
  return undefined;
}

/**
 * Pick the best-matching artwork for a lesson. Falls back to the neutral
 * workshop hero (never an automotive close-up) when nothing matches.
 */
export function visualForLesson(input: {
  category?: string;
  title?: string;
  summary?: string;
  tags?: string[];
}): string {
  if (input.category && CATEGORY_VISUALS[input.category]) {
    return CATEGORY_VISUALS[input.category];
  }
  const detected = detectCategory(input.title, input.summary, input.tags?.join(" "));
  if (detected && CATEGORY_VISUALS[detected]) return CATEGORY_VISUALS[detected];
  return heroImg;
}

/** True when the topic is genuinely automotive — gate for car imagery. */
export function isAutomotive(category?: string, ...text: Array<string | undefined>): boolean {
  if (category === "Automotive" || category === "Mechanics") return true;
  const d = detectCategory(...text);
  return d === "Automotive" || d === "Mechanics";
}

export const NEUTRAL_VISUAL = heroImg;

// ---------- AI illustration (cached per topic + variant) ----------

const memoryCache = new Map<string, string>();
const CACHE_PREFIX = "ss-lesson-visual:";

function cacheKey(topic: string, variant?: string) {
  return CACHE_PREFIX + topic.trim().toLowerCase() + (variant ? `::${variant.trim().toLowerCase()}` : "");
}

export function getCachedVisual(topic: string, variant?: string): string | undefined {
  const key = cacheKey(topic, variant);
  const mem = memoryCache.get(key);
  if (mem) return mem;
  if (typeof window === "undefined") return undefined;
  try {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      memoryCache.set(key, stored);
      return stored;
    }
  } catch {
    /* storage unavailable */
  }
  return undefined;
}

function setCachedVisual(topic: string, dataUrl: string, variant?: string) {
  const key = cacheKey(topic, variant);
  memoryCache.set(key, dataUrl);
  try {
    window.localStorage.setItem(key, dataUrl);
  } catch {
    /* quota — memory cache still serves this session */
  }
}

/**
 * Generate artwork matching a lesson topic (and optionally one specific
 * step/scene). Identical requests reuse the cached image.
 */
export async function generateLessonVisual(
  topic: string,
  category?: string,
  variant?: string,
): Promise<string | undefined> {
  const cached = getCachedVisual(topic, variant);
  if (cached) return cached;
  try {
    const res = await fetch("/api/lesson-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, category, scene: variant }),
    });
    if (!res.ok) return undefined;
    const json = (await res.json()) as { image?: string };
    if (!json.image) return undefined;
    setCachedVisual(topic, json.image, variant);
    return json.image;
  } catch {
    return undefined;
  }
}

