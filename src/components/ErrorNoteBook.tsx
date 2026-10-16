'use client';

import React, { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { BookMarked, Clock } from 'lucide-react';

export function ErrorNoteBook() {
  const { errorHistory } = useAppStore();

  const groupedErrors = useMemo(() => {
    return errorHistory.reduce((acc, record) => {
      if (!acc[record.stepId]) {
        acc[record.stepId] = {};
      }
      if (!acc[record.stepId][record.misconceptionType]) {
        acc[record.stepId][record.misconceptionType] = [];
      }
      acc[record.stepId][record.misconceptionType].push(record);
      return acc;
    }, {} as Record<number, Record<string, typeof errorHistory>>);
  }, [errorHistory]);

  const sortedStepIds = Object.keys(groupedErrors).map(Number).sort((a, b) => b - a);

  if (errorHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <BookMarked className="w-16 h-16 mb-4 text-slate-300" />
        <h2 className="text-xl font-bold mb-2 text-slate-600">아직 오답 기록이 없습니다</h2>
        <p>학습을 진행하며 틀린 문제들이 이곳에 누적됩니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full py-8 px-4">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-rose-100 p-3 rounded-xl text-rose-600">
          <BookMarked className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">오답노트</h1>
          <p className="text-slate-500">실수했던 표현들을 다시 확인하고 완벽하게 내 것으로 만드세요.</p>
        </div>
      </div>

      <div className="space-y-12">
        {sortedStepIds.map((stepId) => (
          <section key={stepId} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-800">스텝 {stepId} 복습</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {Object.entries(groupedErrors[stepId]).map(([misconception, errors]) => (
                <div key={misconception} className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2 border-l-4 border-rose-400 pl-3">
                    {misconception}
                  </h3>
                  <div className="space-y-8">
                    {errors.map((error) => (
                      <div key={error.id} className="hover:bg-slate-50/50 transition-colors bg-white rounded-2xl p-6 border border-slate-100">
                        <div className="flex flex-col md:flex-row gap-8">
                          {/* Left: QA */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(error.timestamp).toLocaleDateString()}</span>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">질문 / 상황</h4>
                              <p className="text-slate-800 font-medium text-lg leading-relaxed">{error.question}</p>
                            </div>

                            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 relative mt-6">
                              <span className="absolute -top-3 left-4 bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded">나의 답변</span>
                              <p className="text-rose-900 mt-2 line-through decoration-rose-300">{error.userAnswer}</p>
                            </div>
                          </div>

                          {/* Right: Feedback */}
                          <div className="flex-1 bg-slate-900 rounded-2xl p-6 text-slate-300 flex flex-col gap-6">
                            <div>
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI 교정 분석</h4>
                              <p className="text-white leading-relaxed">{error.nuanceBreakdownKorean}</p>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-3">올바른 표현</h4>
                              <ul className="space-y-3">
                                {error.betterAlternatives.map((alt, idx) => (
                                  <li key={idx} className="flex items-start gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                                    <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                                    <span className="text-emerald-50 font-medium">{alt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
