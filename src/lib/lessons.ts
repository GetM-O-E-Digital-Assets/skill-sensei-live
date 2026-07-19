import scene1 from "@/assets/lesson-oil-scene-1-hood.jpg";
import scene2 from "@/assets/lesson-oil-scene-2-drain.jpg";
import scene3 from "@/assets/lesson-oil-scene-3-filter.jpg";
import scene4 from "@/assets/lesson-oil-scene-4-refill.jpg";
import scene5 from "@/assets/lesson-oil-scene-5-dipstick.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catWood from "@/assets/cat-woodshop.jpg";
import catElectronics from "@/assets/cat-electronics.jpg";

export type Hotspot = {
  id: string;
  label: string;
  /** Percent coordinates within the scene image (0-100) */
  x: number;
  y: number;
  action: string;
  detail: string;
  why: string;
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
        "You are standing at the front of the car with the hood already open. Before we touch anything, orient yourself. Tap any component to have me demonstrate what it is and why it matters.",
      hotspots: [
        {
          id: "engine",
          label: "Engine block",
          x: 50,
          y: 60,
          action: "Point out the engine",
          detail:
            "This is a 3.0L V6. The oil we're about to change lubricates every moving surface inside it — bearings, cams, piston walls.",
          why: "Knowing where the engine sits helps you visualize where the oil travels once you pour it in.",
        },
        {
          id: "filler",
          label: "Oil filler cap",
          x: 42,
          y: 46,
          action: "Rotate the filler cap counter-clockwise",
          detail:
            "Twist the yellow cap a quarter turn counter-clockwise and lift it off. Set it on a clean rag — never on the fender lip.",
          why: "Opening the filler cap first lets air into the crankcase so oil drains faster and more completely.",
        },
        {
          id: "battery",
          label: "12V battery",
          x: 18,
          y: 48,
          action: "Identify the battery terminals",
          detail:
            "Red positive on the left, black negative to the right. Not touched during an oil change, but always know where it is.",
          why: "Awareness of nearby electrical sources prevents accidental shorts if a wrench slips.",
        },
      ],
    },
    {
      id: "drain",
      title: "Drain the old oil",
      scene: scene2,
      duration: "5 min",
      intro:
        "You are now under the car on a creeper. The oil pan is directly above you. We drain from the lowest point — the drain plug.",
      hotspots: [
        {
          id: "plug",
          label: "Drain plug",
          x: 50,
          y: 48,
          action: "Loosen the drain plug counter-clockwise",
          detail:
            "Fit a 17mm socket over the plug. Break it loose with a firm counter-clockwise pull, then back it out by hand — the last thread is where oil starts rushing.",
          why: "Hand-finishing prevents the plug from dropping into the hot oil pan below.",
        },
        {
          id: "pan",
          label: "Catch pan",
          x: 50,
          y: 88,
          action: "Position the catch pan",
          detail:
            "Slide the drain pan directly under the plug — offset it slightly toward you so the initial stream lands in the center.",
          why: "Warm oil arcs forward as it drains; placement matters more than most people think.",
        },
        {
          id: "worklight",
          label: "Work light",
          x: 10,
          y: 78,
          action: "Aim the work light",
          detail:
            "Rotate the LED light so it grazes across the pan. Shadow reveals leaks; direct light hides them.",
          why: "Good lighting is the difference between spotting a stripped thread and finding a puddle tomorrow.",
        },
      ],
    },
    {
      id: "filter",
      title: "Swap the oil filter",
      scene: scene3,
      duration: "6 min",
      intro:
        "The old filter is holding a cup of dirty oil. We remove it carefully so nothing splashes back onto the exhaust.",
      hotspots: [
        {
          id: "filter",
          label: "Oil filter",
          x: 52,
          y: 44,
          action: "Loosen the filter with the wrench",
          detail:
            "Snug the strap wrench around the filter. One steady counter-clockwise rotation until the seal breaks — then set the wrench aside and finish by hand.",
          why: "Filter housings are thin steel. Overtightening the wrench crushes them and traps oil inside.",
        },
        {
          id: "gasket",
          label: "New filter gasket",
          x: 50,
          y: 68,
          action: "Prime the gasket",
          detail:
            "Dip a fingertip in fresh oil and wipe it around the new filter's rubber gasket before spinning it on. Tighten by hand — three quarters of a turn past contact.",
          why: "A dry gasket tears on first startup and dumps your fresh oil onto the driveway.",
        },
      ],
    },
    {
      id: "refill",
      title: "Refill with fresh oil",
      scene: scene4,
      duration: "4 min",
      intro:
        "Back on top of the car. We pour the new oil in through the filler port you opened earlier. Owner's manual says 5.2 quarts.",
      hotspots: [
        {
          id: "funnel",
          label: "Funnel",
          x: 78,
          y: 62,
          action: "Seat the funnel",
          detail:
            "Push the funnel firmly into the filler port. Wiggle it to seat the rubber ring — no gap, no drips.",
          why: "Oil off the valve cover cooks and smells for weeks. A well-seated funnel prevents that.",
        },
        {
          id: "bottle",
          label: "Fresh oil bottle",
          x: 68,
          y: 44,
          action: "Pour steadily",
          detail:
            "Hold the bottle at a 45° angle and pour in one smooth motion. Pause between quarts so air can escape.",
          why: "Glug-glug pouring pressurizes the crankcase and pushes oil back out the funnel.",
        },
      ],
    },
    {
      id: "verify",
      title: "Verify the level",
      scene: scene5,
      duration: "4 min",
      intro:
        "Final check. Pull the dipstick, wipe it, seat it fully, then pull again and read the level. This is how you know you did it right.",
      hotspots: [
        {
          id: "dipstick",
          label: "Dipstick",
          x: 66,
          y: 52,
          action: "Read the oil level",
          detail:
            "Oil should sit between the two crosshatch marks — ideally right at the upper mark. Amber and clear means you're done.",
          why: "Underfill starves the pump. Overfill foams the oil and blows past the seals. The window is narrow.",
        },
        {
          id: "towel",
          label: "Clean towel",
          x: 30,
          y: 66,
          action: "Wipe the dipstick",
          detail:
            "Wipe with a lint-free towel in one direction. Cotton fibers on the stick will end up circulating in the engine.",
          why: "Clean readings depend on a clean stick. This is a five-second habit that pays off forever.",
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
