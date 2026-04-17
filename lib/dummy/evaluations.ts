export interface EvaluationQuestion {
  questionId: string;
  questionText: string;
  userAnswer: string;
  aiFeedback: string;
  marksAwarded: number;
  maxMarks: number;
  correctHint: string;
}

export interface DummyEvaluation {
  id: string;
  paperId: string;
  paperName: string;
  date: string;
  totalMarks: number;
  scoredMarks: number;
  grade: string;
  questions: EvaluationQuestion[];
  topicPerformance: { topic: string; score: number; max: number }[];
}

export const dummyEvaluations: DummyEvaluation[] = [
  {
    id: "eval_1",
    paperId: "paper_1",
    paperName: "CN - Midterm Practice",
    date: "2024-03-17",
    totalMarks: 50,
    scoredMarks: 36,
    grade: "B+",
    questions: [
      {
        questionId: "q1",
        questionText: "Define the term 'Framing' in OSI model.",
        userAnswer: "Framing is the process of breaking data into frames and adding headers.",
        aiFeedback: "Good start, but you should mention how it allows the receiver to identify the start and end of blocks of data.",
        marksAwarded: 1.5,
        maxMarks: 2,
        correctHint: "Framing is a point-to-point connection between two nodes... it includes synchronization and error control.",
      },
    ],
    topicPerformance: [
      { topic: "Data Link Layer", score: 12, max: 20 },
      { topic: "Network Layer", score: 18, max: 20 },
      { topic: "Physical Layer", score: 6, max: 10 },
    ],
  },
];
