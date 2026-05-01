import { HeroOrb } from "@/components/HeroOrb";
import { HabitsRing } from "@/components/HabitsRing";
import { NervousSystemPanel } from "@/components/NervousSystemPanel";
import { MindsetRewire } from "@/components/MindsetRewire";
import { StepsJourney } from "@/components/StepsJourney";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { SelfCarePanel } from "@/components/SelfCarePanel";
import { Moon, Heart } from "lucide-react";

const Index = () => {
  const currentStep = 4;
  const intention =
    "A daily ritual to regulate your body, rewire your mind, and walk the 12 Steps of Magnetic Manifestation.";

  return (
    <main className="min-h-screen">
      <nav className="container max-w-6xl pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-dawn shadow-glow animate-pulse-glow" />
          <span className="font-serif text-xl tracking-wide">Magnetic</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="w-4 h-4" />
          <span>Day 14 of your becoming</span>
          <Moon className="w-4 h-4 ml-2" />
        </div>
      </nav>

      <div className="container max-w-6xl pb-20 space-y-6">
        <HeroOrb step={currentStep} intention={intention} />

        <DailyAffirmation />

        <HabitsRing />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NervousSystemPanel />
          <MindsetRewire />
          <SelfCarePanel />
        </div>

        <StepsJourney currentStep={currentStep} />

        <footer className="text-center pt-8 pb-2">
          <p className="font-serif italic text-muted-foreground">
            "What you seek is also seeking you." — Rumi
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
