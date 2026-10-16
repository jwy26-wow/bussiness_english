import { z } from "zod";
import { Cycle } from "./cycle";

// Requests
export const GenerateContentRequestSchema = z.object({
  stepId: z.number().min(1).max(10),
  subLessonId: z.number().min(1).max(3),
  cycle: z.nativeEnum(Cycle),
  title: z.string(),
  objective: z.string(),
});

export type GenerateContentRequest = z.infer<typeof GenerateContentRequestSchema>;

export const GradeResponseRequestSchema = z.object({
  stepId: z.number().min(1).max(10),
  subLessonId: z.number().min(1).max(3),
  cycle: z.nativeEnum(Cycle),
  question: z.string(),
  userAnswer: z.string(),
});

export type GradeResponseRequest = z.infer<typeof GradeResponseRequestSchema>;

export const GenerateExamRequestSchema = z.object({
  type: z.enum(["STEP_FINAL_EXAM", "CUMULATIVE_GATE_TEST"]),
  currentStepId: z.number().min(1).max(10),
  previousTopics: z.array(z.string()).optional(),
});

export type GenerateExamRequest = z.infer<typeof GenerateExamRequestSchema>;

// Responses
export const GenerateContentResponseSchema = z.object({
  koreanExplanation: z.string(),
  englishExpressions: z.array(z.string()),
  practiceQuestion: z.string(),
});

export type GenerateContentResponse = z.infer<typeof GenerateContentResponseSchema>;

export const GradeResponseResponseSchema = z.object({
  score: z.number().min(0).max(100),
  nuanceBreakdownKorean: z.string(),
  betterAlternatives: z.array(z.string()),
});

export type GradeResponseResponse = z.infer<typeof GradeResponseResponseSchema>;

export const ExamQuestionSchema = z.object({
  scenarioKorean: z.string(),
  questionEnglish: z.string(),
  expectedAnswerKeywords: z.array(z.string()),
});

export const GenerateExamResponseSchema = z.object({
  examTitleKorean: z.string(),
  questions: z.array(ExamQuestionSchema),
});

export type GenerateExamResponse = z.infer<typeof GenerateExamResponseSchema>;
