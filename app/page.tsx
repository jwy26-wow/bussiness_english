'use client';

import React from 'react';
import { CurriculumSidebar } from '@/components/CurriculumSidebar';
import { CycleStepper } from '@/components/CycleStepper';
import { ConceptCard } from '@/components/ConceptCard';
import { DrillWorkspace } from '@/components/DrillWorkspace';
import { VocabVaultViewer } from '@/components/VocabVaultViewer';
import { Cycle } from '@/types/cycle';

export default function Page() {
  const mockSteps = [
    { id: 1, title: '인사 및 소개' },
    { id: 2, title: '이메일 시작하기' },
    { id: 3, title: '회의록 작성' },
    { id: 4, title: '전화 응대' },
    { id: 5, title: '프레젠테이션 도입' },
    { id: 6, title: '협상 준비' },
    { id: 7, title: '문제 상황 인식' },
    { id: 8, title: '네트워킹 시작' },
    { id: 9, title: '프로젝트 기획' },
    { id: 10, title: '성과 발표' },
  ];

  const mockVocab = [
    {
      englishWord: 'Leverage',
      koreanMeaning: '활용하다, 지렛대',
      businessUsage: '기존 자원이나 인맥 등을 최대한 효과적으로 활용하여 더 큰 결과를 만들어낼 때 사용합니다.',
      exampleSentence: 'We need to leverage our existing network to enter the new market.'
    },
    {
      englishWord: 'Align',
      koreanMeaning: '조정하다, 뜻을 맞추다',
      businessUsage: '팀원들의 목표나 계획을 일치시키거나 같은 방향을 바라보게 만들 때 자주 사용됩니다.',
      exampleSentence: 'Let\'s schedule a meeting to align on our quarterly goals.'
    },
    {
      englishWord: 'Synergy',
      koreanMeaning: '시너지, 동반 상승효과',
      businessUsage: '두 부서나 회사가 협력하여 개별적으로 일할 때보다 더 큰 효과를 창출함을 설명할 때 쓰입니다.',
      exampleSentence: 'The merger will create significant synergy between the two departments.'
    }
  ];

  const handleDrillSubmit = async (answer: string) => {
    // Mock API call simulation
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          score: 85,
          nuanceBreakdownKorean: "전달하려는 핵심 의미는 좋으나, 조금 더 비즈니스 격식에 맞는 단어 선택이 필요합니다.",
          betterAlternatives: [
            "Could you please provide more details?",
            "I would appreciate further clarification on this matter.",
            "Could we elaborate on the specifics?"
          ]
        });
      }, 1500);
    });
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="h-full flex-shrink-0">
        <CurriculumSidebar currentStepId={2} totalSteps={10} steps={mockSteps} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header / Stepper */}
        <div className="flex-shrink-0">
          <CycleStepper currentCycle={Cycle.GUIDED_DRILL} />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-24">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">1. 개념 학습 컴포넌트</h2>
            <ConceptCard
              title="이메일 목적 전달하기"
              objective="이메일 작성의 핵심 목적을 분명하게 전달할 수 있다."
              mindsetKeyPoint="간결하고 명확하게 본론을 이야기하세요. 상대방의 시간을 존중하는 것이 가장 중요합니다."
              koreanExplanation="비즈니스 이메일에서는 서론을 짧게 하고 왜 이 메일을 보냈는지(목적)를 첫 단락에 명확하게 밝히는 것이 좋습니다."
              englishExpressions={[
                "I am writing to inquire about...",
                "The purpose of this email is to...",
                "Just following up on our previous conversation regarding..."
              ]}
            />
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">2. 반복 훈련 컴포넌트</h2>
            <DrillWorkspace
              question="다음 문장을 비즈니스 상황에 맞게 영작해보세요: '어제 회의에서 논의했던 건에 대해 더 자세한 내용을 알고 싶습니다.'"
              onSubmit={handleDrillSubmit}
            />
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">3. 어휘 20 컴포넌트</h2>
            <VocabVaultViewer vocabList={mockVocab} />
          </section>
        </div>
      </div>
    </div>
  );
}
