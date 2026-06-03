import { Quote } from "lucide-react";

const AFFIRMATIONS = [
  "I am safe to receive. My nervous system is wide enough to hold all that is meant for me.",
  "I am the woman who already has what she desires. She is not waiting. She is here.",
  "My body knows how to receive. I soften, I open, I allow.",
  "I surrender what I cannot control and claim what is already mine in the unseen.",
  "I am not behind. I am arriving exactly on time.",
  "The version of me who has it all already exists. I am simply becoming her.",
  "My desires are not too much. They are a map to who I am becoming.",
  "I trust the field. I trust the timing. I trust myself.",
  "What is meant for me is drawn to my frequency, not my force.",
  "I release the grip and open my hands. Abundance flows to open palms.",
  "My nervous system is calm. From calm, I create. From calm, I receive.",
  "I am worthy of receiving without earning, proving, or performing.",
  "Today, I choose alignment over effort. Presence over pushing.",
  "The universe is always conspiring in my favor. I only need to stay open.",
  "I honor the version of me who is still becoming. She is doing beautifully.",
  "I am magnetic because I am regulated, aligned, and true to myself.",
  "My boundaries are an act of love — for myself and everyone I touch.",
  "I release the blocks that are no longer mine to carry. I am free to receive.",
  "Every day I choose this path, I deepen my capacity for miracles.",
  "I am not manifesting from lack. I am creating from wholeness.",
  "My worth is not negotiable. It is innate, infinite, and untouchable.",
  "I breathe in possibility. I breathe out fear. I am here.",
  "The work I do on myself ripples out to everyone I love.",
  "I trust that what I cannot yet see is being arranged on my behalf.",
  "I am not just seeking. I am also the answer someone else is seeking.",
  "Receiving is not selfish. My overflow is my service.",
  "I am becoming the most magnetic version of myself — one regulated breath at a time.",
  "I do not need to understand the path. I only need to stay on it.",
];

export function DailyAffirmation({ dayCount }: { dayCount: number }) {
  const affirmation = AFFIRMATIONS[(dayCount - 1) % AFFIRMATIONS.length];

  return (
    <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-twilight text-primary-foreground animate-fade-up">
      <div className="absolute -top-10 -right-10 w-40 h-40 glow-orb animate-float" />
      <Quote className="w-6 h-6 mb-4 opacity-70" />
      <p className="font-serif text-2xl md:text-3xl leading-snug italic">
        {affirmation}
      </p>
      <p className="text-sm mt-6 opacity-80">— day {dayCount} anchor</p>
    </div>
  );
}
