import React from 'react';
import { BookOpen } from 'lucide-react';

export interface VocabItem {
  englishWord: string;
  koreanMeaning: string;
  businessUsage: string;
  exampleSentence: string;
}

export interface VocabVaultViewerProps {
  vocabList: VocabItem[];
}

export function VocabVaultViewer({ vocabList }: VocabVaultViewerProps) {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8 px-4">
        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">실무 필수 어휘 20</h2>
          <p className="text-slate-500">문맥 속에서 자연스럽게 활용할 수 있도록 익혀보세요.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {vocabList.map((vocab, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {vocab.englishWord}
                </h3>
                <p className="text-slate-600 font-medium">{vocab.koreanMeaning}</p>
              </div>
              <span className="text-slate-300 font-bold text-xl">
                {(idx + 1).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">실무 활용</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{vocab.businessUsage}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">예문</h4>
                <p className="text-sm italic text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  "{vocab.exampleSentence}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
