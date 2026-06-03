import { useState } from "react";
import { ArrowRight, Check, ChevronRight, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

const STEPS = [
  {
    n: 1,
    title: "Surrender to the unseen",
    body: "We admit we have become powerless to the hidden beliefs and blocks running the show.",
  },
  {
    n: 2,
    title: "Trust a greater field",
    body: "Came to believe a power greater than our conditioning could restore us to regulation, alignment, and faith.",
  },
  {
    n: 3,
    title: "Hand over the reins",
    body: "Made a decision to turn our will and our lives over to the care of God, as we understood Him.",
  },
  {
    n: 4,
    title: "Fearless inventory",
    body: "Made a searching, fearless inventory of our words, thoughts, and feelings — uncovering the fears and limiting beliefs blocking our manifestations.",
  },
  {
    n: 5,
    title: "Spoken into the light",
    body: "Admitted to God, to ourselves, and to another human the exact nature of the fears, limiting beliefs, and protective patterns blocking us.",
  },
  {
    n: 6,
    title: "Ready to release",
    body: "Were entirely ready to have God remove all these subconscious blocks to our abundance.",
  },
  {
    n: 7,
    title: "Humbly ask",
    body: "Humbly asked God to remove the fears, limiting beliefs, and protective patterns blocking our magnetism and capacity to receive.",
  },
  {
    n: 8,
    title: "List of amends",
    body: "Made a list of the people, patterns, and parts of ourselves harmed by our unconscious identity, and became willing to make aligned amends.",
  },
  {
    n: 9,
    title: "Aligned amends",
    body: "Made direct amends through changed behavior and regulated responses — except when doing so would create further harm.",
  },
  {
    n: 10,
    title: "Daily recalibration",
    body: "Continued to inventory thoughts, words, emotions, and nervous-system responses, and promptly recalibrated when out of alignment.",
  },
  {
    n: 11,
    title: "Conscious contact",
    body: "Sought through prayer, meditation, and regulation to deepen conscious alignment with God, asking only for guidance and the power to embody our highest identity.",
  },
  {
    n: 12,
    title: "Embody & uplift",
    body: "Having experienced an identity shift, we embodied the work daily and supported others in expanding their capacity to receive.",
  },
];

export function StepsJourney() {
  const { user, advanceStep, updateStepNotes } = useUser();
  const currentStep = user?.currentStep ?? 1;

  const [open, setOpen] = useState<number | null>(currentStep);
  const [confirmAdvance, setConfirmAdvance] = useState(false);
  const [notesDraft, setNotesDraft] = useState<Record<number, string>>({});

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleAdvance = () => {
    if (confirmAdvance) {
      advanceStep();
      setConfirmAdvance(false);
      setOpen(currentStep + 1);
    } else {
      setConfirmAdvance(true);
    }
  };

  const handleSaveNotes = (stepNum: number) => {
    const draft = notesDraft[stepNum];
    if (draft !== undefined) {
      updateStepNotes(stepNum, draft);
    }
  };

  const getNotes = (stepNum: number): string => {
    if (notesDraft[stepNum] !== undefined) return notesDraft[stepNum];
    return user?.stepProgress?.[stepNum]?.notes ?? "";
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            The Blueprint
          </p>
          <h2 className="font-serif text-3xl">
            12 Steps of Magnetic Manifestation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            A sacred path from blocked to magnetic.
          </p>
        </div>
        <div className="text-right">
          <p className="font-serif text-4xl text-gradient-dawn">{currentStep}</p>
          <p className="text-xs text-muted-foreground">current step</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-dawn-glow via-rose to-lavender opacity-50" />
        <div className="space-y-2">
          {STEPS.map((s) => {
            const done = s.n < currentStep;
            const active = s.n === currentStep;
            const locked = s.n > currentStep;
            const isOpen = open === s.n;
            const progress = user?.stepProgress?.[s.n];

            return (
              <div key={s.n}>
                <button
                  onClick={() => setOpen(isOpen ? null : s.n)}
                  className={cn(
                    "w-full text-left flex gap-4 items-start p-3 rounded-2xl transition-sacred",
                    active && "bg-gradient-to-r from-dawn/30 to-transparent",
                    isOpen && !active && "bg-muted/40",
                    "hover:bg-muted/30"
                  )}
                >
                  <div
                    className={cn(
                      "relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-serif text-sm",
                      done && "bg-sage text-indigo-deep",
                      active &&
                        "bg-gradient-dawn text-indigo-deep shadow-glow animate-pulse-glow",
                      locked && "bg-muted text-muted-foreground"
                    )}
                  >
                    {done ? (
                      <Check className="w-4 h-4" />
                    ) : locked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      s.n
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "font-serif text-lg leading-tight",
                          locked && "text-muted-foreground"
                        )}
                      >
                        {s.title}
                      </p>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-muted-foreground transition-sacred flex-shrink-0",
                          isOpen && "rotate-90"
                        )}
                      />
                    </div>
                    {progress?.startedAt && !locked && (
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                        Started {fmtDate(progress.startedAt)}
                        {progress.completedAt &&
                          ` · Completed ${fmtDate(progress.completedAt)}`}
                      </p>
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="ml-14 mr-3 mb-3 space-y-3 animate-fade-up">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {s.body}
                    </p>

                    {/* Reflection notes — available for all unlocked steps */}
                    {!locked && (
                      <div className="rounded-2xl bg-background/50 border border-border/60 p-4">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                          My reflections on this step
                        </p>
                        <textarea
                          value={getNotes(s.n)}
                          onChange={(e) =>
                            setNotesDraft((d) => ({
                              ...d,
                              [s.n]: e.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="What is this step revealing to you?..."
                          className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground/50 text-foreground text-sm"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleSaveNotes(s.n)}
                            className="px-4 py-1.5 rounded-full bg-gradient-dawn text-indigo-deep text-xs font-medium hover:opacity-90 transition-sacred"
                          >
                            Save reflection
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Advance button — only on current step, not step 12 */}
                    {active && currentStep < 12 && (
                      <div className="pt-1">
                        {confirmAdvance ? (
                          <div className="rounded-2xl border border-dawn/40 bg-dawn/10 p-4 space-y-3">
                            <p className="font-serif text-sm text-indigo-deep">
                              Are you ready to move to Step {currentStep + 1}?
                              This is a sacred choice — take it only when you
                              feel truly complete with this step.
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={handleAdvance}
                                className="flex-1 px-4 py-2.5 rounded-full bg-gradient-dawn text-indigo-deep text-sm font-medium hover:opacity-90 transition-sacred inline-flex items-center justify-center gap-2"
                              >
                                <Sparkles className="w-3.5 h-3.5" /> Yes, I'm
                                ready
                              </button>
                              <button
                                onClick={() => setConfirmAdvance(false)}
                                className="px-4 py-2.5 rounded-full glass text-sm hover:bg-muted transition-sacred"
                              >
                                Not yet
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={handleAdvance}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-dawn/40 hover:bg-dawn/10 transition-sacred text-sm font-medium text-indigo-deep group"
                          >
                            I'm ready for Step {currentStep + 1}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-sacred" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Completion message for step 12 */}
                    {active && currentStep === 12 && (
                      <div className="rounded-2xl bg-gradient-dawn/20 border border-dawn/30 p-4 text-center">
                        <p className="font-serif italic text-indigo-deep">
                          You have walked all 12 steps. Continue embodying this
                          work daily — the path never ends, it only deepens.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
