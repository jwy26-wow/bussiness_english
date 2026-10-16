import { GoogleGenAI } from "@google/genai";
import {
  GenerateContentRequest, GenerateContentResponse,
  GenerateContentResponseSchema,
  GradeResponseRequest, GradeResponseResponse,
  GradeResponseResponseSchema,
  GenerateExamRequest, GenerateExamResponse,
  GenerateExamResponseSchema
} from "../types/gemini";

// Mocks
const MOCK_GENERATE_CONTENT: GenerateContentResponse = {
  koreanExplanation: "이 비즈니스 상황에서는 정중한 표현이 중요합니다. 다음 표현들을 익혀보세요.",
  englishExpressions: ["I look forward to hearing from you.", "Please let me know if you have any questions.", "Thank you for your time."],
  practiceQuestion: "What is a professional way to end an email?"
};

const MOCK_GRADE_RESPONSE: GradeResponseResponse = {
  score: 85,
  nuanceBreakdownKorean: "전반적으로 의미 전달은 훌륭합니다. 하지만 격식을 차려야 하는 상황이므로 조금 더 부드러운 뉘앙스의 단어를 선택하는 것이 좋습니다.",
  betterAlternatives: ["Could you please clarify this point?", "I would appreciate some more details.", "Could we elaborate on this?"]
};

const MOCK_GENERATE_EXAM: GenerateExamResponse = {
  examTitleKorean: "비즈니스 영어 실전 모의고사",
  questions: [
    {
      scenarioKorean: "새로운 해외 파트너사에게 우리 회사의 물류 시스템을 소개해야 합니다. (IT에서 물류로 상황 변경됨)",
      questionEnglish: "How would you explain your company's core logistics advantage?",
      expectedAnswerKeywords: ["efficient", "supply chain", "delivery"]
    },
    {
      scenarioKorean: "중요한 계약의 마감일을 협상해야 하는 상황입니다.",
      questionEnglish: "How would you propose a new deadline while maintaining a professional relationship?",
      expectedAnswerKeywords: ["extension", "propose", "feasible"]
    },
    {
      scenarioKorean: "제조 공정의 결함에 대한 해결책을 보고해야 합니다.",
      questionEnglish: "How would you present your solution to the manufacturing defect?",
      expectedAnswerKeywords: ["root cause", "implement", "resolve"]
    }
  ]
};

// Client initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export class GeminiService {
  static isMockMode() {
    return !ai;
  }

  static async generateContent(req: GenerateContentRequest): Promise<GenerateContentResponse> {
    if (this.isMockMode() || !ai) {
      return MOCK_GENERATE_CONTENT;
    }

    const prompt = `
      You are an expert Business English Coach.
      Generate learning content for the following context:
      - Step ID: ${req.stepId}
      - Sub-lesson ID: ${req.subLessonId}
      - Cycle Type: ${req.cycle}
      - Title: ${req.title}
      - Objective: ${req.objective}

      Rules:
      1. ALL explanations, instructions, and feedback MUST be written in Korean (한국어).
      2. The English expressions and the target practice question MUST be in English.
      3. Provide exactly 3 English expressions.
      4. Return the result STRICTLY as a valid JSON object matching this structure:
      {
        "koreanExplanation": "string (Korean)",
        "englishExpressions": ["string", "string", "string"],
        "practiceQuestion": "string (English)"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    return GenerateContentResponseSchema.parse(JSON.parse(text));
  }

  static async gradeResponse(req: GradeResponseRequest): Promise<GradeResponseResponse> {
    if (this.isMockMode() || !ai) {
      return MOCK_GRADE_RESPONSE;
    }

    const prompt = `
      You are an expert Business English Coach.
      Grade the user's answer to the provided question.

      Context:
      - Step ID: ${req.stepId}
      - Sub-lesson ID: ${req.subLessonId}
      - Cycle Type: ${req.cycle}
      - Question: ${req.question}
      - User Answer: ${req.userAnswer}

      Rules:
      1. ALL feedback, nuance breakdown, and analysis MUST be written in Korean (한국어).
      2. The suggested better alternatives MUST be in English.
      3. Provide a score out of 100 based on clarity, professional tone, and grammar.
      4. Provide 2-3 better alternative expressions.
      5. Return the result STRICTLY as a valid JSON object matching this structure:
      {
        "score": number,
        "nuanceBreakdownKorean": "string (Korean)",
        "betterAlternatives": ["string", "string"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    return GradeResponseResponseSchema.parse(JSON.parse(text));
  }

  static async generateExam(req: GenerateExamRequest): Promise<GenerateExamResponse> {
    if (this.isMockMode() || !ai) {
      return MOCK_GENERATE_EXAM;
    }

    const prompt = `
      You are an expert Business English Coach.
      Generate an exam of type: ${req.type}.

      Context:
      - Current Step ID: ${req.currentStepId}
      - Previous Topics (if applicable): ${req.previousTopics?.join(", ")}

      Rules:
      1. STRICT MUTATION RULE: You must invent completely new scenarios (e.g., if a previous topic was IT sales, change the scenario to logistics, manufacturing, or a buyer/partner relationship) so questions are never repetitive.
      2. The exam title and the scenario descriptions MUST be written in Korean (한국어).
      3. The exam questions MUST be in English.
      4. Provide 3 questions for the exam.
      5. Return the result STRICTLY as a valid JSON object matching this structure:
      {
        "examTitleKorean": "string (Korean)",
        "questions": [
          {
            "scenarioKorean": "string (Korean)",
            "questionEnglish": "string (English)",
            "expectedAnswerKeywords": ["string", "string"]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    return GenerateExamResponseSchema.parse(JSON.parse(text));
  }
}
