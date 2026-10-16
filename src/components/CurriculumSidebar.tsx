import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CurriculumSidebarProps {
  currentStepId: number;
  totalSteps: number;
  steps: { id: number; title: string }[];
}

export function CurriculumSidebar({ currentStepId, totalSteps, steps }: CurriculumSidebarProps) {
  const progressPercentage = Math.round((currentStepId / totalSteps) * 100);

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">커리큘럼</h2>
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>전체 진행률</span>
          <span className="font-semibold">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {steps.map((step) => {
          const isCompleted = step.id < currentStepId;
          const isCurrent = step.id === currentStepId;
          const isLocked = step.id > currentStepId;

          return (
            <button
              key={step.id}
              disabled={isLocked}
              className={cn(
                "w-full px-6 py-3 flex items-center gap-3 text-left transition-colors",
                isCurrent && "bg-blue-50 border-r-4 border-blue-600",
                !isCurrent && !isLocked && "hover:bg-slate-100",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2",
                isCompleted && "bg-blue-600 border-blue-600 text-white",
                isCurrent && "border-blue-600 text-blue-600",
                isLocked && "border-slate-300 text-slate-400 bg-slate-100"
              )}>
                {isLocked ? <Lock className="w-4 h-4" /> : isCompleted ? <Unlock className="w-4 h-4" /> : <span className="text-sm font-bold">{step.id}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  isCurrent ? "text-blue-900" : "text-slate-700"
                )}>
                  스텝 {step.id}
                </p>
                <p className="text-xs text-slate-500 truncate">{step.title}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
