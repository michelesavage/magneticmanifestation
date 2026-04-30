import { useState } from "react";
import { Sparkles, Eye, RefreshCw } from "lucide-react";

type Entry = { id: string; type: "gratitude" | "abundance" | "reframe"; text: string };

const prompts = {
  gratitude: "What are you most grateful for in this moment?",
  abundance: "Where do you see abundance flowing toward you today?",
  reframe: "What obstacle is secretly redirecting you somewhere better?",
};

const tabs = [
  { id: "gratitude", label: "Gratitude", icon: Sparkles, tint: "from-dawn to-dawn-glow" },
  { id: "abundance", label: "Abundance", icon: Eye, tint: "from-rose to-lavender" },
  { id: "reframe", label: "Reframe", icon: RefreshCw, tint: "from-sage to-dawn" },
] as const;

export function MindsetRewire() {
  const [active, setActive] = useState<"gratitude" | "abundance" | "reframe">("gratitude");
  const [draft, setDraft] = useState("");
  const [entries, setEntries] = useState<Entry[]>([
    { id: "1", type: "gratitude", text: "The way morning light touched my face." },
    { id: "2", type: "abundance", text: "Three unexpected messages from people I love." },
  ]);

  const filtered = entries.filter((e) => e.type === active);

  const submit = () => {
    if (!draft.trim()) return;
    setEntries((e) => [{ id: crypto.randomUUID(), type: active, text: draft.trim() }, ...e]);
    setDraft("");
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="mb-6">
        <h2 className="font-serif text-3xl">Rewire</h2>
        <p className="text-sm text-muted-foreground mt-1">Train the eye to see what's already yours.</p>
      </div>

      <div className="flex gap-2 mb-5 p-1 bg-muted/60 rounded-2xl">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 transition-sacred ${
                isActive ? `bg-gradient-to-br ${t.tint} text-indigo-deep shadow-soft` : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl bg-background/50 p-4 border border-border/60">
          <p className="font-serif italic text-indigo mb-3">{prompts[active]}</p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder="Begin softly..."
            className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground/60 text-foreground"
          />
          <div className="flex justify-end">
            <button
              onClick={submit}
              className="px-5 py-2 rounded-full bg-gradient-dawn text-indigo-deep text-sm font-medium hover:opacity-90 transition-sacred"
            >
              Anchor it
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-6">
              Your first reflection awaits.
            </p>
          )}
          {filtered.map((e) => (
            <div key={e.id} className="rounded-xl bg-background/40 border border-border/40 p-3 text-sm text-foreground/90 animate-fade-up">
              {e.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
