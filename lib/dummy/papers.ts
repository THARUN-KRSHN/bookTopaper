export interface Question {
  id: string;
  number: number;
  text: string;
  marks: number;
  part: string;
}

export interface DummyPaper {
  id: string;
  name: string;
  format: "KTU" | "CBSE" | "Custom";
  materialId: string;
  totalMarks: number;
  duration: number;
  createdAt: string;
  sections: {
    name: string;
    rules: string;
    questions: Question[];
  }[];
}

export const dummyPapers: DummyPaper[] = [
  {
    id: "paper_1",
    name: "CN - Midterm Practice",
    format: "KTU",
    materialId: "mat_1",
    totalMarks: 50,
    duration: 90,
    createdAt: "2024-03-16",
    sections: [
      {
        name: "Part A",
        rules: "Answer all questions. Each question carries 2 marks.",
        questions: [
          { id: "q1", number: 1, text: "Define the term 'Framing' in OSI model.", marks: 2, part: "A" },
          { id: "q2", number: 2, text: "Explain the difference between TCP and UDP.", marks: 2, part: "A" },
          { id: "q3", number: 3, text: "What is an IPv4 address?", marks: 2, part: "A" },
        ],
      },
      {
        name: "Part B",
        rules: "Answer any two questions. Each question carries 5 marks.",
        questions: [
          { id: "q4", number: 4, text: "Describe the Selective Repeat ARQ protocol in detail.", marks: 5, part: "B" },
          { id: "q5", number: 5, text: "Explain the working of Distance Vector Routing algorithm.", marks: 5, part: "B" },
        ],
      },
    ],
  },
];
