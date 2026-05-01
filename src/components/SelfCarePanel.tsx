import { useState } from "react";
import { Sparkles, Smile, Shield, PartyPopper, Check, Lightbulb } from "lucide-react";

type TabId = "rituals" | "checkin" | "boundaries" | "joy";

const tabs = [
  { id: "rituals" as const, label: "Rituals", icon: Sparkles, tint: "from-dawn to-dawn-glow" },
  { id: "checkin" as const, label: "Check-in", icon: Smile, tint: "from-rose to-lavender" },
  { id: "boundaries" as const, label: "Rest", icon: Shield, tint: "from-sage to-dawn" },
  { id: "joy" as const, label: "Joy", icon: PartyPopper, tint: "from-lavender to-rose" },
];

const defaultRituals = [
  "Skincare ritual",
  "Warm bath or shower",
  "Gentle stretching",
  "Journal a page",
  "Screen-free hour",
  "Tea in stillness",
];

const moods = ["🌧️", "🌥️", "⛅", "🌤️", "☀️"];
const energies = ["🪫", "🔋", "⚡", "🔥", "✨"];

const defaultBoundaries = [
  "Honored a 'no' today",
  "Took a true rest break",
  "Protected alone time",
  "Closed work on time",
];

const ritualPrompts = [
  "Which ritual felt most nourishing today, and why?",
  "What would 'tending to yourself like someone you love' look like tonight?",
  "Which ritual do you keep skipping — and what is it protecting you from?",
];

const checkinPrompts = [
  "If your inner weather could speak, what would it ask for?",
  "Where in your body do you feel today's energy living?",
  "What's one small thing that would shift your weather by one degree?",
];

const boundaryPrompts = [
  "Whose voice are you about to override with a 'yes' you don't mean?",
  "What would saying 'not today' make space for instead?",
  "Where did you abandon yourself this week to keep someone else comfortable?",
  "What boundary, if held, would feel like a love letter to your future self?",
];

const joyPrompts = [
  "What made you laugh, even for a second, today?",
  "When did you lose track of time in the best way?",
  "What did your younger self love that you could revisit this week?",
];

function PromptCard({ prompts, tint = "dawn" }: { prompts: string[]; tint?: "dawn" | "sage" | "rose" | "lavender" }) {
  const [i, setI] = useState(0);
  return (
    <div className="rounded-2xl bg-background/40 border border-border/50 p-4 mb-4">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 w-7 h-7 rounded-full bg-gradient-to-br from-${tint} to-lavender flex items-center justify-center shrink-0`}>
          <Lightbulb className="w-3.5 h-3.5 text-indigo-deep" />
        </span>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Reflect</p>
          <p className="font-serif italic text-indigo text-sm leading-relaxed">{prompts[i]}</p>
        </div>
        <button
          onClick={() => setI((n) => (n + 1) % prompts.length)}
          className="text-xs text-muted-foreground hover:text-foreground transition-sacred shrink-0 px-2 py-1 rounded-full border border-border/40"
        >
          New
        </button>
      </div>
    </div>
  );
}

export function SelfCarePanel() {
  const [active, setActive] = useState<TabId>("rituals");

  const [rituals, setRituals] = useState<Record<string, boolean>>({});
  const [boundaries, setBoundaries] = useState<Record<string, boolean>>({});
  const [mood, setMood] = useState(2);
  const [energy, setEnergy] = useState(2);
  const [joyDraft, setJoyDraft] = useState("");
  const [joys, setJoys] = useState<string[]>([
    "Danced barefoot in the kitchen.",
  ]);
  const [ritualNote, setRitualNote] = useState("");
  const [ritualNotes, setRitualNotes] = useState<string[]>([]);
  const [checkinNote, setCheckinNote] = useState("");
  const [boundaryNote, setBoundaryNote] = useState("");
  const [boundaryNotes, setBoundaryNotes] = useState<string[]>([]);

  const toggle = (
    map: Record<string, boolean>,
    setMap: (m: Record<string, boolean>) => void,
    key: string,
  ) => setMap({ ...map, [key]: !map[key] });

  const addJoy = () => {
    if (!joyDraft.trim()) return;
    setJoys((j) => [joyDraft.trim(), ...j]);
    setJoyDraft("");
  };

  const addRitualNote = () => {
    if (!ritualNote.trim()) return;
    setRitualNotes((n) => [ritualNote.trim(), ...n]);
    setRitualNote("");
  };

  const addBoundaryNote = () => {
    if (!boundaryNote.trim()) return;
    setBoundaryNotes((n) => [boundaryNote.trim(), ...n]);
    setBoundaryNote("");
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="mb-6">
        <h2 className="font-serif text-3xl">Self-Care</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tend to yourself the way you'd tend to someone you love.
        </p>
      </div>

      <div className="flex gap-2 mb-5 p-1 bg-muted/60 rounded-2xl">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex-1 px-2 py-2.5 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-sacred ${
                isActive
                  ? `bg-gradient-to-br ${t.tint} text-indigo-deep shadow-soft`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {active === "rituals" && (
        <div>
          <PromptCard prompts={ritualPrompts} tint="dawn" />
          <div className="space-y-2">
            {defaultRituals.map((r) => {
              const on = !!rituals[r];
              return (
                <button
                  key={r}
                  onClick={() => toggle(rituals, setRituals, r)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-sacred ${
                    on
                      ? "bg-gradient-to-r from-dawn/30 to-lavender/20 border-dawn/40 text-foreground"
                      : "bg-background/40 border-border/40 text-foreground/80 hover:border-border"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      on ? "bg-gradient-dawn border-transparent" : "border-border"
                    }`}
                  >
                    {on && <Check className="w-3 h-3 text-indigo-deep" />}
                  </span>
                  {r}
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-2xl bg-background/50 p-4 border border-border/60">
            <textarea
              value={ritualNote}
              onChange={(e) => setRitualNote(e.target.value)}
              rows={2}
              placeholder="A line about how today's tending felt..."
              className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground/60 text-foreground text-sm"
            />
            <div className="flex justify-end">
              <button
                onClick={addRitualNote}
                className="px-5 py-2 rounded-full bg-gradient-dawn text-indigo-deep text-sm font-medium hover:opacity-90 transition-sacred"
              >
                Save reflection
              </button>
            </div>
          </div>
          {ritualNotes.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mt-3">
              {ritualNotes.map((n, i) => (
                <div key={i} className="rounded-xl bg-background/40 border border-border/40 p-3 text-sm text-foreground/90 animate-fade-up">
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {active === "checkin" && (
        <div className="space-y-6">
          <PromptCard prompts={checkinPrompts} tint="rose" />
          <div className="rounded-2xl bg-background/50 p-4 border border-border/60">
            <p className="font-serif italic text-indigo mb-3">How does your inner weather feel?</p>
            <div className="flex justify-between items-center mb-3 text-2xl">
              {moods.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-sacred ${
                    mood === i ? "bg-gradient-dawn shadow-soft scale-110" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-background/50 p-4 border border-border/60">
            <p className="font-serif italic text-indigo mb-3">Where is your energy?</p>
            <div className="flex justify-between items-center text-2xl">
              {energies.map((e, i) => (
                <button
                  key={i}
                  onClick={() => setEnergy(i)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-sacred ${
                    energy === i ? "bg-gradient-dawn shadow-soft scale-110" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-background/50 p-4 border border-border/60">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Name it to tame it</p>
            <textarea
              value={checkinNote}
              onChange={(e) => setCheckinNote(e.target.value)}
              rows={3}
              placeholder="What's underneath today's weather? What does it need?"
              className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground/60 text-foreground text-sm"
            />
          </div>
        </div>
      )}

      {active === "boundaries" && (
        <div>
          <PromptCard prompts={boundaryPrompts} tint="sage" />
          <div className="space-y-2">
            {defaultBoundaries.map((b) => {
              const on = !!boundaries[b];
              return (
                <button
                  key={b}
                  onClick={() => toggle(boundaries, setBoundaries, b)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-sacred ${
                    on
                      ? "bg-gradient-to-r from-sage/30 to-dawn/20 border-sage/40 text-foreground"
                      : "bg-background/40 border-border/40 text-foreground/80 hover:border-border"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      on ? "bg-gradient-dawn border-transparent" : "border-border"
                    }`}
                  >
                    {on && <Check className="w-3 h-3 text-indigo-deep" />}
                  </span>
                  {b}
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-2xl bg-background/50 p-4 border border-border/60">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Tonight's boundary</p>
            <textarea
              value={boundaryNote}
              onChange={(e) => setBoundaryNote(e.target.value)}
              rows={2}
              placeholder="One boundary I'm choosing to hold, and what it protects..."
              className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground/60 text-foreground text-sm"
            />
            <div className="flex justify-end">
              <button
                onClick={addBoundaryNote}
                className="px-5 py-2 rounded-full bg-gradient-dawn text-indigo-deep text-sm font-medium hover:opacity-90 transition-sacred"
              >
                Hold it
              </button>
            </div>
          </div>
          {boundaryNotes.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mt-3">
              {boundaryNotes.map((n, i) => (
                <div key={i} className="rounded-xl bg-background/40 border border-border/40 p-3 text-sm text-foreground/90 animate-fade-up">
                  {n}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground italic text-center pt-3">
            Rest is not a reward. It is the soil.
          </p>
        </div>
      )}

      {active === "joy" && (
        <div className="space-y-3">
          <PromptCard prompts={joyPrompts} tint="lavender" />
          <div className="rounded-2xl bg-background/50 p-4 border border-border/60">
            <p className="font-serif italic text-indigo mb-3">
              What delighted, played, or lit you up today?
            </p>
            <textarea
              value={joyDraft}
              onChange={(e) => setJoyDraft(e.target.value)}
              rows={2}
              placeholder="A small joy, a creative spark..."
              className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground/60 text-foreground"
            />
            <div className="flex justify-end">
              <button
                onClick={addJoy}
                className="px-5 py-2 rounded-full bg-gradient-dawn text-indigo-deep text-sm font-medium hover:opacity-90 transition-sacred"
              >
                Capture it
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {joys.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-6">
                Even one tiny spark counts.
              </p>
            )}
            {joys.map((j, i) => (
              <div
                key={i}
                className="rounded-xl bg-background/40 border border-border/40 p-3 text-sm text-foreground/90 animate-fade-up"
              >
                {j}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
