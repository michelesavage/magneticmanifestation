import { HeroOrb } from "@/components/HeroOrb";
import { HabitsRing } from "@/components/HabitsRing";
import { NervousSystemPanel } from "@/components/NervousSystemPanel";
import { MindsetRewire } from "@/components/MindsetRewire";
import { StepsJourney } from "@/components/StepsJourney";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { SelfCarePanel } from "@/components/SelfCarePanel";
import { useUser } from "@/contexts/UserContext";
import { LogOut, Sparkles } from "lucide-react";

const Index = () => {
  const { user, dayCount, logout } = useUser();

  return (
    <main className="min-h-screen">
      <nav className="container max-w-6xl pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-dawn shadow-glow animate-pulse-glow" />
          <span className="font-serif text-xl tracking-wide">Magnetic</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-dawn-glow" />
          <span className="font-serif italic">
            Day {dayCount} of your becoming
          </span>
          <button
            onClick={logout}
            title="Sign out"
            className="ml-1 p-1.5 rounded-full hover:bg-muted transition-sacred"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <div className="container max-w-6xl pb-20 space-y-6">
        <HeroOrb
          step={user?.currentStep ?? 1}
          intention={user?.intention ?? ""}
          userName={user?.name ?? ""}
          dayCount={dayCount}
        />

        <DailyAffirmation dayCount={dayCount} />

        <HabitsRing />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NervousSystemPanel />
          <MindsetRewire />
          <SelfCarePanel />
        </div>

        <StepsJourney />

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
