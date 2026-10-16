import { z } from "zod";

export const SubLessonSchema = z.object({
  stepId: z.number().min(1).max(10),
  subLessonId: z.number().min(1).max(3),
  title: z.string(),
  objective: z.string(),
  mindsetKeyPoint: z.string(),
});

export type SubLesson = z.infer<typeof SubLessonSchema>;

export const StepSchema = z.object({
  stepId: z.number().min(1).max(10),
  subLessons: z.array(SubLessonSchema).length(3),
});

export type Step = z.infer<typeof StepSchema>;

export const CurriculumSchema = z.array(StepSchema).length(10);

export type Curriculum = z.infer<typeof CurriculumSchema>;

const createSubLesson = (
  stepId: number,
  subLessonId: number,
  title: string,
  objective: string,
  mindsetKeyPoint: string
): SubLesson => ({
  stepId,
  subLessonId,
  title,
  objective,
  mindsetKeyPoint,
});

export const curriculum: Curriculum = [
  {
    stepId: 1,
    subLessons: [
      createSubLesson(1, 1, "인사 및 소개", "비즈니스 환경에서 첫 인사와 자기소개를 자연스럽게 할 수 있다.", "자신감 있는 태도와 명확한 발음이 중요합니다."),
      createSubLesson(1, 2, "안부 묻기", "동료나 고객과 가벼운 안부를 주고받으며 라포를 형성할 수 있다.", "상대방에 대한 진심 어린 관심이 신뢰를 쌓습니다."),
      createSubLesson(1, 3, "회사 소개", "우리 회사의 주요 비즈니스와 역할을 간결하게 설명할 수 있다.", "회사의 강점을 명확하고 설득력 있게 전달하세요."),
    ],
  },
  {
    stepId: 2,
    subLessons: [
      createSubLesson(2, 1, "이메일 시작하기", "격식에 맞는 인사말로 이메일을 시작할 수 있다.", "첫인상이 이메일의 톤을 결정합니다."),
      createSubLesson(2, 2, "목적 전달하기", "이메일 작성의 핵심 목적을 분명하게 전달할 수 있다.", "간결하고 명확하게 본론을 이야기하세요."),
      createSubLesson(2, 3, "이메일 마무리하기", "적절한 맺음말과 함께 향후 행동을 촉구할 수 있다.", "깔끔한 마무리는 전문성을 보여줍니다."),
    ],
  },
  {
    stepId: 3,
    subLessons: [
      createSubLesson(3, 1, "회의록 작성", "회의의 주요 내용을 요약하여 기록할 수 있다.", "객관적이고 정확한 정보 전달이 핵심입니다."),
      createSubLesson(3, 2, "안건 제안", "새로운 안건을 제안하고 그 이유를 설명할 수 있다.", "논리적인 근거로 의견을 뒷받침하세요."),
      createSubLesson(3, 3, "피드백 주고받기", "건설적인 피드백을 제공하고 수용할 수 있다.", "존중하는 태도로 의견을 교환하세요."),
    ],
  },
  {
    stepId: 4,
    subLessons: [
      createSubLesson(4, 1, "전화 응대", "프로페셔널하게 전화를 받고 메시지를 남길 수 있다.", "친절하고 명확한 목소리가 중요합니다."),
      createSubLesson(4, 2, "일정 조율", "상대방과 회의 일정을 조율하고 확정할 수 있다.", "상대방의 일정을 배려하는 유연성을 보여주세요."),
      createSubLesson(4, 3, "부재중 안내", "담당자 부재 시 적절한 대처와 안내를 할 수 있다.", "정확한 정보 전달로 혼선을 방지하세요."),
    ],
  },
  {
    stepId: 5,
    subLessons: [
      createSubLesson(5, 1, "프레젠테이션 도입", "청중의 이목을 끄는 오프닝을 할 수 있다.", "흥미로운 스토리나 질문으로 시작해 보세요."),
      createSubLesson(5, 2, "데이터 설명", "그래프와 수치를 활용하여 객관적인 정보를 전달할 수 있다.", "숫자가 가지는 의미를 쉽게 풀어 설명하세요."),
      createSubLesson(5, 3, "질의응답", "청중의 질문에 논리적이고 침착하게 답변할 수 있다.", "모르는 것은 솔직히 인정하고 추후 답변을 약속하세요."),
    ],
  },
  {
    stepId: 6,
    subLessons: [
      createSubLesson(6, 1, "협상 준비", "협상 목표를 설정하고 대안을 준비할 수 있다.", "철저한 준비가 성공적인 협상의 기반입니다."),
      createSubLesson(6, 2, "제안 및 양보", "유리한 조건을 제안하고 필요시 적절히 양보할 수 있다.", "상호 이익을 위한 타협점을 찾아보세요."),
      createSubLesson(6, 3, "계약 체결", "협상 내용을 바탕으로 최종 계약을 마무리할 수 있다.", "세부 사항을 꼼꼼하게 확인하고 동의를 구하세요."),
    ],
  },
  {
    stepId: 7,
    subLessons: [
      createSubLesson(7, 1, "문제 상황 인식", "발생한 문제를 정확하게 파악하고 보고할 수 있다.", "신속하고 객관적인 상황 파악이 중요합니다."),
      createSubLesson(7, 2, "원인 분석", "문제의 근본적인 원인을 논리적으로 분석할 수 있다.", "다양한 각도에서 문제를 바라보세요."),
      createSubLesson(7, 3, "해결책 제시", "실현 가능한 해결 방안을 제안하고 설득할 수 있다.", "구체적인 실행 계획과 기대 효과를 함께 제시하세요."),
    ],
  },
  {
    stepId: 8,
    subLessons: [
      createSubLesson(8, 1, "네트워킹 시작", "새로운 사람들과 자연스럽게 대화를 시작할 수 있다.", "공통 관심사를 찾아 대화의 물꼬를 트세요."),
      createSubLesson(8, 2, "스몰토크 유지", "다양한 주제로 편안하게 대화를 이어나갈 수 있다.", "경청하고 적절히 반응하며 대화에 참여하세요."),
      createSubLesson(8, 3, "관계 지속", "네트워킹 후에도 지속적인 관계를 유지할 수 있다.", "지속적인 연락과 관심 표현이 중요합니다."),
    ],
  },
  {
    stepId: 9,
    subLessons: [
      createSubLesson(9, 1, "프로젝트 기획", "새로운 프로젝트의 목표와 계획을 수립할 수 있다.", "명확한 비전과 현실적인 계획이 필요합니다."),
      createSubLesson(9, 2, "역할 분담", "팀원들의 역량에 맞게 업무를 분담할 수 있다.", "강점을 극대화할 수 있는 역할 배분이 중요합니다."),
      createSubLesson(9, 3, "진척도 관리", "프로젝트 진행 상황을 점검하고 이슈를 관리할 수 있다.", "정기적인 소통으로 목표 달성을 향해 나아가세요."),
    ],
  },
  {
    stepId: 10,
    subLessons: [
      createSubLesson(10, 1, "성과 발표", "팀의 성과를 정리하여 효과적으로 공유할 수 있다.", "구체적인 수치와 사례로 성과를 입증하세요."),
      createSubLesson(10, 2, "개선점 도출", "프로젝트를 리뷰하고 향후 개선점을 찾을 수 있다.", "실패에서도 배움을 얻는 자세가 중요합니다."),
      createSubLesson(10, 3, "비전 제시", "앞으로의 목표와 비전을 팀원들과 공유할 수 있다.", "함께 나아갈 방향을 제시하여 동기를 부여하세요."),
    ],
  },
];
