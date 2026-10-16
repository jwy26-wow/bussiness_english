import { describe, it, expect } from "vitest";
import { GeminiService } from "../src/lib/gemini";
import { Cycle } from "../src/types/cycle";

describe("GeminiService (Mock Mode)", () => {
  it("should generate content successfully in mock mode", async () => {
    const req = {
      stepId: 1,
      subLessonId: 1,
      cycle: Cycle.CONCEPT_INPUT,
      title: "인사 및 소개",
      objective: "비즈니스 환경에서 첫 인사와 자기소개를 자연스럽게 할 수 있다."
    };

    const res = await GeminiService.generateContent(req);

    expect(res).toBeDefined();
    expect(typeof res.koreanExplanation).toBe("string");
    expect(res.englishExpressions).toHaveLength(3); // Mock has 3
    expect(typeof res.practiceQuestion).toBe("string");
  });

  it("should grade response successfully in mock mode", async () => {
    const req = {
      stepId: 1,
      subLessonId: 1,
      cycle: Cycle.CONCEPT_INPUT,
      question: "What is a professional way to end an email?",
      userAnswer: "See ya later."
    };

    const res = await GeminiService.gradeResponse(req);

    expect(res).toBeDefined();
    expect(res.score).toBe(85); // Mock has 85
    expect(typeof res.nuanceBreakdownKorean).toBe("string");
    expect(res.betterAlternatives).toHaveLength(3); // Mock has 3
  });

  it("should generate exam successfully in mock mode", async () => {
    const req = {
      type: "STEP_FINAL_EXAM" as const,
      currentStepId: 1,
      previousTopics: ["IT Sales"]
    };

    const res = await GeminiService.generateExam(req);

    expect(res).toBeDefined();
    expect(typeof res.examTitleKorean).toBe("string");
    expect(res.questions).toHaveLength(3); // Mock has 3
    expect(typeof res.questions[0].scenarioKorean).toBe("string");
    expect(typeof res.questions[0].questionEnglish).toBe("string");
    expect(Array.isArray(res.questions[0].expectedAnswerKeywords)).toBe(true);
  });
});
