import { createContext, useContext, useEffect, useState, ReactNode } from "react";
 
export interface StepProgress {
  startedAt: string;
  completedAt?: string;
  notes?: string;
}
 
export interface UserProfile {
  id: string;
  name: string;
  intention: string;
  startedAt: string;
  currentStep: number;
  stepProgress: Record<number, StepProgress>;
}
 
interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  createUser: (name: string, intention: string) => void;
  logout: () => void;
  advanceStep: () => void;
  setCurrentStep: (step: number) => void;
  updateStepNotes: (step: number, notes: string) => void;
  dayCount: number;
  storageKey: (suffix: string) => string;
}
 
const STORAGE_KEY = "magnetic-user-v1";
 
const UserContext = createContext<UserContextType | null>(null);
 
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);
 
  const save = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };
 
  const createUser = (name: string, intention: string) => {
    const now = new Date().toISOString();
    const u: UserProfile = {
      id: crypto.randomUUID(),
      name: name.trim() || "Beautiful One",
      intention:
        intention.trim() ||
        "A daily ritual to regulate my body, rewire my mind, and walk the 12 Steps of Magnetic Manifestation.",
      startedAt: now,
      currentStep: 1,
      stepProgress: {
        1: { startedAt: now },
      },
    };
    save(u);
  };
 
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };
 
  const advanceStep = () => {
    if (!user || user.currentStep >= 12) return;
    const now = new Date().toISOString();
    const nextStep = user.currentStep + 1;
    const updated: UserProfile = {
      ...user,
      currentStep: nextStep,
      stepProgress: {
        ...user.stepProgress,
        [user.currentStep]: {
          ...user.stepProgress[user.currentStep],
          completedAt: now,
        },
        [nextStep]: user.stepProgress[nextStep] || { startedAt: now },
      },
    };
    save(updated);
  };
 
  const setCurrentStep = (step: number) => {
    if (!user || step < 1 || step > 12) return;
    const now = new Date().toISOString();
    const updated: UserProfile = {
      ...user,
      currentStep: step,
      stepProgress: {
        ...user.stepProgress,
        [step]: user.stepProgress[step] || { startedAt: now },
      },
    };
    save(updated);
  };
 
  const updateStepNotes = (step: number, notes: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      stepProgress: {
        ...user.stepProgress,
        [step]: {
          ...(user.stepProgress[step] || { startedAt: new Date().toISOString() }),
          notes,
        },
      },
    };
    save(updated);
  };
 
  const dayCount = user
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(user.startedAt).getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      )
    : 1;
 
  const storageKey = (suffix: string) => `mag-${user?.id ?? "anon"}-${suffix}`;
 
  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        createUser,
        logout,
        advanceStep,
        setCurrentStep,
        updateStepNotes,
        dayCount,
        storageKey,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
 
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
