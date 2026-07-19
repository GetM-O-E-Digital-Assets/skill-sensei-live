import scene1 from "@/assets/lesson-oil-scene-1-hood.jpg";
import scene2 from "@/assets/lesson-oil-scene-2-drain.jpg";
import scene3 from "@/assets/lesson-oil-scene-3-filter.jpg";
import scene4 from "@/assets/lesson-oil-scene-4-refill.jpg";
import scene5 from "@/assets/lesson-oil-scene-5-dipstick.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catWood from "@/assets/cat-woodshop.jpg";
import catElectronics from "@/assets/cat-electronics.jpg";

import demoFiller from "@/assets/demo-filler-cap.mp4.asset.json";
import demoDrain from "@/assets/demo-drain-plug.mp4.asset.json";
import demoCatch from "@/assets/demo-catch-pan.mp4.asset.json";
import demoFilter from "@/assets/demo-oil-filter.mp4.asset.json";
import demoGasket from "@/assets/demo-gasket.mp4.asset.json";
import demoFunnel from "@/assets/demo-funnel.mp4.asset.json";
import demoPour from "@/assets/demo-pour.mp4.asset.json";
import demoDipstick from "@/assets/demo-dipstick.mp4.asset.json";
import demoTowel from "@/assets/demo-towel.mp4.asset.json";

/**
 * Demonstration engine — pluggable so future versions can add
 * AI-generated clips, 3D/WebGL scenes, or realtime avatars without
 * changing the lesson viewer or lesson data schema.
 */
export type Demonstration =
  | {
      kind: "video";
      src: string;
      /** Approx seconds — used for the progress bar. */
      duration: number;
      /** Optional ambient sound cue. */
      sound?: string;
      poster?: string;
    }
  | {
      kind: "scene-zoom";
      scene: string;
      x: number;
      y: number;
      duration: number;
    }
  | {
      /** Reserved for future runtime AI-generated demos. */
      kind: "ai-generated";
      prompt: string;
      duration: number;
    }
  | {
      /** Reserved for future 3D/WebGL interactive scenes. */
      kind: "scene-3d";
      sceneId: string;
    };

export type Hotspot = {
  id: string;
  label: string;
  /** Percent coordinates within the scene image (0-100) */
  x: number;
  y: number;
  /** Short imperative — appears as the demo caption. */
  action: string;
  /** The demonstration to play when the hotspot is tapped. */
  demo: Demonstration;
  /** One-sentence explanation of why this action matters. */
  why: string;
  /** 1-3 short coaching tips, one line each. */
  tips?: string[];
  /** A single safety warning if relevant. */
  warning?: string;
  /** The most common mistake learners make. */
  mistake?: string;
};

export type LessonStep = {
  id: string;
  title: string;
  scene: string;
  intro: string;
  duration: string;
  hotspots: Hotspot[];
};

export type Lesson = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  totalMinutes: number;
  cover: string;
  summary: string;
  environment: string;
  steps: LessonStep[];
};

export const OIL_CHANGE_LESSON: Lesson = {
  id: "auto-oil-change",
  title: "Change Your Engine Oil",
  category: "Automotive",
  instructor: "Marcus Reid, ASE Master Technician",
  level: "Beginner",
  totalMinutes: 22,
  cover: scene1,
  summary:
    "Stand beside a master tech in a working garage and change your engine oil one action at a time.",
  environment: "Professional automotive garage",
  steps: [
    {
      id: "prep",
      title: "Under the hood",
      scene: scene1,
      duration: "3 min",
      intro:
        "Orient yourself. Tap any glowing point to watch it demonstrated.",
      hotspots: [
        {
          id: "engine",
          label: "Engine block",
          x: 50,
          y: 60,
          action: "This is the V6 engine",
          demo: { kind: "scene-zoom", scene: scene1, x: 50, y: 60, duration: 4 },
          why: "The oil you're about to change lubricates every moving surface inside it.",
          tips: ["3.0L V6 — 5.2 quarts total capacity", "Runs quiet when the oil is fresh"],
        },
        {
          id: "filler",
          label: "Oil filler cap",
          x: 42,
          y: 46,
          action: "Twist the filler cap off",
          demo: { kind: "video", src: demoFiller.url, duration: 5 },
          why: "Opening the filler first lets air in so oil drains faster.",
          tips: ["Quarter turn counter-clockwise", "Set it on a clean rag"],
          mistake: "Resting the cap on the fender lip — it rolls into the engine bay.",
        },
        {
          id: "battery",
          label: "12V battery",
          x: 18,
          y: 48,
          action: "Locate the battery terminals",
          demo: { kind: "scene-zoom", scene: scene1, x: 18, y: 48, duration: 4 },
          why: "Knowing where live electricity sits prevents a wrench short.",
          warning: "Never let a metal tool bridge the red and black terminals.",
        },
      ],
    },
    {
      id: "drain",
      title: "Drain the old oil",
      scene: scene2,
      duration: "5 min",
      intro: "You're under the car. We drain from the lowest point.",
      hotspots: [
        {
          id: "plug",
          label: "Drain plug",
          x: 50,
          y: 48,
          action: "Break the drain plug loose",
          demo: { kind: "video", src: demoDrain.url, duration: 5 },
          why: "Finishing by hand keeps the plug from dropping into hot oil.",
          tips: ["17mm socket", "Firm counter-clockwise pull, then hand-finish"],
          warning: "Oil may be hot — 40°C is plenty to scald.",
          mistake: "Wrenching all the way out — the plug drops into the pan.",
        },
        {
          id: "pan",
          label: "Catch pan",
          x: 50,
          y: 88,
          action: "Slide the catch pan into position",
          demo: { kind: "video", src: demoCatch.url, duration: 5 },
          why: "Warm oil arcs forward as it drains — placement matters.",
          tips: ["Offset slightly toward you", "Center under the plug"],
        },
        {
          id: "worklight",
          label: "Work light",
          x: 10,
          y: 78,
          action: "Aim the work light",
          demo: { kind: "scene-zoom", scene: scene2, x: 10, y: 78, duration: 4 },
          why: "Grazing light reveals leaks that overhead light hides.",
          tips: ["Aim it across the pan, not straight down"],
        },
      ],
    },
    {
      id: "filter",
      title: "Swap the oil filter",
      scene: scene3,
      duration: "6 min",
      intro: "The old filter is holding a cup of oil. Remove it carefully.",
      hotspots: [
        {
          id: "filter",
          label: "Oil filter",
          x: 52,
          y: 44,
          action: "Break the filter loose",
          demo: { kind: "video", src: demoFilter.url, duration: 5 },
          why: "Filter housings are thin steel — overtightening crushes them.",
          tips: ["One steady counter-clockwise rotation", "Finish by hand"],
          mistake: "Cranking the wrench past break-loose and denting the can.",
        },
        {
          id: "gasket",
          label: "New filter gasket",
          x: 50,
          y: 68,
          action: "Prime the new gasket with oil",
          demo: { kind: "video", src: demoGasket.url, duration: 5 },
          why: "A dry gasket tears on first startup and dumps your fresh oil.",
          tips: ["Fingertip of fresh oil", "One full circle around the rubber"],
          mistake: "Forgetting the prime — the #1 cause of first-drive leaks.",
        },
      ],
    },
    {
      id: "refill",
      title: "Refill with fresh oil",
      scene: scene4,
      duration: "4 min",
      intro: "Owner's manual says 5.2 quarts.",
      hotspots: [
        {
          id: "funnel",
          label: "Funnel",
          x: 78,
          y: 62,
          action: "Seat the funnel",
          demo: { kind: "video", src: demoFunnel.url, duration: 5 },
          why: "Oil on the valve cover cooks and smells for weeks.",
          tips: ["Push firmly, wiggle to seat the ring"],
        },
        {
          id: "bottle",
          label: "Fresh oil bottle",
          x: 68,
          y: 44,
          action: "Pour steadily",
          demo: { kind: "video", src: demoPour.url, duration: 5 },
          why: "Glug-glug pouring pressurizes the crankcase and backs oil up.",
          tips: ["45° angle", "Pause between quarts so air can escape"],
          mistake: "Pouring straight up — creates the glug and overflows.",
        },
      ],
    },
    {
      id: "verify",
      title: "Verify the level",
      scene: scene5,
      duration: "4 min",
      intro: "Pull, wipe, seat, pull again, read.",
      hotspots: [
        {
          id: "dipstick",
          label: "Dipstick",
          x: 66,
          y: 52,
          action: "Pull the dipstick",
          demo: { kind: "video", src: demoDipstick.url, duration: 5 },
          why: "Oil should sit between the two crosshatch marks.",
          tips: ["Amber and clear = done", "Aim for the upper mark"],
          mistake: "Reading the first pull — always wipe and re-seat first.",
        },
        {
          id: "towel",
          label: "Clean towel",
          x: 30,
          y: 66,
          action: "Wipe the dipstick",
          demo: { kind: "video", src: demoTowel.url, duration: 5 },
          why: "Cotton fibers left on the stick end up circulating inside.",
          tips: ["Lint-free shop towel", "One direction, one stroke"],
        },
      ],
    },
  ],
};

export type LessonSummary = {
  id: string;
  title: string;
  category: string;
  level: Lesson["level"];
  totalMinutes: number;
  cover: string;
  summary: string;
  available: boolean;
};

export const LESSON_LIBRARY: LessonSummary[] = [
  {
    id: OIL_CHANGE_LESSON.id,
    title: OIL_CHANGE_LESSON.title,
    category: OIL_CHANGE_LESSON.category,
    level: OIL_CHANGE_LESSON.level,
    totalMinutes: OIL_CHANGE_LESSON.totalMinutes,
    cover: OIL_CHANGE_LESSON.cover,
    summary: OIL_CHANGE_LESSON.summary,
    available: true,
  },
  {
    id: "cook-pan-sauce",
    title: "Build a Restaurant Pan Sauce",
    category: "Cooking",
    level: "Intermediate",
    totalMinutes: 18,
    cover: catKitchen,
    summary:
      "Deglaze, reduce, mount with butter. Stand in a working kitchen and copy each motion.",
    available: false,
  },
  {
    id: "wood-dovetail",
    title: "Cut a Through Dovetail by Hand",
    category: "Woodworking",
    level: "Advanced",
    totalMinutes: 40,
    cover: catWood,
    summary:
      "Chisel, mallet, patience. A master joiner walks you through every strike.",
    available: false,
  },
  {
    id: "solder-through-hole",
    title: "Solder a Through-Hole Component",
    category: "Electronics",
    level: "Beginner",
    totalMinutes: 12,
    cover: catElectronics,
    summary:
      "Heat the joint, feed the solder, count to three. Your first clean joint, live at the bench.",
    available: false,
  },
];

export function getLesson(id: string): Lesson | undefined {
  if (id === OIL_CHANGE_LESSON.id) return OIL_CHANGE_LESSON;
  return undefined;
}

export const CATEGORIES = [
  "Automotive",
  "Cooking",
  "Woodworking",
  "Electronics",
  "Plumbing",
  "Electrical",
  "Construction",
  "Gardening",
  "Fitness",
  "Music",
  "Medical",
  "Crafts",
];
