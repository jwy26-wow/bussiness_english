import React from 'react';
import { ErrorNoteBook } from '@/components/ErrorNoteBook';

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-800">비즈니스 영어 코칭</h1>
          <nav className="flex gap-4">
            <a href="/" className="text-slate-500 hover:text-slate-900 font-medium transition-colors">학습 홈</a>
            <a href="/learn/review" className="text-blue-600 font-bold">오답노트 복습</a>
          </nav>
        </div>
      </header>

      <main className="py-8">
        <ErrorNoteBook />
      </main>
    </div>
  );
}
