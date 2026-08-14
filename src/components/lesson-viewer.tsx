import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import type { Lesson, Hotspot } from "@/lib/lessons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AiInstructorChat, type LessonChatContext } from "./ai-instructor-chat";
import { DemonstrationStage, type DemoStageHandle } from "./demonstration-stage";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Bookmark,
  MessageCircle,
  ArrowLeft,
  Check,
  Turtle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { saveProgress, toggleBookmark } from "@/lib/progress.functions";

export function LessonViewer({
  lesson,
  onStepEnter,
}: {
  lesson: Lesson;
  /** Fired when the learner arrives at a step — used for on-demand assets. */
  onStepEnter?: (stepId: string, index: number) => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState(false);
  const [slowMo, setSlowMo] = useState(false);
  const [demoEnded, setDemoEnded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState<string | undefined>(undefined);
  const stageRef = useRef<DemoStageHandle>(null);

  const step = lesson.steps[stepIdx];
  const progress = Math.round((stepIdx / lesson.steps.length) * 100);

  const chatContext: LessonChatContext = useMemo(
    () => ({
      lessonTitle: lesson.title,
      stepTitle: step.title,
      stepIntro: step.intro,
      stepIndex: stepIdx + 1,
      stepCount: lesson.steps.length,
      hotspotLabel: activeHotspot?.label,
      hotspotAction: activeHotspot?.action,
      hotspotWhy: activeHotspot?.why,
      completedCount: completed.size,
    }),
    [lesson.title, lesson.steps.length, step, stepIdx, activeHotspot, completed],
  );

  // Reset demo state whenever a new hotspot is opened
  useEffect(() => {
    setDemoEnded(false);
    setSlowMo(false);
  }, [activeHotspot?.id]);

  function openHotspot(h: Hotspot) {
    setActiveHotspot(h);
  }

  function closeHotspot() {
    setActiveHotspot(null);
  }

  function markHotspotComplete() {
    if (!activeHotspot) return;
    const key = `${step.id}:${activeHotspot.id}`;
    setCompleted((prev) => new Set(prev).add(key));
    setActiveHotspot(null);
  }

  function askAi(seed?: string) {
    setChatSeed(seed);
    setChatOpen(true);
  }

  async function goNext() {
    const isLast = stepIdx === lesson.steps.length - 1;
    const nextIdx = isLast ? stepIdx : stepIdx + 1;
    setStepIdx(nextIdx);
    setActiveHotspot(null);
    try {
      await saveProgress({
        data: {
          lessonId: lesson.id,
          stepIndex: nextIdx,
          completedSteps: Array.from(completed),
          completed: isLast,
        },
      });
    } catch {
      /* silent — progress saves are best-effort */
    }
    if (isLast) toast.success("Lesson complete. Skill unlocked.");
  }

  function goPrev() {
    setActiveHotspot(null);
    setStepIdx((i) => Math.max(0, i - 1));
  }

  async function onBookmark() {
    try {
      const r = await toggleBookmark({ data: { lessonId: lesson.id } });
      setBookmarked(r.bookmarked);
      toast.success(r.bookmarked ? "Bookmarked" : "Bookmark removed");
    } catch {
      toast.error("Couldn't update bookmark");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link to="/library">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
              {lesson.category} · {lesson.environment}
            </p>
            <h1 className="truncate font-serif text-lg leading-tight sm:text-xl">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBookmark}>
            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-ember text-ember" : ""}`} />
          </Button>

          <Sheet open={chatOpen} onOpenChange={setChatOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="lg:hidden">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md p-0 sm:w-[420px]">
              <AiInstructorChat context={chatContext} seed={chatSeed} onSeedConsumed={() => setChatSeed(undefined)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* PROGRESS */}
      <div className="border-b border-border/50 px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <Progress value={progress} className="h-1 flex-1" />
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Step {stepIdx + 1} / {lesson.steps.length}
          </span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* LESSON VIEWPORT */}
        <div className="relative flex-1 overflow-hidden bg-black">
          {!activeHotspot ? (
            <SceneStage
              step={step}
              completedIds={completed}
              onSelect={openHotspot}
            />
          ) : (
            <div className="relative h-[52vh] w-full sm:h-[62vh] lg:h-full">
              <DemonstrationStage
                ref={stageRef}
                demo={activeHotspot.demo}
                onEnded={() => setDemoEnded(true)}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Demo caption */}
              <div className="pointer-events-none absolute inset-x-0 top-0 p-4 sm:p-6">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">
                      Demonstration · {activeHotspot.label}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-foreground drop-shadow">
                      {activeHotspot.action}
                    </h3>
                  </div>
                  {slowMo && (
                    <span className="rounded-full border border-ember/40 bg-background/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ember backdrop-blur">
                      0.4× slow-mo
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step intro card — only when idle */}
          {!activeHotspot && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <div className="pointer-events-auto mx-auto max-w-2xl rounded-2xl border border-border/50 bg-background/85 p-5 shadow-panel backdrop-blur-xl">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">
                  {step.duration} · Step {stepIdx + 1}
                </span>
                <h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.intro}
                </p>
                <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ember">
                  <span className="hotspot-dot inline-block h-2 w-2 rounded-full bg-ember" />
                  Tap any glowing point to watch it done
                </p>
              </div>
            </div>
          )}

          {/* Post-demonstration action bar + coaching */}
          {activeHotspot && (
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <div className="mx-auto max-w-2xl space-y-3">
                {demoEnded && (
                  <CoachingCard hotspot={activeHotspot} onAskWhy={() => askAi(`Why: ${activeHotspot.why}`)} />
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/50 bg-background/90 p-3 shadow-panel backdrop-blur-xl">
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        stageRef.current?.replay();
                        setDemoEnded(false);
                      }}
                    >
                      <RotateCcw className="mr-1 h-3.5 w-3.5" /> Replay
                    </Button>
                    <Button
                      variant={slowMo ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const next = !slowMo;
                        setSlowMo(next);
                        stageRef.current?.setSlowMotion(next);
                        stageRef.current?.replay();
                        setDemoEnded(false);
                      }}
                    >
                      <Turtle className="mr-1 h-3.5 w-3.5" /> Slow motion
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        askAi(`I'm on "${activeHotspot.label}" — ${activeHotspot.action}. `)
                      }
                    >
                      <MessageCircle className="mr-1 h-3.5 w-3.5" /> Ask AI
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        askAi(`Why do we ${activeHotspot.action.toLowerCase()}?`)
                      }
                    >
                      <HelpCircle className="mr-1 h-3.5 w-3.5" /> Why?
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={closeHotspot}>
                      Back
                    </Button>
                    <Button size="sm" onClick={markHotspotComplete} className="shadow-glow">
                      <Check className="mr-1 h-3.5 w-3.5" /> I did it
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR (desktop) */}
        <aside className="hidden w-[380px] shrink-0 flex-col border-l border-border/50 bg-surface/40 lg:flex xl:w-[420px]">
          <div className="flex-1 overflow-hidden">
            <AiInstructorChat
              context={chatContext}
              seed={chatSeed}
              onSeedConsumed={() => setChatSeed(undefined)}
            />
          </div>
        </aside>
      </div>

      {/* FOOTER STEP NAV */}
      <footer className="flex items-center justify-between border-t border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Button variant="ghost" onClick={goPrev} disabled={stepIdx === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-1.5">
          {lesson.steps.map((s, i) => {
            const done = s.hotspots.every((h) => completed.has(`${s.id}:${h.id}`));
            return (
              <button
                key={s.id}
                onClick={() => {
                  setStepIdx(i);
                  setActiveHotspot(null);
                }}
                aria-label={s.title}
                className={`h-1.5 w-6 rounded-full transition ${
                  i === stepIdx
                    ? "bg-ember shadow-glow"
                    : done
                      ? "bg-ember/40"
                      : "bg-border"
                }`}
              />
            );
          })}
        </div>
        <Button onClick={goNext} className="shadow-glow">
          {stepIdx === lesson.steps.length - 1 ? "Finish" : "Next"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </footer>
    </div>
  );
}

function CoachingCard({
  hotspot,
  onAskWhy,
}: {
  hotspot: Hotspot;
  onAskWhy: () => void;
}) {
  return (
    <div className="animate-fade-in rounded-2xl border border-border/50 bg-background/90 p-4 shadow-panel backdrop-blur-xl">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={onAskWhy}
          className="flex items-start gap-2 rounded-lg border border-border/40 bg-surface/50 p-2.5 text-left transition hover:border-ember/40"
        >
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ember">Why it matters</p>
            <p className="mt-0.5 text-sm text-foreground">{hotspot.why}</p>
          </div>
        </button>

        {hotspot.tips && hotspot.tips.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-border/40 bg-surface/50 p-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ember">Quick tips</p>
              <ul className="mt-0.5 space-y-0.5 text-sm text-foreground">
                {hotspot.tips.map((t) => (
                  <li key={t}>· {t}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {hotspot.warning && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-2.5 sm:col-span-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-destructive">Safety</p>
              <p className="mt-0.5 text-sm text-foreground">{hotspot.warning}</p>
            </div>
          </div>
        )}

        {hotspot.mistake && (
          <div className="flex items-start gap-2 rounded-lg border border-border/40 bg-surface/50 p-2.5 sm:col-span-2">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ember">Common mistake</p>
              <p className="mt-0.5 text-sm text-foreground">{hotspot.mistake}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SceneStage({
  step,
  completedIds,
  onSelect,
}: {
  step: Lesson["steps"][number];
  completedIds: Set<string>;
  onSelect: (h: Hotspot) => void;
}) {
  return (
    <div className="relative h-[52vh] w-full overflow-hidden sm:h-[62vh] lg:h-full">
      <img
        key={step.id}
        src={step.scene}
        alt={step.title}
        className="h-full w-full object-cover ken-burns"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {step.hotspots.map((h) => {
        const done = completedIds.has(`${step.id}:${h.id}`);
        return (
          <button
            key={h.id}
            onClick={() => onSelect(h)}
            aria-label={h.label}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            <span
              className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                done ? "border-ember/60 bg-ember/40" : "border-ember bg-ember/70 hotspot-dot"
              }`}
            >
              {done && <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={4} />}
            </span>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-background/90 px-2 py-1 text-[10px] font-medium opacity-0 shadow-panel backdrop-blur transition group-hover:opacity-100">
              {h.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
