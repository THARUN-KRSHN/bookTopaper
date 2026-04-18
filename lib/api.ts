/**
 * lib/api.ts — Centralized typed API client for BookToPaper
 * All backend calls go through here. Token is read from localStorage via the auth store.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ── Token helpers (browser-only) ─────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("btp_token");
}

// ── Base fetcher ─────────────────────────────────────────────────────────────
async function apiCall<T = any>(
  path: string,
  options: RequestInit & { isFormData?: boolean } = {}
): Promise<T> {
  const token = getToken();
  const { isFormData, ...fetchOpts } = options;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (options.headers) Object.assign(headers, options.headers);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOpts,
    headers,
  });

  // Errors
  if (!res.ok) {
    let errorData: any = {};
    try { errorData = await res.json(); } catch {}
    const err: any = new Error(errorData.error || `HTTP ${res.status}`);
    err.code = errorData.code || "UNKNOWN";
    err.status = res.status;
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  default_format?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface Material {
  id: string;
  user_id: string;
  filename: string;
  storage_path: string;
  file_type: string;
  status: "uploaded" | "processing" | "ready" | "error";
  topic_count: number;
  raw_text?: string;
  created_at: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  material_id: string;
  name: string;
  subtopics: string[];
  difficulty: string;
  content?: string;
}

export interface Question {
  id: string;
  number?: number;
  text?: string;
  question?: string;
  marks: number;
  topic?: string;
  difficulty?: string;
  part?: string;
  options?: string[];
}

export interface Paper {
  id: string;
  user_id: string;
  title: string;
  material_ids: string[];
  format: string;
  total_marks: number;
  duration_mins: number;
  difficulty: { easy: number; medium: number; hard: number };
  sections: { name: string; rules?: string; questions: Question[] }[];
  general_instructions?: string;
  pdf_path?: string;
  pdf_url?: string;
  created_at: string;
}

export interface Exam {
  id: string;
  paper_id: string;
  status: "in_progress" | "submitted";
  started_at: string;
  submitted_at?: string;
  elapsed_secs: number;
  duration_mins: number;
  answers: { question_id: string; answer_text: string }[];
  practice_mode: boolean;
  paper?: Paper;
}

export interface EvaluationQuestion {
  question_id: string;
  question_text: string;
  user_answer: string;
  ai_feedback: string;
  correct_hint: string;
  marks_awarded: number;
  max_marks: number;
  topic: string;
}

export interface Evaluation {
  id: string;
  exam_id: string;
  user_id: string;
  total_marks: number;
  scored_marks: number;
  grade: string;
  breakdown: EvaluationQuestion[];
  topic_scores: { topic: string; score: number; max: number }[];
  created_at: string;
}

export interface Flashcard {
  id: string;
  topic_id: string;
  front: string;
  back: string;
}

export interface WeakArea {
  topic_name: string;
  average_score: number;
  scored: number;
  max: number;
}

export interface StudySession {
  id: string;
  topic_id: string;
  phase: "learn" | "recall" | "test";
  completed: boolean;
}

export interface RevisionPlan {
  id: string;
  exam_name: string;
  exam_date: string;
  intensity: string;
  plan: {
    date: string;
    topics: string[];
    duration: string;
    type: "study" | "revision" | "rest";
  }[];
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  register: (email: string, password: string, full_name: string) =>
    apiCall<{ user_id: string; email: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    }),

  login: (email: string, password: string) =>
    apiCall<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiCall("/auth/logout", { method: "POST" }),

  me: () => apiCall<User>("/auth/me"),

  refreshToken: (refresh_token: string) =>
    apiCall<Pick<AuthResponse, "access_token" | "refresh_token" | "expires_in">>(
      "/auth/refresh",
      { method: "POST", body: JSON.stringify({ refresh_token }) }
    ),
};

// ── Materials ─────────────────────────────────────────────────────────────────
export const materials = {
  list: () => apiCall<Material[]>("/materials/"),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiCall<Material>("/materials/upload", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },

  get: (id: string) => apiCall<Material>(`/materials/${id}`),

  getTopics: (id: string) => apiCall<Topic[]>(`/materials/${id}/topics`),

  delete: (id: string) =>
    apiCall(`/materials/${id}`, { method: "DELETE" }),

  reprocess: (id: string) =>
    apiCall<Material>(`/materials/${id}/reprocess`, { method: "POST" }),
};

// ── Papers ────────────────────────────────────────────────────────────────────
export const papers = {
  list: () => apiCall<Paper[]>("/papers/"),

  generate: (config: {
    material_ids: string[];
    format: string;
    title: string;
    total_marks: number;
    duration_mins: number;
    difficulty: { easy: number; medium: number; hard: number };
    sections?: any[];
  }) =>
    apiCall<Paper>("/papers/generate", {
      method: "POST",
      body: JSON.stringify(config),
    }),

  get: (id: string) => apiCall<Paper>(`/papers/${id}`),

  delete: (id: string) =>
    apiCall(`/papers/${id}`, { method: "DELETE" }),

  downloadUrl: (id: string) => `${BASE_URL}/papers/${id}/download`,

  downloadBlob: async (id: string): Promise<Blob> => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/papers/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Download failed");
    return res.blob();
  },

  regenerate: (id: string) =>
    apiCall<Paper>(`/papers/${id}/regenerate`, { method: "POST" }),

  editQuestion: (paperId: string, questionId: string, updates: any) =>
    apiCall(`/papers/${paperId}/questions/${questionId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
};

// ── Exams ─────────────────────────────────────────────────────────────────────
export const exams = {
  create: (paper_id: string, practice_mode = false) =>
    apiCall<Exam>("/exams/", {
      method: "POST",
      body: JSON.stringify({ paper_id, practice_mode }),
    }),

  list: () => apiCall<Exam[]>("/exams/"),

  get: (id: string) => apiCall<Exam>(`/exams/${id}`),

  saveAnswer: (examId: string, question_id: string, answer_text: string) =>
    apiCall(`/exams/${examId}/answer`, {
      method: "PATCH",
      body: JSON.stringify({ question_id, answer_text }),
    }),

  submit: (id: string) =>
    apiCall<{ exam_id: string; status: string; submitted_at: string }>(
      `/exams/${id}/submit`,
      { method: "POST" }
    ),
};

// ── Evaluations ───────────────────────────────────────────────────────────────
export const evaluations = {
  list: () =>
    apiCall<Pick<Evaluation, "id" | "exam_id" | "total_marks" | "scored_marks" | "grade" | "created_at">[]>(
      "/evaluations/"
    ),

  get: (id: string) => apiCall<Evaluation>(`/evaluations/${id}`),

  create: (exam_id: string) =>
    apiCall<Evaluation>("/evaluations/", {
      method: "POST",
      body: JSON.stringify({ exam_id }),
    }),
};

// ── Study ─────────────────────────────────────────────────────────────────────
export const study = {
  topics: () => apiCall<Topic[]>("/study/topics"),

  topic: (id: string) => apiCall<Topic>(`/study/topics/${id}`),

  startSession: (topicId: string) =>
    apiCall<StudySession>(`/study/topics/${topicId}/session`, { method: "POST" }),

  updateSession: (sessionId: string, updates: Partial<StudySession>) =>
    apiCall<StudySession>(`/study/sessions/${sessionId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  flashcards: (topicId: string) =>
    apiCall<Flashcard[]>(`/study/topics/${topicId}/flashcards`),

  generateFlashcards: (topicId: string, count = 10) =>
    apiCall<Flashcard[]>(`/study/topics/${topicId}/flashcards/generate`, {
      method: "POST",
      body: JSON.stringify({ count }),
    }),

  weakAreas: () => apiCall<WeakArea[]>("/study/weak-areas"),

  practiceQuestions: (topicName: string) =>
    apiCall<Question[]>(
      `/study/weak-areas/${encodeURIComponent(topicName)}/practice`,
      { method: "POST" }
    ),
};

// ── Planner ───────────────────────────────────────────────────────────────────
export const planner = {
  get: () => apiCall<RevisionPlan | null>("/planner/"),

  generate: (config: {
    exam_name: string;
    exam_date: string;
    intensity: string;
    material_ids?: string[];
  }) =>
    apiCall<RevisionPlan>("/planner/generate", {
      method: "POST",
      body: JSON.stringify(config),
    }),

  update: (id: string, updates: any) =>
    apiCall<RevisionPlan>(`/planner/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  delete: (id: string) =>
    apiCall(`/planner/${id}`, { method: "DELETE" }),
};
