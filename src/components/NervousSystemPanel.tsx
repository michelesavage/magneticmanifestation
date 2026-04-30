import { useEffect, useRef, useState } from "react";
import { Wind, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "inhale" | "hold" | "exhale" | "rest";
const SEQ: { phase: Phase; seconds: number; label: string }[] = [
  { phase: "inhale", seconds: 4, label: "Breathe in" },
  { phase: "hold", seconds: 7, label: "Hold gently" },
  { phase: "exhale", seconds: 8, label: "Release" },
  { phase: "rest", seconds: 1, label: "Rest" },
];

export function NervousSystemPanel() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(SEQ[0].seconds);
  const [cycles, setCycles] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        setStep((s) => {
          const next = (s + 1) % SEQ.length;
          if (next === 0) setCycles((x) => x + 1);
          setCount(SEQ[next].seconds);
          return next;
        });
        return SEQ[(step + 1) % SEQ.length].seconds;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, step]);

  const reset = () => { setRunning(false); setStep(0); setCount(SEQ[0].seconds); setCycles(0); };
  const current = SEQ[step];

  const scale =
    current.phase === "inhale" ? "scale-110" :
    current.phase === "hold" ? "scale-110" :
    current.phase === "exhale" ? "scale-90" : "scale-100";

  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-sage text-sm mb-2">
            <Wind className="w-4 h-4" /> Regulate
          </div>
          <h2 className="font-serif text-3xl">Calm baseline</h2>
          <p className="text-sm text-muted-foreground mt-1">4-7-8 breath. Widen your capacity to receive.</p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p className="font-serif text-2xl text-indigo">{cycles}</p>
          <p>cycles today</p>
        </div>
      </div>

      <div className="flex flex-col items-center py-6">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div className={cn("absolute inset-0 rounded-full bg-gradient-dawn opacity-30 blur-2xl transition-all duration-[4000ms]", scale)} />
          <div className={cn("absolute inset-4 rounded-full bg-gradient-to-br from-dawn-glow via-rose to-lavender transition-all duration-[4000ms] ease-in-out", scale)} />
          <div className="relative z-10 text-center text-indigo-deep">
            <p className="font-serif text-5xl">{count}</p>
            <p className="text-sm mt-1 font-medium tracking-wide uppercase">{current.label}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setRunning((r) => !r)}
            className="px-6 py-3 rounded-full bg-indigo text-primary-foreground hover:bg-indigo-deep transition-sacred shadow-soft inline-flex items-center gap-2"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? "Pause" : "Begin"}
          </button>
          <button onClick={reset} className="px-4 py-3 rounded-full glass hover:bg-muted transition-sacred">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
