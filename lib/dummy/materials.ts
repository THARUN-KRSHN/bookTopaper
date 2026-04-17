export interface DummyTopic {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subtopics: string[];
}

export interface DummyMaterial {
  id: string;
  name: string;
  type: "pdf" | "image";
  uploadDate: string;
  size: string;
  topicCount: number;
  papersGenerated: number;
  topics?: DummyTopic[];
}

export const dummyTopics: DummyTopic[] = [
  {
    id: "topic_1",
    name: "Data Link Layer",
    difficulty: "Medium",
    subtopics: ["Framing", "Error Detection", "Flow Control"],
  },
  {
    id: "topic_2",
    name: "Network Layer",
    difficulty: "Hard",
    subtopics: ["IPv4 Addressing", "Routing Protocols", "ICMP"],
  },
  {
    id: "topic_3",
    name: "Transport Layer",
    difficulty: "Medium",
    subtopics: ["TCP", "UDP", "Congestion Control"],
  },
];

export const dummyMaterials: DummyMaterial[] = [
  {
    id: "mat_1",
    name: "Computer_Networks_Module_1.pdf",
    type: "pdf",
    uploadDate: "2024-03-15",
    size: "4.2 MB",
    topicCount: 12,
    papersGenerated: 3,
    topics: dummyTopics,
  },
  {
    id: "mat_2",
    name: "Network_Security_Notes.png",
    type: "image",
    uploadDate: "2024-03-10",
    size: "1.8 MB",
    topicCount: 5,
    papersGenerated: 1,
  },
];
