import { useEffect, useRef, useState } from "react";
import { generateLessonVisual, getCachedVisual } from "@/lib/lesson-visuals";

/**
 * ActionDemo — renders one continuous first-person demonstration of a
 * single hotspot action: the camera pushes in on the exact area, an
 * AI-generated frame of real hands gripping the correct tool sweeps in,
 * performs one complete stroke, the object reacts, then it stops.
 *
 * If no demonstration frame exists yet for this action, one is generated
 * from the lesson step itself (and cached per topic + action) instead of
 * falling back to a plain zoom.
 */
export function ActionDemo({
  scene,
  x,
  y,
  duration,
  topic,
  category,
  label,
  action,
  slow,
  replayKey,
  onEnded,
}: {
  scene: string;
  x: number;
  y: number;
  duration: number;
  topic: string;
  category?: string;
  label: string;
  action: string;
  slow: boolean;
  replayKey: number;
  onEnded?: () => void;
}) {
  const variant = `action: ${label} — ${action}`;
  const [frame, setFrame] = useState<string | undefined>(() => getCachedVisual(topic, variant));
  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;

  // Generate the demonstration frame for this exact action if we lack one.
  useEffect(() => {
    if (frame) return;
    let active = true;
    (async () => {
      const url = await generateLessonVisual(
        topic,
        category,
        `${variant}. Extreme close-up, first-person point of view over the learner's shoulders: realistic human hands correctly gripping the exact tool for this action, caught mid-movement performing it, the worked object reacting. Natural hand shadows, realistic lighting.`,
      );
      if (active && url) setFrame(url);
    })();
    return () => {
      active = false;
    };
  }, [frame, topic, category, variant]);

  // One continuous take: it ends by itself, then hands control back.
  useEffect(() => {
    const ms = duration * 1000 * (slow ? 2.5 : 1);
    const t = window.setTimeout(() => endedRef.current?.(), ms);
    return () => window.clearTimeout(t);
  }, [duration, slow, replayKey, frame]);

  const speed = slow ? 2.5 : 1;
  const style = {
    "--zoom-x": `${x}%`,
    "--zoom-y": `${y}%`,
    "--demo-speed": `${duration * speed}s`,
  } as React.CSSProperties;

  return (
    <div key={replayKey} className="relative h-full w-full overflow-hidden bg-black" style={style}>
      {/* Camera pushes toward the exact area being worked on */}
      <img src={scene} alt="" className="demo-camera h-full w-full object-cover" />

      {/* Continuous hand + tool movement for this action */}
      {frame && (
        <img
          src={frame}
          alt={`Demonstration: ${action}`}
          className="demo-hands absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Highlight of the precise working area */}
      <div
        className="demo-target pointer-events-none absolute"
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        <span className="demo-target-ring" />
        <span className="demo-target-core" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

      {!frame && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 text-center">
          <span className="rounded-full border border-ember/40 bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ember backdrop-blur">
            Rendering the movement…
          </span>
        </div>
      )}
    </div>
  );
}
