import { Quote } from "lucide-react";

export function DailyAffirmation() {
  return (
    <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-twilight text-primary-foreground animate-fade-up">
      <div className="absolute -top-10 -right-10 w-40 h-40 glow-orb animate-float" />
      <Quote className="w-6 h-6 mb-4 opacity-70" />
      <p className="font-serif text-2xl md:text-3xl leading-snug italic">
        I am safe to receive. My nervous system is wide enough to hold all that is meant for me.
      </p>
      <p className="text-sm mt-6 opacity-80">— today's anchor</p>
    </div>
  );
}
