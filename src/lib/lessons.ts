import scene1 from "@/assets/lesson-oil-scene-1-hood.jpg";
import scene2 from "@/assets/lesson-oil-scene-2-drain.jpg";
import scene3 from "@/assets/lesson-oil-scene-3-filter.jpg";
import scene4 from "@/assets/lesson-oil-scene-4-refill.jpg";
import scene5 from "@/assets/lesson-oil-scene-5-dipstick.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catWood from "@/assets/cat-woodshop.jpg";
import catElectronics from "@/assets/cat-electronics.jpg";
import heroImg from "@/assets/hero-workshop.jpg";

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
  | { kind: "video"; src: string; duration: number; sound?: string; poster?: string }
  | { kind: "scene-zoom"; scene: string; x: number; y: number; duration: number }
  | { kind: "ai-generated"; prompt: string; duration: number }
  | { kind: "scene-3d"; sceneId: string };

export type Hotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  action: string;
  demo: Demonstration;
  why: string;
  tips?: string[];
  warning?: string;
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

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Lesson = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  level: Difficulty;
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
      intro: "Orient yourself. Tap any glowing point to watch it demonstrated.",
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

/** Full category taxonomy — designed for millions of future lessons. */
export const CATEGORIES = [
  "Automotive",
  "Cooking",
  "DIY",
  "Home Repair",
  "Construction",
  "Woodworking",
  "Electrical",
  "Plumbing",
  "Mechanics",
  "Technology",
  "Programming",
  "Business",
  "Fitness",
  "Medical",
  "Science",
  "Music",
  "Photography",
  "Art",
  "Trades",
  "Outdoor",
  "Gardening",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * LessonSummary — the shape returned by search, category browse, and
 * home-page sections. Rich enough to power thumbnails, filters, ranking
 * and personalization. This is the contract for any future lesson source
 * (AI-generated, instructor-created, community-authored).
 */
export type LessonSummary = {
  id: string;
  title: string;
  category: Category;
  level: Difficulty;
  /** Preferred display time. Alias of totalMinutes for back-compat. */
  totalMinutes: number;
  cover: string;
  summary: string;
  available: boolean;
  tools: string[];
  materials: string[];
  rating: number; // 0-5
  studentsCompleted: number;
  tags: string[];
  createdAt: string; // ISO
  popularityScore: number;
  source?: "official" | "ai-generated" | "instructor" | "community";
};

// ---------- Catalog ----------

const covers = [scene1, scene2, scene3, scene4, scene5, catKitchen, catWood, catElectronics, heroImg];
const pickCover = (i: number) => covers[i % covers.length];

type Seed = {
  id: string;
  title: string;
  category: Category;
  level: Difficulty;
  totalMinutes: number;
  summary: string;
  tools: string[];
  materials: string[];
  rating?: number;
  studentsCompleted?: number;
  tags?: string[];
  daysAgo?: number;
  popularityScore?: number;
  source?: LessonSummary["source"];
};

const SEEDS: Seed[] = [
  // Automotive
  { id: "auto-oil-change", title: "Change Your Engine Oil", category: "Automotive", level: "Beginner", totalMinutes: 22, summary: "Drain, filter, refill, verify — the full oil change in a working garage.", tools: ["17mm socket", "Filter wrench", "Funnel"], materials: ["5.2 qt 5W-30", "Filter", "Crush washer"], rating: 4.9, studentsCompleted: 18420, tags: ["oil change", "maintenance", "car"], daysAgo: 3, popularityScore: 98, source: "official" },
  { id: "auto-brake-pads", title: "Replace Front Brake Pads", category: "Automotive", level: "Intermediate", totalMinutes: 45, summary: "Caliper off, pads swapped, piston pressed — no more squeal.", tools: ["Caliper piston tool", "14mm socket", "Torque wrench"], materials: ["Brake pads", "Anti-seize"], rating: 4.8, studentsCompleted: 9210, tags: ["brakes", "safety"], daysAgo: 6, popularityScore: 92 },
  { id: "auto-tire-rotation", title: "Rotate Your Tires", category: "Automotive", level: "Beginner", totalMinutes: 20, summary: "Even wear doubles tire life. Do it every 6,000 miles.", tools: ["Jack", "Lug wrench", "Torque wrench"], materials: [], rating: 4.7, studentsCompleted: 6540, tags: ["tires"], daysAgo: 14 },
  { id: "auto-detailing", title: "Detail a Car Like a Pro", category: "Automotive", level: "Intermediate", totalMinutes: 90, summary: "Two-bucket wash, clay bar, wax — showroom finish at home.", tools: ["Foam cannon", "Microfiber towels", "Clay bar"], materials: ["Car shampoo", "Wax"], rating: 4.6, studentsCompleted: 3120, tags: ["detailing", "wash"], daysAgo: 2, popularityScore: 80 },

  // Cooking
  { id: "cook-steak", title: "Cook the Perfect Steak", category: "Cooking", level: "Beginner", totalMinutes: 25, summary: "Reverse-sear a ribeye. Crust, medium-rare center, rested.", tools: ["Cast iron pan", "Instant-read thermometer"], materials: ["Ribeye", "Salt", "Butter", "Thyme"], rating: 4.9, studentsCompleted: 22110, tags: ["steak", "beef"], daysAgo: 1, popularityScore: 99 },
  { id: "cook-pan-sauce", title: "Build a Restaurant Pan Sauce", category: "Cooking", level: "Intermediate", totalMinutes: 18, summary: "Deglaze, reduce, mount with butter — glossy every time.", tools: ["Sauté pan", "Whisk"], materials: ["Shallot", "Wine", "Stock", "Butter"], rating: 4.8, studentsCompleted: 5410, tags: ["sauce"], daysAgo: 20 },
  { id: "cook-bread", title: "Bake a Crusty Sourdough", category: "Cooking", level: "Advanced", totalMinutes: 180, summary: "Autolyse, bulk, shape, cold retard, bake in a Dutch oven.", tools: ["Dutch oven", "Bench scraper", "Banneton"], materials: ["Bread flour", "Starter", "Salt"], rating: 4.9, studentsCompleted: 12030, tags: ["bread", "sourdough"], daysAgo: 4, popularityScore: 88 },
  { id: "cook-knife-skills", title: "Master Basic Knife Skills", category: "Cooking", level: "Beginner", totalMinutes: 30, summary: "Grip, claw, rock — dice an onion cleanly.", tools: ["Chef's knife", "Cutting board"], materials: ["Onion", "Carrot"], rating: 4.9, studentsCompleted: 30100, tags: ["knife"], daysAgo: 11, popularityScore: 95 },

  // DIY / Home Repair
  { id: "diy-ceiling-fan", title: "Install a Ceiling Fan", category: "DIY", level: "Intermediate", totalMinutes: 60, summary: "Kill the breaker, mount the bracket, wire it right.", tools: ["Voltage tester", "Screwdriver", "Wire strippers"], materials: ["Ceiling fan", "Wire nuts"], rating: 4.7, studentsCompleted: 4820, tags: ["ceiling fan"], daysAgo: 5, popularityScore: 82 },
  { id: "diy-drywall", title: "Patch a Hole in Drywall", category: "Home Repair", level: "Beginner", totalMinutes: 40, summary: "Cut clean, patch, tape, mud, sand — invisible repair.", tools: ["Utility knife", "Taping knife", "Sanding block"], materials: ["Drywall patch", "Joint compound", "Mesh tape"], rating: 4.7, studentsCompleted: 7300, tags: ["drywall", "wall"], daysAgo: 9 },
  { id: "diy-faucet", title: "Replace a Kitchen Faucet", category: "Plumbing", level: "Intermediate", totalMinutes: 50, summary: "Shut-off valves, supply lines, basin wrench — swap in an hour.", tools: ["Basin wrench", "Adjustable wrench"], materials: ["Faucet", "Plumber's tape"], rating: 4.6, studentsCompleted: 2410, tags: ["faucet", "sink"], daysAgo: 12 },
  { id: "diy-toilet-fill", title: "Fix a Running Toilet", category: "Plumbing", level: "Beginner", totalMinutes: 25, summary: "New flapper, adjust the fill valve — stop the phantom flush.", tools: ["Adjustable wrench"], materials: ["Flapper", "Fill valve"], rating: 4.8, studentsCompleted: 8900, tags: ["toilet"], daysAgo: 18 },

  // Electrical
  { id: "elec-outlet", title: "Replace an Electrical Outlet", category: "Electrical", level: "Intermediate", totalMinutes: 30, summary: "Kill the breaker, verify dead, swap hot/neutral/ground.", tools: ["Voltage tester", "Screwdriver"], materials: ["Outlet", "Wire nuts"], rating: 4.7, studentsCompleted: 5620, tags: ["outlet"], daysAgo: 7 },
  { id: "elec-switch", title: "Install a Dimmer Switch", category: "Electrical", level: "Beginner", totalMinutes: 25, summary: "Three wires, one dimmer, thirty minutes to mood lighting.", tools: ["Voltage tester", "Screwdriver"], materials: ["Dimmer switch"], rating: 4.7, studentsCompleted: 3140, tags: ["dimmer"], daysAgo: 22 },

  // Construction / Trades
  { id: "trade-welding", title: "Weld a Basic MIG Bead", category: "Trades", level: "Intermediate", totalMinutes: 50, summary: "Set voltage and wire feed, run a clean stringer bead.", tools: ["MIG welder", "Helmet", "Gloves"], materials: ["Steel plate", "Wire spool"], rating: 4.8, studentsCompleted: 2100, tags: ["welding", "mig"], daysAgo: 8 },
  { id: "trade-framing", title: "Frame an Interior Wall", category: "Construction", level: "Intermediate", totalMinutes: 90, summary: "Plates, studs, top plate — 16 inches on center, plumb and square.", tools: ["Circular saw", "Framing hammer", "Speed square"], materials: ["2x4 lumber", "Nails"], rating: 4.6, studentsCompleted: 1240, tags: ["framing", "wall"], daysAgo: 30 },

  // Woodworking
  { id: "wood-dovetail", title: "Cut a Through Dovetail by Hand", category: "Woodworking", level: "Advanced", totalMinutes: 60, summary: "Chisel, mallet, patience — the joint that lasts a century.", tools: ["Dovetail saw", "Chisels", "Marking gauge"], materials: ["Hardwood board"], rating: 4.9, studentsCompleted: 1820, tags: ["joinery"], daysAgo: 15 },
  { id: "wood-sharpen", title: "Sharpen a Chisel Razor Sharp", category: "Woodworking", level: "Beginner", totalMinutes: 25, summary: "Flatten the back, hollow-grind the bevel, hone on a strop.", tools: ["Waterstones", "Honing guide"], materials: ["Chisel"], rating: 4.9, studentsCompleted: 4530, tags: ["sharpening"], daysAgo: 6 },

  // Technology / Programming
  { id: "tech-python", title: "Python Programming Basics", category: "Programming", level: "Beginner", totalMinutes: 40, summary: "Variables, loops, functions — write your first script.", tools: ["Editor"], materials: [], rating: 4.7, studentsCompleted: 44210, tags: ["python", "coding"], daysAgo: 2, popularityScore: 96 },
  { id: "tech-excel", title: "Excel: Formulas That Do the Work", category: "Technology", level: "Beginner", totalMinutes: 35, summary: "VLOOKUP, INDEX/MATCH, pivot tables — stop copying rows by hand.", tools: ["Excel"], materials: [], rating: 4.6, studentsCompleted: 33020, tags: ["excel", "office"], daysAgo: 10, popularityScore: 90 },
  { id: "tech-electronics", title: "Solder a Through-Hole Component", category: "Technology", level: "Beginner", totalMinutes: 15, summary: "Heat the joint, feed the solder, count to three.", tools: ["Soldering iron", "Solder", "Flux"], materials: ["PCB", "Resistor"], rating: 4.8, studentsCompleted: 2260, tags: ["solder", "electronics"], daysAgo: 25 },

  // Medical
  { id: "med-cpr", title: "Perform Hands-Only CPR", category: "Medical", level: "Beginner", totalMinutes: 15, summary: "Call. Push hard. Push fast. 100–120 compressions per minute.", tools: [], materials: [], rating: 4.9, studentsCompleted: 51200, tags: ["cpr", "emergency"], daysAgo: 1, popularityScore: 97 },
  { id: "med-firstaid", title: "First Aid for Cuts and Burns", category: "Medical", level: "Beginner", totalMinutes: 20, summary: "Stop bleeding, clean, cover — cool a burn correctly.", tools: [], materials: ["Gauze", "Bandage"], rating: 4.8, studentsCompleted: 18400, tags: ["first aid"], daysAgo: 4 },
  { id: "med-heimlich", title: "The Heimlich Maneuver", category: "Medical", level: "Beginner", totalMinutes: 10, summary: "Adults, kids, infants — three techniques you must know.", tools: [], materials: [], rating: 4.9, studentsCompleted: 9880, tags: ["choking"], daysAgo: 12 },

  // Photography / Art / Music
  { id: "photo-manual", title: "Shoot in Full Manual", category: "Photography", level: "Intermediate", totalMinutes: 30, summary: "ISO, aperture, shutter — the exposure triangle demystified.", tools: ["Camera"], materials: [], rating: 4.7, studentsCompleted: 6120, tags: ["camera", "manual"], daysAgo: 8 },
  { id: "photo-portrait", title: "Light a Portrait with One Softbox", category: "Photography", level: "Intermediate", totalMinutes: 35, summary: "Rembrandt, loop, butterfly — three flattering setups.", tools: ["Softbox", "Camera"], materials: [], rating: 4.7, studentsCompleted: 2210, tags: ["lighting"], daysAgo: 17 },
  { id: "art-watercolor", title: "Paint a Watercolor Wash", category: "Art", level: "Beginner", totalMinutes: 40, summary: "Wet-on-wet, wet-on-dry — a soft sunset sky in one sitting.", tools: ["Brushes", "Paper"], materials: ["Watercolor set"], rating: 4.7, studentsCompleted: 1420, tags: ["watercolor"], daysAgo: 21 },
  { id: "music-guitar", title: "Play Your First Guitar Chords", category: "Music", level: "Beginner", totalMinutes: 30, summary: "G, C, D and a strumming pattern — one song by the end.", tools: ["Guitar"], materials: [], rating: 4.8, studentsCompleted: 12420, tags: ["guitar", "chords"], daysAgo: 5, popularityScore: 85 },

  // Outdoor / Gardening / Fitness
  { id: "out-fishing", title: "Tie the Improved Clinch Knot", category: "Outdoor", level: "Beginner", totalMinutes: 10, summary: "The essential fishing knot — five wraps, thread the loop, cinch.", tools: [], materials: ["Line", "Hook"], rating: 4.8, studentsCompleted: 3200, tags: ["fishing", "knots"], daysAgo: 13 },
  { id: "out-fire", title: "Build a One-Match Campfire", category: "Outdoor", level: "Beginner", totalMinutes: 20, summary: "Tinder, kindling, fuel — teepee that catches on the first try.", tools: ["Matches", "Knife"], materials: ["Tinder"], rating: 4.7, studentsCompleted: 2810, tags: ["fire", "camping"], daysAgo: 26 },
  { id: "gard-tomatoes", title: "Grow Tomatoes from Seed", category: "Gardening", level: "Beginner", totalMinutes: 45, summary: "Start indoors, transplant, stake, prune suckers, harvest.", tools: ["Trowel", "Stakes"], materials: ["Seeds", "Soil"], rating: 4.7, studentsCompleted: 5210, tags: ["vegetables"], daysAgo: 9 },
  { id: "gard-prune", title: "Prune a Fruit Tree", category: "Gardening", level: "Intermediate", totalMinutes: 35, summary: "Dead, damaged, diseased — plus the four cuts that shape growth.", tools: ["Pruning shears", "Loppers"], materials: [], rating: 4.6, studentsCompleted: 1620, tags: ["pruning"], daysAgo: 33 },
  { id: "fit-squat", title: "Squat with Proper Form", category: "Fitness", level: "Beginner", totalMinutes: 20, summary: "Bracing, depth, drive — protect knees and build legs.", tools: ["Barbell (optional)"], materials: [], rating: 4.8, studentsCompleted: 14200, tags: ["squat", "form"], daysAgo: 3, popularityScore: 87 },
  { id: "fit-deadlift", title: "Learn the Deadlift", category: "Fitness", level: "Intermediate", totalMinutes: 30, summary: "Set the back, sweep the bar, drive the floor away.", tools: ["Barbell"], materials: [], rating: 4.8, studentsCompleted: 8020, tags: ["deadlift"], daysAgo: 7 },

  // Business / Science
  { id: "biz-pitch", title: "Deliver a Two-Minute Pitch", category: "Business", level: "Beginner", totalMinutes: 25, summary: "Hook, problem, solution, ask — pitch that lands the meeting.", tools: [], materials: [], rating: 4.6, studentsCompleted: 3300, tags: ["pitch"], daysAgo: 16 },
  { id: "sci-microscope", title: "Use a Compound Microscope", category: "Science", level: "Beginner", totalMinutes: 20, summary: "Slide prep, focus low to high, oil immersion basics.", tools: ["Microscope"], materials: ["Slides"], rating: 4.7, studentsCompleted: 1120, tags: ["lab"], daysAgo: 40 },

  // Mechanics
  { id: "mech-bike-flat", title: "Fix a Flat Bike Tire", category: "Mechanics", level: "Beginner", totalMinutes: 20, summary: "Off with the wheel, patch or swap the tube, back on the road.", tools: ["Tire levers", "Pump"], materials: ["Patch kit", "Tube"], rating: 4.8, studentsCompleted: 7200, tags: ["bike"], daysAgo: 6 },
];

export const LESSON_LIBRARY: LessonSummary[] = SEEDS.map((s, i) => ({
  id: s.id,
  title: s.title,
  category: s.category,
  level: s.level,
  totalMinutes: s.totalMinutes,
  cover: pickCover(i),
  summary: s.summary,
  available: true,
  tools: s.tools,
  materials: s.materials,
  rating: s.rating ?? 4.5,
  studentsCompleted: s.studentsCompleted ?? 500,
  tags: s.tags ?? [],
  createdAt: new Date(Date.now() - (s.daysAgo ?? 30) * 86400_000).toISOString(),
  popularityScore: s.popularityScore ?? Math.round((s.rating ?? 4.5) * 10 + Math.log10((s.studentsCompleted ?? 500) + 1) * 5),
  source: s.source ?? "official",
}));

// Give the oil-change lesson its real cover after auto-cycling
const oilIdx = LESSON_LIBRARY.findIndex((l) => l.id === OIL_CHANGE_LESSON.id);
if (oilIdx >= 0) LESSON_LIBRARY[oilIdx].cover = OIL_CHANGE_LESSON.cover;

// ---------- Query helpers ----------

export function getLesson(id: string): Lesson | undefined {
  if (id === OIL_CHANGE_LESSON.id) return OIL_CHANGE_LESSON;
  return undefined;
}

/**
 * getLessonOrPreview — every catalog entry is playable through the
 * shared engine. Until a lesson has its own authored content, it opens
 * the reference lesson (oil change) so the interactive engine can be
 * experienced end-to-end. Real content plugs in later without any UI
 * change.
 */
export function getLessonOrPreview(id: string): { lesson: Lesson; preview: boolean; summary?: LessonSummary } {
  const real = getLesson(id);
  if (real) {
    const summary = LESSON_LIBRARY.find((l) => l.id === id);
    return { lesson: real, preview: false, summary };
  }
  const summary = LESSON_LIBRARY.find((l) => l.id === id);
  if (!summary) throw new Error("Lesson not found");
  const clone: Lesson = {
    ...OIL_CHANGE_LESSON,
    id: summary.id,
    title: summary.title,
    category: summary.category,
    level: summary.level,
    totalMinutes: summary.totalMinutes,
    cover: summary.cover,
    summary: summary.summary,
  };
  return { lesson: clone, preview: true, summary };
}

export function searchLessons(query: string, category?: string): LessonSummary[] {
  const q = query.trim().toLowerCase();
  return LESSON_LIBRARY.filter((l) => {
    if (category && category !== "All" && l.category !== category) return false;
    if (!q) return true;
    return (
      l.title.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q)) ||
      l.tools.some((t) => t.toLowerCase().includes(q)) ||
      l.materials.some((m) => m.toLowerCase().includes(q))
    );
  });
}

export function popularLessons(limit = 8): LessonSummary[] {
  return [...LESSON_LIBRARY].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, limit);
}

export function recentlyAddedLessons(limit = 8): LessonSummary[] {
  return [...LESSON_LIBRARY]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function lessonsByCategory(category: Category): LessonSummary[] {
  return LESSON_LIBRARY.filter((l) => l.category === category);
}

export function recommendedFor(seenIds: string[] = [], limit = 8): LessonSummary[] {
  const seenCats = new Set(
    seenIds.map((id) => LESSON_LIBRARY.find((l) => l.id === id)?.category).filter(Boolean),
  );
  if (seenCats.size === 0) return popularLessons(limit);
  return LESSON_LIBRARY.filter((l) => seenCats.has(l.category) && !seenIds.includes(l.id))
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit);
}

/** Example popular queries surfaced on the home page. */
export const SUGGESTED_QUERIES = [
  "Oil Change",
  "Brake Pads",
  "Cooking Steak",
  "Bake Bread",
  "Install Ceiling Fan",
  "Woodworking",
  "Python Programming",
  "Excel",
  "Photography",
  "First Aid",
  "CPR",
  "Welding",
  "Plumbing",
  "Drywall",
  "Fishing",
  "Gardening",
  "Electronics",
  "Car Detailing",
];
