import React from 'react';
import { Lightbulb } from 'lucide-react';

export interface ConceptCardProps {
  title: string;
  objective: string;
  mindsetKeyPoint: string;
  koreanExplanation?: string;
  englishExpressions?: string[];
}

export function ConceptCard({
  title,
  objective,
  mindsetKeyPoint,
  koreanExplanation,
  englishExpressions = []
}: ConceptCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-3xl mx-auto w-full">
      <div className="bg-slate-900 p-8 text-white">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-slate-300 text-lg">{objective}</p>
      </div>

      <div className="p-8">
        <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-xl border border-amber-100 mb-8">
          <div className="bg-amber-100 p-3 rounded-full text-amber-600 flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">핵심 마인드셋</h3>
            <p className="text-amber-800 leading-relaxed font-medium">
              "{mindsetKeyPoint}"
            </p>
          </div>
        </div>

        {koreanExplanation && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">학습 가이드</h3>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
              <p>{koreanExplanation}</p>
            </div>
          </div>
        )}

        {englishExpressions.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">필수 표현</h3>
            <ul className="space-y-3">
              {englishExpressions.map((expr, idx) => (
                <li key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center gap-4">
                  <span className="text-blue-600 font-bold text-lg w-6">{idx + 1}.</span>
                  <span className="text-lg font-medium text-slate-800">{expr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
