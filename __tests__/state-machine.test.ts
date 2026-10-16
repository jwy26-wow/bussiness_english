import { describe, it, expect } from "vitest";
import { StateMachine } from "../src/lib/state-machine";
import { Cycle, Phase, TransitionEvent } from "../src/types/cycle";

describe("StateMachine", () => {
  it("should return the initial state", () => {
    const initialState = StateMachine.getInitialState();
    expect(initialState).toEqual({
      stepId: 1,
      subLessonId: 1,
      cycle: Cycle.CONCEPT_INPUT,
      phase: Phase.SUB_LESSON,
    });
  });

  it("should advance through cycles sequentially", () => {
    let state = StateMachine.getInitialState();

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CYCLE);
    expect(state.cycle).toBe(Cycle.GUIDED_DRILL);

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CYCLE);
    expect(state.cycle).toBe(Cycle.IMMEDIATE_TEST);

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CYCLE);
    expect(state.cycle).toBe(Cycle.ERROR_CORRECTION);

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CYCLE);
    expect(state.cycle).toBe(Cycle.WORD_VAULT);

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CYCLE);
    expect(state.cycle).toBe(Cycle.CONTEXT_MEMORIZATION);

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CYCLE);
    expect(state.cycle).toBe(Cycle.VOCAB_TEST);
  });

  it("should advance to the next sub-lesson after completing VOCAB_TEST", () => {
    let state = {
      stepId: 1,
      subLessonId: 1,
      cycle: Cycle.VOCAB_TEST,
      phase: Phase.SUB_LESSON,
    };

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CYCLE);

    expect(state).toEqual({
      stepId: 1,
      subLessonId: 2,
      cycle: Cycle.CONCEPT_INPUT,
      phase: Phase.SUB_LESSON,
    });
  });

  it("should trigger STEP_FINAL_EXAM after sub-lesson 3 is completed", () => {
    let state = {
      stepId: 1,
      subLessonId: 3,
      cycle: Cycle.VOCAB_TEST,
      phase: Phase.SUB_LESSON,
    };

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CYCLE);

    expect(state).toEqual({
      stepId: 1,
      subLessonId: 3,
      cycle: Cycle.VOCAB_TEST,
      phase: Phase.STEP_FINAL_EXAM,
    });
  });

  it("should trigger CUMULATIVE_GATE_TEST after STEP_FINAL_EXAM is completed", () => {
    let state = {
      stepId: 1,
      subLessonId: 3,
      cycle: Cycle.VOCAB_TEST,
      phase: Phase.STEP_FINAL_EXAM,
    };

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_STEP_FINAL_EXAM);

    expect(state).toEqual({
      stepId: 1,
      subLessonId: 3,
      cycle: Cycle.VOCAB_TEST,
      phase: Phase.CUMULATIVE_GATE_TEST,
    });
  });

  it("should advance to the next step after CUMULATIVE_GATE_TEST is completed", () => {
    let state = {
      stepId: 1,
      subLessonId: 3,
      cycle: Cycle.VOCAB_TEST,
      phase: Phase.CUMULATIVE_GATE_TEST,
    };

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CUMULATIVE_GATE_TEST);

    expect(state).toEqual({
      stepId: 2,
      subLessonId: 1,
      cycle: Cycle.CONCEPT_INPUT,
      phase: Phase.SUB_LESSON,
    });
  });

  it("should mark as COMPLETED after Step 10's CUMULATIVE_GATE_TEST", () => {
    let state = {
      stepId: 10,
      subLessonId: 3,
      cycle: Cycle.VOCAB_TEST,
      phase: Phase.CUMULATIVE_GATE_TEST,
    };

    state = StateMachine.transition(state, TransitionEvent.COMPLETE_CUMULATIVE_GATE_TEST);

    expect(state).toEqual({
      stepId: 10,
      subLessonId: 3,
      cycle: Cycle.VOCAB_TEST,
      phase: Phase.COMPLETED,
    });
  });

  it("should not process COMPLETE_CYCLE if not in SUB_LESSON phase", () => {
    let state = {
      stepId: 1,
      subLessonId: 3,
      cycle: Cycle.VOCAB_TEST,
      phase: Phase.STEP_FINAL_EXAM,
    };

    const nextState = StateMachine.transition(state, TransitionEvent.COMPLETE_CYCLE);
    expect(nextState).toBe(state); // No transition should occur
  });
});
