import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import type { Demonstration } from "@/lib/lessons";
import { ActionDemo } from "./action-demo";

export type DemoStageHandle = {
  replay: () => void;
  setSlowMotion: (slow: boolean) => void;
};

/**
 * The pluggable demonstration renderer. Swap in AI-generated clips,
 * 3D scenes, or realtime avatars by extending the Demonstration union
 * and adding a branch below. The rest of the app never changes.
 */
export const DemonstrationStage = forwardRef<
  DemoStageHandle,
  { demo: Demonstration; onEnded?: () => void }
>(function DemonstrationStage({ demo, onEnded }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [slow, setSlow] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  useImperativeHandle(ref, () => ({
    replay: () => {
      setReplayKey((k) => k + 1);
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        void v.play();
      }
    },
    setSlowMotion: (s: boolean) => {
      setSlow(s);
      const v = videoRef.current;
      if (v) v.playbackRate = s ? 0.4 : 1;
    },
  }));

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.playbackRate = slow ? 0.4 : 1;
      void v.play().catch(() => {});
    }
  }, [demo, slow]);

  if (demo.kind === "action-demo") {
    return (
      <ActionDemo
        scene={demo.scene}
        x={demo.x}
        y={demo.y}
        duration={demo.duration}
        topic={demo.topic}
        category={demo.category}
        label={demo.label}
        action={demo.action}
        slow={slow}
        replayKey={replayKey}
        onEnded={onEnded}
      />
    );
  }


  if (demo.kind === "video") {
    return (
      <video
        ref={videoRef}
        key={demo.src}
        src={demo.src}
        poster={demo.poster}
        autoPlay
        muted
        playsInline
        onEnded={onEnded}
        className="h-full w-full object-cover"
      />
    );
  }

  if (demo.kind === "scene-zoom") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black">
        <img
          src={demo.scene}
          alt=""
          className="h-full w-full object-cover hotspot-zoom"
          style={
            {
              "--zoom-x": `${demo.x}%`,
              "--zoom-y": `${demo.y}%`,
            } as React.CSSProperties
          }
          onAnimationEnd={onEnded}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
      </div>
    );
  }

  // Reserved future demo types — render a graceful placeholder.
  return (
    <div className="flex h-full w-full items-center justify-center bg-black text-muted-foreground">
      <p className="font-mono text-xs uppercase tracking-widest">
        Demonstration format coming soon
      </p>
    </div>
  );
});
