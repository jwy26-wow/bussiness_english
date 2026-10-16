import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../src/store/useAppStore';
import { Cycle, Phase } from '../src/types/cycle';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.getState().resetProgress();
  });

  it('should have correct initial state', () => {
    const state = useAppStore.getState();
    expect(state.stepId).toBe(1);
    expect(state.subLessonId).toBe(1);
    expect(state.cycle).toBe(Cycle.CONCEPT_INPUT);
    expect(state.phase).toBe(Phase.SUB_LESSON);
    expect(state.errorHistory).toEqual([]);
  });

  it('should advance cycle correctly', () => {
    useAppStore.getState().advanceCycle();
    expect(useAppStore.getState().cycle).toBe(Cycle.GUIDED_DRILL);
  });

  it('should advance sub-lesson correctly', () => {
    useAppStore.getState().advanceSubLesson();
    const state = useAppStore.getState();
    expect(state.subLessonId).toBe(2);
    expect(state.cycle).toBe(Cycle.CONCEPT_INPUT);
  });

  it('should advance to step final exam', () => {
    useAppStore.getState().advanceToStepFinalExam();
    expect(useAppStore.getState().phase).toBe(Phase.STEP_FINAL_EXAM);
  });

  it('should advance to cumulative test', () => {
    useAppStore.getState().advanceToCumulativeTest();
    expect(useAppStore.getState().phase).toBe(Phase.CUMULATIVE_GATE_TEST);
  });

  it('should advance to next step', () => {
    useAppStore.getState().advanceToNextStep();
    const state = useAppStore.getState();
    expect(state.stepId).toBe(2);
    expect(state.subLessonId).toBe(1);
    expect(state.cycle).toBe(Cycle.CONCEPT_INPUT);
    expect(state.phase).toBe(Phase.SUB_LESSON);
  });

  it('should add error record and generate an id and timestamp', () => {
    const record = {
      stepId: 1,
      subLessonId: 1,
      question: "Test question?",
      userAnswer: "Bad answer",
      nuanceBreakdownKorean: "안좋은 답변입니다.",
      betterAlternatives: ["Good answer"],
      misconceptionType: "어순 오류"
    };

    useAppStore.getState().addErrorRecord(record);
    const state = useAppStore.getState();

    expect(state.errorHistory.length).toBe(1);
    expect(state.errorHistory[0].stepId).toBe(1);
    expect(state.errorHistory[0].question).toBe("Test question?");
    expect(typeof state.errorHistory[0].id).toBe('string');
    expect(typeof state.errorHistory[0].timestamp).toBe('number');
  });
});
