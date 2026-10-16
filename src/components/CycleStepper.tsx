import React from 'react';
import { Cycle, CYCLE_ORDER } from '@/types/cycle';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const CYCLE_LABELS: Record<Cycle, string> = {
  [Cycle.CONCEPT_INPUT]: '개념 학습',
  [Cycle.GUIDED_DRILL]: '반복 훈련',
  [Cycle.IMMEDIATE_TEST]: '즉각 테스트',
  [Cycle.ERROR_CORRECTION]: '오답노트',
  [Cycle.WORD_VAULT]: '어휘 20',
  [Cycle.CONTEXT_MEMORIZATION]: '외우기',
  [Cycle.VOCAB_TEST]: '어휘 테스트',
};

export interface CycleStepperProps {
  currentCycle: Cycle;
}

export function CycleStepper({ currentCycle }: CycleStepperProps) {
  const currentIndex = CYCLE_ORDER.indexOf(currentCycle);

  return (
    <div className="w-full py-6 px-4 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0" />

          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${(currentIndex / (CYCLE_ORDER.length - 1)) * 100}%` }}
          />

          {CYCLE_ORDER.map((cycle, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;

            return (
              <div key={cycle} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4",
                  isCompleted && "bg-blue-600 border-blue-600 text-white",
                  isCurrent && "bg-white border-blue-600 text-blue-600 shadow-md scale-110",
                  isUpcoming && "bg-white border-slate-200 text-slate-400"
                )}>
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span className={cn(
                  "text-xs font-medium whitespace-nowrap absolute -bottom-6",
                  isCurrent ? "text-blue-700 font-bold" : "text-slate-500"
                )}>
                  {CYCLE_LABELS[cycle]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
