import { useEffect, useMemo, useState } from "react";
import { Sparkles, Smile, Shield, PartyPopper, Check, Lightbulb, Flame, Target, Minus, Plus } from "lucide-react";

type TabId = "rituals" | "checkin" | "boundaries" | "joy";

const tabs = [
  { id: "rituals" as const, label: "Rituals", icon: Sparkles, tint: "from-dawn to-dawn-glow", unit: "rituals" },
  { id: "checkin" as const, label: "Check-in", icon: Smile, tint: "from-rose to-lavender", unit: "check-ins" },
  { id: "boundaries" as const, label: "Rest", icon: Shield, tint: "from-sage to-dawn", unit: "boundaries" },
  { id: "joy" as const, label: "Joy", icon: PartyPopper, tint: "from-lavender to-rose", unit: "joys" },
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

const STORAGE_KEY = "self-care-state-v2";

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayKey = () => dayKey(new Date());

const last7Days = () => {
  const arr: string[] = [];
  const d = new Date();
  for (let i = 6; i >= 0; i--) {
    const t = new Date(d);
    t.setDate(d.getDate() - i);
    arr.push(dayKey(t));
  }
  return arr;
};

const computeStreak = (history: Record<string, number>, goal: number) => {
  let streak = 0;
  const cur = new Date();
  if ((history[dayKey(cur)] ?? 0) < goal) cur.setDate(cur.getDate() - 1);
  while ((history[dayKey(cur)] ?? 0) >= goal) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
};

type Note = { text: string; date: string };

type State = {
  rituals: Record<string, boolean>;
  boundaries: Record<string, boolean>;
  mood: number;
  energy: number;
  joys: Note[];
  ritualNotes: Note[];
  checkinNotes: Note[];
  boundaryNotes: Note[];
  history: Record<TabId, Record<string, number>>;
  goals: Record<TabId, number>;
  lastResetDay: string;
};

const defaultGoals: Record<TabId, number> = {
  rituals: 3,
  checkin: 1,
  boundaries: 2,
  joy: 1,
};

const goalCaps: Record<TabId, number> = {
  rituals: defaultRituals.length,
  checkin: 3,
  boundaries: defaultBoundaries.length,
  joy: 5,
};

const initialState: State = {
  rituals: {},
  boundaries: {},
  mood: 2,
  energy: 2,
  joys: [],
  ritualNotes: [],
  checkinNotes: [],
  boundaryNotes: [],
  history: { rituals: {}, checkin: {}, boundaries: {}, joy: {} },
  goals: { ...defaultGoals },
  lastResetDay: todayKey(),
};

const loadState = (): State => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const obj = JSON.parse(raw);
    const parsed: State = {
      ...initialState,
      ...obj,
      history: { ...initialState.history, ...(obj.history || {}) },
      goals: { ...initialState.goals, ...(obj.goals || {}) },
    };
    if (parsed.lastResetDay !== todayKey()) {
      parsed.rituals = {};
      parsed.boundaries = {};
      parsed.lastResetDay = todayKey();
    }
    return parsed;
  } catch {
    return initialState;
  }
};

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

function GoalCard({
  label,
  unit,
  goal,
  cap,
  history,
  onGoalChange,
}: {
  label: string;
  unit: string;
  goal: number;
  cap: number;
  history: Record<string, number>;
  onGoalChange: (n: number) => void;
}) {
  const week = last7Days();
  const today = todayKey();
  const todayCount = history[today] ?? 0;
  const streak = computeStreak(history, goal);
  const hitDays = week.filter((d) => (history[d] ?? 0) >= goal).length;
  const pct = Math.min(100, Math.round((todayCount / Math.max(goal, 1)) * 100));
  const maxBar = Math.max(goal, ...week.map((d) => history[d] ?? 0), 1);

  return (
    <div className="rounded-2xl bg-background/40 border border-border/50 p-4 mb-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-dawn to-rose flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-indigo-deep" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground leading-none">{label} goal</p>
            <p className="font-serif text-lg leading-tight">
              {goal} {unit} / day
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onGoalChange(Math.max(1, goal - 1))}
            disabled={goal <= 1}
            className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center text-foreground/80 hover:bg-background/60 disabled:opacity-30 transition-sacred"
            aria-label="Lower goal"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-serif text-base w-6 text-center">{goal}</span>
          <button
            onClick={() => onGoalChange(Math.min(cap, goal + 1))}
            disabled={goal >= cap}
            className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center text-foreground/80 hover:bg-background/60 disabled:opacity-30 transition-sacred"
            aria-label="Raise goal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-xs text-muted-foreground">Today</span>
          <span className="text-xs text-foreground/80 font-medium">
            {todayCount} / {goal}
          </span>
        </div>
        <div className="h-2 rounded-full bg-background/60 overflow-hidden">
          <div
            className="h-full bg-gradient-dawn transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs text-muted-foreground">Last 7 days</span>
          <span className="text-[11px] text-muted-foreground/80 inline-flex items-center gap-1">
            {hitDays}/7 hit · <Flame className="w-3 h-3" />
            {streak}d
          </span>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-20">
          {week.map((d) => {
            const count = history[d] ?? 0;
            const hit = count >= goal;
            const h = Math.max(6, Math.round((count / maxBar) * 72));
            const isToday = d === today;
            return (
              <div key={d} className="flex flex-col items-center gap-1 flex-1">
                <div className="flex-1 w-full flex items-end justify-center">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      hit
                        ? "bg-gradient-dawn shadow-soft"
                        : count > 0
                          ? "bg-foreground/20"
                          : "bg-background/60 border border-border/40"
                    } ${isToday ? "ring-1 ring-dawn/60" : ""}`}
                    style={{ height: `${h}px` }}
                    title={`${count} on ${d}`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground/70">
                  {new Date(d).toLocaleDateString(undefined, { weekday: "narrow" })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SelfCarePanel() {
  const [active, setActive] = useState<TabId>("rituals");
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  const [joyDraft, setJoyDraft] = useState("");
  const [ritualNote, setRitualNote] = useState("");
  const [checkinNote, setCheckinNote] = useState("");
  const [boundaryNote, setBoundaryNote] = useState("");

  const [checkinTouchedToday, setCheckinTouchedToday] = useState({ mood: false, energy: false });

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const incrementHistory = (tab: TabId, delta = 1) => {
    setState((s) => {
      const today = todayKey();
      const cur = s.history[tab][today] ?? 0;
      return {
        ...s,
        history: { ...s.history, [tab]: { ...s.history[tab], [today]: Math.max(0, cur + delta) } },
      };
    });
  };

  const setGoal = (tab: TabId, n: number) =>
    setState((s) => ({ ...s, goals: { ...s.goals, [tab]: n } }));

  const toggleRitual = (key: string) => {
    setState((s) => {
      const next = { ...s.rituals, [key]: !s.rituals[key] };
      const count = Object.values(next).filter(Boolean).length;
      return {
        ...s,
        rituals: next,
        history: { ...s.history, rituals: { ...s.history.rituals, [todayKey()]: count } },
      };
    });
  };

  const toggleBoundary = (key: string) => {
    setState((s) => {
      const next = { ...s.boundaries, [key]: !s.boundaries[key] };
      const count = Object.values(next).filter(Boolean).length;
      return {
        ...s,
        boundaries: next,
        history: { ...s.history, boundaries: { ...s.history.boundaries, [todayKey()]: count } },
      };
    });
  };

  const handleMood = (i: number) => {
    setState((s) => ({ ...s, mood: i }));
    if (!checkinTouchedToday.mood) {
      incrementHistory("checkin", 1);
      setCheckinTouchedToday((t) => ({ ...t, mood: true }));
    }
  };
  const handleEnergy = (i: number) => {
    setState((s) => ({ ...s, energy: i }));
    if (!checkinTouchedToday.energy) {
      incrementHistory("checkin", 1);
      setCheckinTouchedToday((t) => ({ ...t, energy: true }));
    }
  };

  const addJoy = () => {
    if (!joyDraft.trim()) return;
    setState((s) => ({ ...s, joys: [{ text: joyDraft.trim(), date: todayKey() }, ...s.joys] }));
    setJoyDraft("");
    incrementHistory("joy", 1);
  };

  const addRitualNote = () => {
    if (!ritualNote.trim()) return;
    setState((s) => ({ ...s, ritualNotes: [{ text: ritualNote.trim(), date: todayKey() }, ...s.ritualNotes] }));
    setRitualNote("");
  };

  const addCheckinNote = () => {
    if (!checkinNote.trim()) return;
    setState((s) => ({ ...s, checkinNotes: [{ text: checkinNote.trim(), date: todayKey() }, ...s.checkinNotes] }));
    setCheckinNote("");
    incrementHistory("checkin", 1);
  };

  const addBoundaryNote = () => {
    if (!boundaryNote.trim()) return;
    setState((s) => ({ ...s, boundaryNotes: [{ text: boundaryNote.trim(), date: todayKey() }, ...s.boundaryNotes] }));
    setBoundaryNote("");
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  const tabMeta = useMemo(
    () => Object.fromEntries(tabs.map((t) => [t.id, t])) as Record<TabId, typeof tabs[number]>,
    [],
  );

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
          const streak = computeStreak(state.history[t.id], state.goals[t.id]);
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
              {streak > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5 ${
                    isActive ? "bg-indigo-deep/15 text-indigo-deep" : "bg-dawn/20 text-foreground/80"
                  }`}
                >
                  <Flame className="w-2.5 h-2.5" />
                  {streak}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active === "rituals" && (
        <div>
          <GoalCard
            label="Rituals"
            unit={tabMeta.rituals.unit}
            goal={state.goals.rituals}
            cap={goalCaps.rituals}
            history={state.history.rituals}
            onGoalChange={(n) => setGoal("rituals", n)}
          />
          <PromptCard prompts={ritualPrompts} tint="dawn" />
          <div className="space-y-2">
            {defaultRituals.map((r) => {
              const on = !!state.rituals[r];
              return (
                <button
                  key={r}
                  onClick={() => toggleRitual(r)}
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
          {state.ritualNotes.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mt-3">
              {state.ritualNotes.map((n, i) => (
                <div key={i} className="rounded-xl bg-background/40 border border-border/40 p-3 text-sm text-foreground/90 animate-fade-up">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{fmtDate(n.date)}</p>
                  {n.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {active === "checkin" && (
        <div className="space-y-6">
          <GoalCard
            label="Check-in"
            unit={tabMeta.checkin.unit}
            goal={state.goals.checkin}
            cap={goalCaps.checkin}
            history={state.history.checkin}
            onGoalChange={(n) => setGoal("checkin", n)}
          />
          <PromptCard prompts={checkinPrompts} tint="rose" />
          <div className="rounded-2xl bg-background/50 p-4 border border-border/60">
            <p className="font-serif italic text-indigo mb-3">How does your inner weather feel?</p>
            <div className="flex justify-between items-center mb-3 text-2xl">
              {moods.map((m, i) => (
                <button
                  key={i}
                  onClick={() => handleMood(i)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-sacred ${
                    state.mood === i ? "bg-gradient-dawn shadow-soft scale-110" : "opacity-50 hover:opacity-100"
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
                  onClick={() => handleEnergy(i)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-sacred ${
                    state.energy === i ? "bg-gradient-dawn shadow-soft scale-110" : "opacity-50 hover:opacity-100"
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
            <div className="flex justify-end">
              <button
                onClick={addCheckinNote}
                className="px-5 py-2 rounded-full bg-gradient-dawn text-indigo-deep text-sm font-medium hover:opacity-90 transition-sacred"
              >
                Save check-in
              </button>
            </div>
          </div>
          {state.checkinNotes.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {state.checkinNotes.map((n, i) => (
                <div key={i} className="rounded-xl bg-background/40 border border-border/40 p-3 text-sm text-foreground/90 animate-fade-up">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{fmtDate(n.date)}</p>
                  {n.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {active === "boundaries" && (
        <div>
          <GoalCard
            label="Rest"
            unit={tabMeta.boundaries.unit}
            goal={state.goals.boundaries}
            cap={goalCaps.boundaries}
            history={state.history.boundaries}
            onGoalChange={(n) => setGoal("boundaries", n)}
          />
          <PromptCard prompts={boundaryPrompts} tint="sage" />
          <div className="space-y-2">
            {defaultBoundaries.map((b) => {
              const on = !!state.boundaries[b];
              return (
                <button
                  key={b}
                  onClick={() => toggleBoundary(b)}
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
          {state.boundaryNotes.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mt-3">
              {state.boundaryNotes.map((n, i) => (
                <div key={i} className="rounded-xl bg-background/40 border border-border/40 p-3 text-sm text-foreground/90 animate-fade-up">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{fmtDate(n.date)}</p>
                  {n.text}
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
          <GoalCard
            label="Joy"
            unit={tabMeta.joy.unit}
            goal={state.goals.joy}
            cap={goalCaps.joy}
            history={state.history.joy}
            onGoalChange={(n) => setGoal("joy", n)}
          />
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
            {state.joys.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-6">
                Even one tiny spark counts.
              </p>
            )}
            {state.joys.map((j, i) => (
              <div
                key={i}
                className="rounded-xl bg-background/40 border border-border/40 p-3 text-sm text-foreground/90 animate-fade-up"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{fmtDate(j.date)}</p>
                {j.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
