'use client';

import React, { useState, useEffect } from 'react';
import { GenerateExamResponse, GradeResponseResponse } from '@/types/gemini';
import { Loader2, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export function StepFinalExamView() {
  const { stepId, advanceToCumulativeTest, addErrorRecord } = useAppStore();
  const [examData, setExamData] = useState<GenerateExamResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<Record<number, GradeResponseResponse>>({});

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch('/api/learn/generate-exam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'STEP_FINAL_EXAM',
            currentStepId: stepId,
          })
        });
        const data = await res.json();
        setExamData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExam();
  }, [stepId]);

  const handleSubmitAll = async () => {
    if (!examData) return;
    setIsSubmitting(true);

    const newResults: Record<number, GradeResponseResponse> = {};

    for (let i = 0; i < examData.questions.length; i++) {
      try {
        const res = await fetch('/api/learn/grade-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stepId,
            subLessonId: 3, // Assuming final exam happens after sublesson 3
            cycle: 'VOCAB_TEST', // Proxy cycle for the type
            question: examData.questions[i].questionEnglish,
            userAnswer: answers[i] || "No answer provided"
          })
        });
        const data = await res.json();
        newResults[i] = data;

        if (data.score < 100) {
          addErrorRecord({
            stepId,
            subLessonId: 3,
            question: examData.questions[i].questionEnglish,
            userAnswer: answers[i] || "No answer provided",
            nuanceBreakdownKorean: data.nuanceBreakdownKorean,
            betterAlternatives: data.betterAlternatives,
            misconceptionType: data.misconceptionType
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    setResults(newResults);
    setIsSubmitting(false);
  };

  const allAnswered = examData ? Object.keys(answers).length === examData.questions.length && Object.values(answers).every(a => a.trim().length > 0) : false;
  const isFinished = examData && Object.keys(results).length === examData.questions.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
        <p className="text-lg font-medium">스텝 총괄 테스트를 생성하고 있습니다...</p>
      </div>
    );
  }

  if (!examData) {
    return <div className="text-center py-12 text-red-500 font-bold">시험을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-8">
      <div className="bg-slate-900 text-white p-8 rounded-2xl mb-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-3">{examData.examTitleKorean}</h1>
        <p className="text-slate-300 text-lg">모든 상황에 맞는 영어 답변을 작성해주세요.</p>
      </div>

      <div className="space-y-12">
        {examData.questions.map((q, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <div className="flex items-start gap-4 mb-4">
                <span className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">상황: {q.scenarioKorean}</h3>
                  <p className="text-blue-700 font-medium">{q.questionEnglish}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <textarea
                value={answers[idx] || ''}
                onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                disabled={isFinished || isSubmitting}
                placeholder="영어로 답변을 작성하세요..."
                className="w-full min-h-[120px] p-4 text-lg border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none resize-none bg-white placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>

            {results[idx] && (
              <div className="p-6 bg-emerald-50 border-t border-emerald-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    피드백 및 교정
                  </h4>
                  <span className="font-black text-emerald-700 text-xl">{results[idx].score}점</span>
                </div>
                <p className="text-emerald-900 mb-4 leading-relaxed">{results[idx].nuanceBreakdownKorean}</p>
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">추천 표현</span>
                  <ul className="list-disc list-inside text-emerald-800 space-y-1">
                    {results[idx].betterAlternatives.map((alt, i) => (
                      <li key={i}>{alt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-end">
        {!isFinished ? (
          <button
            onClick={handleSubmitAll}
            disabled={!allAnswered || isSubmitting}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>채점 중...</span>
              </>
            ) : (
              <>
                <span>최종 답안 제출</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => advanceToCumulativeTest()}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-slate-800 transition-all shadow-md"
          >
            <span>누적 가변 테스트로 이동</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
