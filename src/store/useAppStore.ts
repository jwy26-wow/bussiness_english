import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState, Cycle, Phase } from '@/types/cycle';

export interface ErrorRecord {
  id: string;
  stepId: number;
  subLessonId: number;
  question: string;
  userAnswer: string;
  nuanceBreakdownKorean: string;
  betterAlternatives: string[];
  misconceptionType: string;
  timestamp: number;
}

interface AppState extends UserState {
  errorHistory: ErrorRecord[];

  // Actions
  advanceCycle: () => void;
  advanceSubLesson: () => void;
  advanceToStepFinalExam: () => void;
  advanceToCumulativeTest: () => void;
  advanceToNextStep: () => void;
  addErrorRecord: (record: Omit<ErrorRecord, 'id' | 'timestamp'>) => void;
  resetProgress: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      stepId: 1,
      subLessonId: 1,
      cycle: Cycle.CONCEPT_INPUT,
      phase: Phase.SUB_LESSON,
      errorHistory: [],

      advanceCycle: () => set((state) => {
        // Find current cycle in the cycle enum
        const cycles = Object.values(Cycle);
        const currentIndex = cycles.indexOf(state.cycle);

        if (currentIndex < cycles.length - 1) {
          return { cycle: cycles[currentIndex + 1] as Cycle };
        }
        return state;
      }),

      advanceSubLesson: () => set((state) => ({
        subLessonId: state.subLessonId + 1,
        cycle: Cycle.CONCEPT_INPUT
      })),

      advanceToStepFinalExam: () => set({
        phase: Phase.STEP_FINAL_EXAM
      }),

      advanceToCumulativeTest: () => set({
        phase: Phase.CUMULATIVE_GATE_TEST
      }),

      advanceToNextStep: () => set((state) => ({
        stepId: state.stepId + 1,
        subLessonId: 1,
        cycle: Cycle.CONCEPT_INPUT,
        phase: Phase.SUB_LESSON
      })),

      addErrorRecord: (record) => set((state) => ({
        errorHistory: [
          {
            ...record,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
          },
          ...state.errorHistory
        ]
      })),

      resetProgress: () => set({
        stepId: 1,
        subLessonId: 1,
        cycle: Cycle.CONCEPT_INPUT,
        phase: Phase.SUB_LESSON,
        errorHistory: []
      })
    }),
    {
      name: 'business-english-storage',
    }
  )
);
