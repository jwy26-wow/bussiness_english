import { Cycle, CYCLE_ORDER, Phase, TransitionEvent, UserState } from "../types/cycle";
import { curriculum } from "../data/curriculum";

export class StateMachine {
  static getInitialState(): UserState {
    return {
      stepId: 1,
      subLessonId: 1,
      cycle: Cycle.CONCEPT_INPUT,
      phase: Phase.SUB_LESSON,
    };
  }

  static transition(state: UserState, event: TransitionEvent): UserState {
    switch (event) {
      case TransitionEvent.COMPLETE_CYCLE:
        return this.handleCompleteCycle(state);
      case TransitionEvent.COMPLETE_STEP_FINAL_EXAM:
        return this.handleCompleteStepFinalExam(state);
      case TransitionEvent.COMPLETE_CUMULATIVE_GATE_TEST:
        return this.handleCompleteCumulativeGateTest(state);
      default:
        return state;
    }
  }

  private static handleCompleteCycle(state: UserState): UserState {
    if (state.phase !== Phase.SUB_LESSON) {
      return state;
    }

    const currentCycleIndex = CYCLE_ORDER.indexOf(state.cycle);

    // Move to next cycle
    if (currentCycleIndex < CYCLE_ORDER.length - 1) {
      return {
        ...state,
        cycle: CYCLE_ORDER[currentCycleIndex + 1],
      };
    }

    // Last cycle completed (VOCAB_TEST)
    if (state.subLessonId < 3) {
      // Move to next sub-lesson
      return {
        ...state,
        subLessonId: state.subLessonId + 1,
        cycle: Cycle.CONCEPT_INPUT,
      };
    }

    // Sub-lesson 3 completed, move to STEP_FINAL_EXAM
    return {
      ...state,
      phase: Phase.STEP_FINAL_EXAM,
    };
  }

  private static handleCompleteStepFinalExam(state: UserState): UserState {
    if (state.phase !== Phase.STEP_FINAL_EXAM) {
      return state;
    }

    return {
      ...state,
      phase: Phase.CUMULATIVE_GATE_TEST,
    };
  }

  private static handleCompleteCumulativeGateTest(state: UserState): UserState {
    if (state.phase !== Phase.CUMULATIVE_GATE_TEST) {
      return state;
    }

    if (state.stepId < 10) {
      // Move to next step
      return {
        stepId: state.stepId + 1,
        subLessonId: 1,
        cycle: Cycle.CONCEPT_INPUT,
        phase: Phase.SUB_LESSON,
      };
    }

    // All steps completed
    return {
      ...state,
      phase: Phase.COMPLETED,
    };
  }
}
