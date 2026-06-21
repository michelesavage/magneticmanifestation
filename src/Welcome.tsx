import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Sparkles, ArrowRight, Heart } from "lucide-react";
import heroGlow from "@/assets/hero-glow.jpg";
 
type Screen = "splash" | "name" | "intention" | "begin";
 
export default function Welcome() {
  const { createUser } = useUser();
  const [screen, setScreen] = useState<Screen>("splash");
  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");
 
  const handleBegin = () => {
    createUser(name, intention);
  };
 
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <img
        src={heroGlow}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
 
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 text-center">
 
        {screen === "splash" && (
          <div className="animate-fade-up space-y-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.2em] text-indigo">
                <Sparkles className="w-3 h-3" /> Magnetic Manifestation
              </div>
              <h1 className="font-serif text-6xl md:text-7xl leading-[1.05] text-indigo-deep mt-6">
                Become the woman
                <br />
                <em className="text-gradient-dawn">already living it.</em>
              </h1>
            </div>
            <p className="text-foreground/70 text-lg leading-relaxed max-w-sm mx-auto">
              A sacred 12-step path to regulate your body, rewire your mind,
              and align with everything you're meant to receive.
            </p>
            <button
              onClick={() => setScreen("name")}
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-indigo-deep text-primary-foreground text-base font-medium shadow-elevated hover:opacity-90 transition-sacred"
            >
              Begin my path <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
 
        {screen === "name" && (
          <div className="animate-fade-up space-y-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                1 of 3
              </p>
              <h2 className="font-serif text-5xl text-indigo-deep">
                What shall I call you?
              </h2>
              <p className="text-foreground/60 mt-3">
                This path is yours. Let's make it personal.
              </p>
            </div>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && name.trim() && setScreen("intention")
              }
              placeholder="Your name..."
              className="w-full text-center text-2xl font-serif bg-transparent border-b-2 border-dawn/60 focus:border-dawn-glow outline-none py-4 placeholder:text-foreground/30 text-foreground transition-sacred"
            />
            <button
              onClick={() => setScreen("intention")}
              disabled={!name.trim()}
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-indigo-deep text-primary-foreground text-base font-medium shadow-elevated hover:opacity-90 disabled:opacity-30 transition-sacred"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
 
        {screen === "intention" && (
          <div className="animate-fade-up space-y-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                2 of 3
              </p>
              <h2 className="font-serif text-5xl text-indigo-deep">
                Welcome,{" "}
                <em className="text-gradient-dawn">{name}.</em>
              </h2>
              <p className="text-foreground/60 mt-3">
                What are you calling into your life on this journey?
              </p>
            </div>
            <textarea
              autoFocus
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              rows={3}
              placeholder="I am calling in..."
              className="w-full text-center text-lg font-serif bg-transparent border-b-2 border-dawn/60 focus:border-dawn-glow outline-none py-4 placeholder:text-foreground/30 text-foreground transition-sacred resize-none"
            />
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={() => setScreen("begin")}
                className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-indigo-deep text-primary-foreground text-base font-medium shadow-elevated hover:opacity-90 transition-sacred"
              >
                Set my intention <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setScreen("begin")}
                className="text-sm text-muted-foreground hover:text-foreground transition-sacred"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
 
        {screen === "begin" && (
          <div className="animate-fade-up space-y-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
                3 of 3
              </p>
              <div className="w-20 h-20 rounded-full bg-gradient-dawn mx-auto mb-8 flex items-center justify-center shadow-glow animate-pulse-glow">
                <Heart className="w-8 h-8 text-indigo-deep" />
              </div>
              <h2 className="font-serif text-5xl text-indigo-deep">
                Your path begins
                <br />
                <em className="text-gradient-dawn">at Step 1.</em>
              </h2>
            </div>
            <p className="text-foreground/60 text-lg max-w-xs mx-auto leading-relaxed">
              Every day you return here, you deepen your alignment. You are
              exactly where you need to be.
            </p>
            <button
              onClick={handleBegin}
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gradient-dawn text-indigo-deep text-base font-semibold shadow-elevated hover:opacity-90 transition-sacred"
            >
              Enter my path <Sparkles className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
