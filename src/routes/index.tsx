import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import heroImg from "@/assets/hero-workshop.jpg";
import scene1 from "@/assets/lesson-oil-scene-1-hood.jpg";
import { LESSON_LIBRARY, CATEGORIES } from "@/lib/lessons";
import {
  ArrowRight,
  Hand,
  Eye,
  Rewind,
  MessageCircle,
  Zap,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const featured = LESSON_LIBRARY[0];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="A modern automotive workshop at dusk, warm lighting inside"
            className="ken-burns h-full w-full object-cover opacity-40"
            width={1920}
            height={1200}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 ember-radial" />
        </div>

        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-ember" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">
              Immersive AI Learning
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Learn real skills,
            <br />
            <span className="italic text-ember">one action</span> at a time.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Skill Sensei drops you into a real garage, kitchen, or workshop beside a
            master instructor. Tap any tool. Watch one deliberate action. Then do it
            yourself.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 px-6 shadow-glow">
              <Link to="/auth">
                Start your first lesson
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-border/60 bg-surface/40 px-6 backdrop-blur">
              <Link to="/library">Browse the library</Link>
            </Button>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-3 gap-8 border-t border-border/40 pt-8">
            <Stat value="1 action" label="per demonstration" />
            <Stat value="Real POV" label="first-person scenes" />
            <Stat value="Ask anything" label="live AI instructor" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-border/40 bg-surface/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">
                The method
              </p>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Not another video course.
                <br />
                <span className="italic text-muted-foreground">A workshop you can step into.</span>
              </h2>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Eye className="h-5 w-5" />}
              step="01"
              title="Photoreal first-person scenes"
              body="Every lesson takes place inside a realistic environment — a working garage, a professional kitchen, a wood shop. The camera is your eyes."
            />
            <FeatureCard
              icon={<Hand className="h-5 w-5" />}
              step="02"
              title="Tap any tool to learn it"
              body="Every important object is interactive. Tap the drain plug, the whisk, the soldering iron. The instructor demonstrates that one action and pauses."
            />
            <FeatureCard
              icon={<Rewind className="h-5 w-5" />}
              step="03"
              title="Replay. Slow down. Ask why."
              body="Never autoplays. You control the pace. Ask the AI instructor anything — 'why', 'show again', 'what happens if I skip this'."
            />
          </div>
        </div>
      </section>

      {/* FEATURED LESSON */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative overflow-hidden rounded-2xl border border-border/40 shadow-panel">
              <img
                src={scene1}
                alt="First-person view of an open engine bay in a professional garage"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                width={1600}
                height={1200}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-ember shadow-glow" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
                    Featured lesson · Live now
                  </span>
                </div>
              </div>
              {/* animated hotspot dot */}
              <div className="pointer-events-none absolute left-[42%] top-[52%]">
                <div className="hotspot-dot h-4 w-4 rounded-full border-2 border-ember bg-ember/70" />
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">
                {featured.category}
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{featured.summary}</p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span>
                  <span className="text-foreground">{featured.totalMinutes} min</span> · 5 steps
                </span>
                <span>Level: <span className="text-foreground">{featured.level}</span></span>
                <span>Instructor: <span className="text-foreground">Marcus Reid, ASE</span></span>
              </div>

              <div className="mt-8">
                <Button asChild size="lg" className="shadow-glow">
                  <Link to="/auth">
                    Enter the workshop
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <ul className="mt-10 space-y-3 border-t border-border/40 pt-6 text-sm">
                {[
                  { icon: <Layers className="h-4 w-4" />, t: "Standing over the engine — orient yourself" },
                  { icon: <Layers className="h-4 w-4" />, t: "Under the car — drain the old oil" },
                  { icon: <Layers className="h-4 w-4" />, t: "Swap the filter without a mess" },
                  { icon: <Layers className="h-4 w-4" />, t: "Refill and verify the level" },
                ].map((s, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/50 text-ember">
                      {s.icon}
                    </span>
                    <span>{s.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-t border-border/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">
            Any teachable skill
          </p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
            A workshop for every craft.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Automotive is live today. New environments arrive every week.
          </p>

          <div className="mt-12 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border/60 bg-surface px-4 py-2 text-sm text-muted-foreground transition hover:border-ember/40 hover:text-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-surface/40 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ember to-primary shadow-glow">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            The instructor is waiting.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Sign in and step into your first lesson. It takes 20 seconds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="shadow-glow">
              <Link to="/auth">
                Start learning free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MessageCircle className="hidden" />

      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Skill Sensei. Learn by doing.</p>
          <p className="font-mono uppercase tracking-widest">v0.1 · beta</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-2xl text-foreground">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  step,
  title,
  body,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition hover:border-ember/40">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-ember">
          {icon}
        </div>
        <span className="font-mono text-xs text-muted-foreground">{step}</span>
      </div>
      <h3 className="mt-6 font-serif text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
