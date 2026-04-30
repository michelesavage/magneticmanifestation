import { useState } from "react";
import { Droplets, Apple, Pill, Moon, Sun, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Habit = {
  id: string;
  name: string;
  icon: typeof Droplets;
  current: number;
  goal: number;
  unit: string;
  tint: string;
};

const initial: Habit[] = [
  { id: "water", name: "Water", icon: Droplets, current: 4, goal: 8, unit: "glasses", tint: "from-sky-300/70 to-lavender" },
  { id: "nutrition", name: "Whole Foods", icon: Apple, current: 2, goal: 3, unit: "meals", tint: "from-sage to-dawn-glow/60" },
  { id: "vitamins", name: "Vitamins", icon: Pill, current: 1, goal: 1, unit: "stack", tint: "from-rose to-dawn" },
  { id: "sleep", name: "Sleep", icon: Moon, current: 7, goal: 8, unit: "hours", tint: "from-indigo/80 to-lavender" },
  { id: "sunlight", name: "Sunlight", icon: Sun, current: 10, goal: 20, unit: "minutes", tint: "from-dawn-glow to-dawn" },
];

export function HabitsRing() {
  const [habits, setHabits] = useState(initial);

  const adjust = (id: string, delta: number) =>
    setHabits((h) =>
      h.map((x) => (x.id === id ? { ...x, current: Math.max(0, Math.min(x.goal * 1.5, x.current + delta)) } : x))
    );

  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-3xl text-foreground">Vessel</h2>
          <p className="text-sm text-muted-foreground mt-1">Tend the body that holds your manifestation.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {habits.map((h) => {
          const pct = Math.min(100, (h.current / h.goal) * 100);
          const Icon = h.icon;
          return (
            <div key={h.id} className="group flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-3">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeWidth="6" fill="none" opacity="0.4" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round"
                    stroke="url(#g-${h.id})"
                    strokeDasharray={`${(pct / 100) * 264} 264`}
                    className="transition-sacred"
                  />
                  <defs>
                    <linearGradient id={`g-${h.id}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--dawn-glow))" />
                      <stop offset="100%" stopColor="hsl(var(--rose))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className={cn("absolute inset-2 rounded-full bg-gradient-to-br flex items-center justify-center", h.tint)}>
                  <Icon className="w-7 h-7 text-indigo-deep" strokeWidth={1.5} />
                </div>
              </div>
              <p className="font-serif text-lg leading-tight">{h.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{h.current} / {h.goal} {h.unit}</p>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-sacred">
                <button onClick={() => adjust(h.id, -1)} className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-rose/30">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => adjust(h.id, 1)} className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-dawn/40">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
