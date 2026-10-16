'use client';

import React, { useState, useEffect } from 'react';
import { GenerateExamResponse, GradeResponseResponse } from '@/types/gemini';
import { Loader2, Send, CheckCircle2, XCircle, ChevronRight, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export function CumulativeGateTestView() {
  const { stepId, advanceToNextStep, addErrorRecord } = useAppStore();
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
            type: 'CUMULATIVE_GATE_TEST',
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
            subLessonId: 3,
            cycle: 'VOCAB_TEST',
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

  const averageScore = isFinished
    ? Math.round(Object.values(results).reduce((acc, curr) => acc + curr.score, 0) / Object.keys(results).length)
    : 0;

  const passed = averageScore >= 80;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-purple-600" />
        <p className="text-lg font-medium">누적 가변 테스트를 준비하고 있습니다...</p>
      </div>
    );
  }

  if (!examData) {
    return <div className="text-center py-12 text-red-500 font-bold">시험을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-8">
      <div className="bg-purple-900 text-white p-8 rounded-2xl mb-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-3">{examData.examTitleKorean}</h1>
        <p className="text-purple-200 text-lg">다음 스텝으로 넘어가기 전, 이전의 학습 내용이 완벽하게 체화되었는지 확인합니다.</p>
      </div>

      <div className="space-y-12">
        {examData.questions.map((q, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <div className="flex items-start gap-4 mb-4">
                <span className="bg-purple-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">상황: {q.scenarioKorean}</h3>
                  <p className="text-purple-700 font-medium">{q.questionEnglish}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <textarea
                value={answers[idx] || ''}
                onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                disabled={isFinished || isSubmitting}
                placeholder="영어로 답변을 작성하세요..."
                className="w-full min-h-[120px] p-4 text-lg border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none resize-none bg-white placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>

            {results[idx] && (
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-slate-700 text-xl">점수: {results[idx].score}점</span>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">{results[idx].nuanceBreakdownKorean}</p>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">추천 표현</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
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

      <div className="mt-12">
        {!isFinished ? (
          <div className="flex justify-end">
            <button
              onClick={handleSubmitAll}
              disabled={!allAnswered || isSubmitting}
              className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
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
          </div>
        ) : (
          <div className={cn(
            "p-8 rounded-2xl flex flex-col items-center text-center",
            passed ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"
          )}>
            {passed ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                <h2 className="text-3xl font-black text-emerald-800 mb-2">통과하셨습니다!</h2>
                <p className="text-emerald-700 text-lg mb-6">평균 {averageScore}점으로 누적 테스트를 성공적으로 마쳤습니다.</p>
                <button
                  onClick={() => advanceToNextStep()}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-md"
                >
                  <span>다음 스텝으로 이동</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-amber-500 mb-4" />
                <h2 className="text-3xl font-black text-amber-800 mb-2">아쉽게도 통과하지 못했습니다.</h2>
                <p className="text-amber-700 text-lg mb-2">평균 {averageScore}점 (통과 기준: 80점)</p>
                <p className="text-amber-800 font-medium mb-6">오답노트를 복습하고 뉘앙스 차이를 다시 한 번 확인해주세요.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-amber-700 transition-all shadow-md"
                >
                  <RefreshCcw className="w-5 h-5" />
                  <span>테스트 다시 보기</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
