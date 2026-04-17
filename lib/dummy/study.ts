export interface DummyFlashcard {
  id: string;
  topicId: string;
  question: string;
  answer: string;
}

export const dummyFlashcards: DummyFlashcard[] = [
  {
    id: "fc_1",
    topicId: "topic_1",
    question: "What are the two sublayers of the Data Link Layer?",
    answer: "Logical Link Control (LLC) and Media Access Control (MAC).",
  },
  {
    id: "fc_2",
    topicId: "topic_1",
    question: "What is the purpose of the Frame Check Sequence (FCS)?",
    answer: "To detect errors in the frame that may have occurred during transmission.",
  },
];

export interface DummyWeakArea {
  topicId: string;
  topicName: string;
  averageScore: number;
  lastAttempted: string;
}

export const dummyWeakAreas: DummyWeakArea[] = [
  {
    topicId: "topic_3",
    topicName: "Transport Layer - Congestion Control",
    averageScore: 34,
    lastAttempted: "2024-03-15",
  },
];

export interface StudyDay {
  date: string;
  topics: string[];
  duration: string;
}

export interface DummyStudyPlan {
  examName: string;
  examDate: string;
  streak: number;
  days: StudyDay[];
}

export const dummyStudyPlan: DummyStudyPlan = {
  examName: "Computer Networks Finals",
  examDate: "2024-05-20",
  streak: 5,
  days: [
    { date: "2024-03-18", topics: ["Data Link Layer", "Framing"], duration: "2h" },
    { date: "2024-03-19", topics: ["TCP/UDP"], duration: "1.5h" },
  ],
};
