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
      {frame ? (
        <img
          src={frame}
          alt={`Demonstration: ${action}`}
          className="demo-hands absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        /* No photoreal frame available — still demonstrate the movement:
           a hand gripping a tool sweeps in and performs the stroke on the
           exact working area, driven by the same continuous timing. */
        <div
          className="demo-mime pointer-events-none absolute"
          style={{ left: `${x}%`, top: `${y}%` }}
          aria-label={`Demonstration: ${action}`}
        >
          <svg viewBox="0 0 200 200" className="h-56 w-56 drop-shadow-[0_18px_28px_rgba(0,0,0,0.6)]">
            {/* tool */}
            <g className="demo-mime-tool">
              <rect x="92" y="18" width="14" height="62" rx="6" fill="var(--ember)" opacity="0.95" />
              <rect x="86" y="72" width="26" height="20" rx="5" fill="#d8dde3" />
            </g>
            {/* hand */}
            <g fill="#e8c39a" stroke="rgba(0,0,0,0.35)" strokeWidth="2">
              <rect x="74" y="88" width="52" height="44" rx="20" />
              <rect x="66" y="98" width="24" height="16" rx="8" />
              <rect x="82" y="126" width="42" height="46" rx="18" />
            </g>
          </svg>
        </div>
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

      {/* What is being demonstrated, straight from the lesson step */}
      <div className="pointer-events-none absolute inset-x-0 bottom-24 px-6 text-center">
        <span className="inline-block rounded-full border border-ember/40 bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ember backdrop-blur">
          {label}
        </span>
        <p className="mx-auto mt-2 max-w-md text-sm text-foreground/90 drop-shadow">{action}</p>
      </div>
    </div>

  );
}
