import heroGlow from "@/assets/hero-glow.jpg";
import { Sparkles } from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function HeroOrb({
  step,
  intention,
  userName,
  dayCount,
}: {
  step: number;
  intention: string;
  userName: string;
  dayCount: number;
}) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="relative overflow-hidden rounded-[2rem] glass-elevated">
      <img
        src={heroGlow}
        alt=""
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="relative px-6 md:px-12 py-12 md:py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.2em] text-indigo mb-6">
          <Sparkles className="w-3 h-3" /> {today}
        </div>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-indigo-deep mb-4">
          {getGreeting()},
          <br />
          <span className="text-gradient-dawn italic">{userName}.</span>
        </h1>
        <p className="max-w-xl mx-auto text-foreground/80 text-base md:text-lg">
          {intention}
        </p>
        <div className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-deep/90 text-primary-foreground text-sm">
          <span className="w-2 h-2 rounded-full bg-dawn-glow animate-pulse-glow" />
          Day {dayCount} ·{" "}
          <span className="font-serif italic text-dawn-glow">Step {step}</span>
        </div>
      </div>
    </header>
  );
}
