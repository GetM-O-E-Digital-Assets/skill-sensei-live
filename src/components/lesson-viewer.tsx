import { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import type { Lesson, Hotspot } from "@/lib/lessons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AiInstructorChat, type LessonChatContext } from "./ai-instructor-chat";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Bookmark,
  MessageCircle,
  ArrowLeft,
  Check,
  Pause,
  Play,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { saveProgress, toggleBookmark } from "@/lib/progress.functions";

type Mode = "interactive" | "auto";

export function LessonViewer({ lesson }: { lesson: Lesson }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<Mode>("interactive");
  const [bookmarked, setBookmarked] = useState(false);

  const step = lesson.steps[stepIdx];
  const progress = Math.round(((stepIdx + (activeHotspot ? 0.5 : 0)) / lesson.steps.length) * 100);

  const chatContext: LessonChatContext = useMemo(
    () => ({
      lessonTitle: lesson.title,
      stepTitle: step.title,
      stepIntro: step.intro,
      hotspotLabel: activeHotspot?.label,
      hotspotAction: activeHotspot?.action,
    }),
    [lesson.title, step, activeHotspot],
  );

  // Auto mode: pick next uncompleted hotspot every few seconds when paused
  useEffect(() => {
    if (mode !== "auto" || activeHotspot) return;
    const t = setTimeout(() => {
      const next = step.hotspots.find((h) => !completed.has(`${step.id}:${h.id}`));
      if (next) setActiveHotspot(next);
    }, 900);
    return () => clearTimeout(t);
  }, [mode, activeHotspot, step, completed]);

  function markHotspotComplete() {
    if (!activeHotspot) return;
    const key = `${step.id}:${activeHotspot.id}`;
    setCompleted((prev) => new Set(prev).add(key));
    setActiveHotspot(null);
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
          <Button
            variant={mode === "auto" ? "default" : "outline"}
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => setMode(mode === "auto" ? "interactive" : "auto")}
          >
            {mode === "auto" ? <Pause className="mr-1 h-3.5 w-3.5" /> : <Zap className="mr-1 h-3.5 w-3.5" />}
            {mode === "auto" ? "Pause auto" : "Auto demo"}
          </Button>
          <Button variant="outline" size="icon" onClick={onBookmark}>
            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-ember text-ember" : ""}`} />
          </Button>

          {/* Mobile chat sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="lg:hidden">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md p-0 sm:w-[420px]">
              <AiInstructorChat context={chatContext} />
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
          <SceneStage
            step={step}
            activeHotspot={activeHotspot}
            completedIds={completed}
            onSelect={(h) => setActiveHotspot(h)}
          />

          {/* Step intro card */}
          {!activeHotspot && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <div className="pointer-events-auto mx-auto max-w-2xl rounded-2xl border border-border/50 bg-background/85 p-5 shadow-panel backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">
                    {step.duration} · Step {stepIdx + 1}
                  </span>
                </div>
                <h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.intro}
                </p>
                <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ember">
                  <span className="hotspot-dot inline-block h-2 w-2 rounded-full bg-ember" />
                  Tap any glowing point to see it demonstrated
                </p>
              </div>
            </div>
          )}

          {/* Hotspot demonstration overlay */}
          {activeHotspot && (
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <div className="mx-auto max-w-2xl rounded-2xl border border-ember/40 bg-background/90 p-6 shadow-panel backdrop-blur-xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">
                  Demonstration · {activeHotspot.label}
                </p>
                <h3 className="mt-2 font-serif text-2xl">{activeHotspot.action}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  {activeHotspot.detail}
                </p>
                <div className="mt-4 rounded-lg border border-border/40 bg-surface/50 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ember">
                    Why it matters
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{activeHotspot.why}</p>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // trigger a replay by briefly unsetting then reselecting
                        const h = activeHotspot;
                        setActiveHotspot(null);
                        setTimeout(() => setActiveHotspot(h), 40);
                      }}
                    >
                      <RotateCcw className="mr-1 h-3.5 w-3.5" /> Replay
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveHotspot(null)}>
                      Back
                    </Button>
                  </div>
                  <Button size="sm" onClick={markHotspotComplete} className="shadow-glow">
                    <Check className="mr-1 h-3.5 w-3.5" /> I did it
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR (desktop) */}
        <aside className="hidden w-[380px] shrink-0 flex-col border-l border-border/50 bg-surface/40 lg:flex xl:w-[420px]">
          <div className="flex-1 overflow-hidden">
            <AiInstructorChat context={chatContext} />
          </div>
        </aside>
      </div>

      {/* FOOTER STEP NAV */}
      <footer className="flex items-center justify-between border-t border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Button variant="ghost" onClick={goPrev} disabled={stepIdx === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous step
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
          {stepIdx === lesson.steps.length - 1 ? "Finish" : "Next step"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </footer>

      <Play className="hidden" />
    </div>
  );
}

function SceneStage({
  step,
  activeHotspot,
  completedIds,
  onSelect,
}: {
  step: Lesson["steps"][number];
  activeHotspot: Hotspot | null;
  completedIds: Set<string>;
  onSelect: (h: Hotspot) => void;
}) {
  const zoomStyle = activeHotspot
    ? ({
        "--zoom-x": `${activeHotspot.x}%`,
        "--zoom-y": `${activeHotspot.y}%`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className="relative h-[52vh] w-full overflow-hidden sm:h-[62vh] lg:h-full">
      <img
        key={step.id + (activeHotspot?.id ?? "")}
        src={step.scene}
        alt={step.title}
        className={`h-full w-full object-cover ${
          activeHotspot ? "hotspot-zoom" : "ken-burns"
        }`}
        style={zoomStyle}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {!activeHotspot &&
        step.hotspots.map((h) => {
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
