import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export type LessonChatContext = {
  lessonTitle: string;
  stepTitle: string;
  stepIntro: string;
  hotspotLabel?: string;
  hotspotAction?: string;
};

const QUICK_ASKS = [
  "Why are you doing this?",
  "Show me again",
  "Slow down",
  "What if I skip this?",
  "How do I know I did it correctly?",
];

export function AiInstructorChat({ context }: { context: LessonChatContext }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `I'm right here beside you. Ask me anything about "${context.stepTitle}" — or tap one of the quick questions below.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lessonContext: context }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text().catch(() => "chat failed"));

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buf = "";
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += value;
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const l = line.trim();
          if (!l.startsWith("data:")) continue;
          const data = l.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            /* ignore heartbeat */
          }
        }
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "The instructor lost signal. Try again in a moment — if this keeps happening the AI credits may need topping up.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border/50 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-ember to-primary shadow-glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <div className="font-serif text-lg leading-none">Sensei</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Live · context-aware
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="space-y-3 p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-ember text-primary-foreground"
                    : "bg-surface-elevated text-foreground"
                }`}
              >
                {m.content || (streaming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "")}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border/50 p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK_ASKS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={streaming}
              className="rounded-full border border-border/60 bg-surface px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-ember/40 hover:text-foreground disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the instructor…"
            className="bg-surface"
            disabled={streaming}
          />
          <Button type="submit" size="icon" disabled={streaming || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
