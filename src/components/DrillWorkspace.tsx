'use client';

import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GradeResponseResponse } from '@/types/gemini';

export interface DrillWorkspaceProps {
  question: string;
  onSubmit: (answer: string) => Promise<GradeResponseResponse>;
}

export function DrillWorkspace({ question, onSubmit }: DrillWorkspaceProps) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<GradeResponseResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await onSubmit(answer);
      setFeedback(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">훈련 질문</h3>
        <p className="text-xl font-medium text-blue-950">{question}</p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="여기에 영작을 입력하세요..."
          className="w-full min-h-[160px] p-6 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none resize-none bg-white placeholder:text-slate-400"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!answer.trim() || isSubmitting}
          className="absolute bottom-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>채점 중...</span>
            </>
          ) : (
            <>
              <span>답안 제출</span>
              <Send className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      {feedback && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              AI 피드백
            </h3>
            <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <span className="text-sm font-medium text-slate-500 mr-2">점수</span>
              <span className={cn(
                "text-xl font-black",
                feedback.score >= 80 ? "text-emerald-600" : "text-amber-600"
              )}>{feedback.score}점</span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">뉘앙스 교정</h4>
              <p className="text-slate-700 leading-relaxed text-lg">{feedback.nuanceBreakdownKorean}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">더 나은 표현 추천</h4>
              <ul className="space-y-3">
                {feedback.betterAlternatives.map((alt, idx) => (
                  <li key={idx} className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-100 flex items-center gap-4">
                    <span className="text-emerald-500 font-black text-lg w-6">{idx + 1}.</span>
                    <span className="text-lg font-medium">{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
