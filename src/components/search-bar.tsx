import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { SUGGESTED_QUERIES } from "@/lib/lessons";

export function SearchBar({
  size = "md",
  initial = "",
  showSuggestions = false,
}: {
  size?: "sm" | "md" | "lg";
  initial?: string;
  showSuggestions?: boolean;
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initial);

  const submit = (value: string) => {
    const query = value.trim();
    navigate({ to: "/search", search: { q: query, category: "", sort: "relevance" } });
  };

  const heights = { sm: "h-10", md: "h-12", lg: "h-14" }[size];
  const pad = { sm: "pl-10 pr-4 text-sm", md: "pl-12 pr-4 text-base", lg: "pl-14 pr-5 text-lg" }[size];
  const iconLeft = { sm: "left-3", md: "left-4", lg: "left-5" }[size];

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        className="relative w-full"
      >
        <Search
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground ${iconLeft}`}
          size={size === "lg" ? 20 : 18}
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search any skill — oil change, sourdough, CPR, python…"
          className={`w-full rounded-full border border-border/60 bg-surface/70 backdrop-blur transition focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/20 ${heights} ${pad}`}
          aria-label="Search skills"
        />
      </form>
      {showSuggestions && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTED_QUERIES.slice(0, 12).map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs text-muted-foreground transition hover:border-ember/50 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
