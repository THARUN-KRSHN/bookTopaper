-- ============================================================
-- BookToPaper — Migration 001: Initial Schema
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  default_format TEXT DEFAULT 'ktu',
  default_marks  INT DEFAULT 100,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 2. Materials
CREATE TABLE IF NOT EXISTS materials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  filename      TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  file_type     TEXT,
  status        TEXT DEFAULT 'uploaded',  -- uploaded | processing | ready | error
  topic_count   INT DEFAULT 0,
  raw_text      TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 3. Topics
CREATE TABLE IF NOT EXISTS topics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id   UUID REFERENCES materials(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  subtopics     JSONB DEFAULT '[]',
  difficulty    TEXT DEFAULT 'medium',   -- easy | medium | hard
  content       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 4. Papers
CREATE TABLE IF NOT EXISTS papers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title         TEXT,
  material_ids  UUID[],
  format        TEXT,                    -- ktu | cbse | custom
  total_marks   INT,
  duration_mins INT,
  difficulty    JSONB,                   -- {easy: 30, medium: 50, hard: 20}
  sections      JSONB DEFAULT '[]',      -- [{name, rules, questions:[]}]
  pdf_path      TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 5. Exams
CREATE TABLE IF NOT EXISTS exams (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  paper_id      UUID REFERENCES papers(id),
  status        TEXT DEFAULT 'in_progress',  -- in_progress | submitted
  started_at    TIMESTAMPTZ DEFAULT now(),
  submitted_at  TIMESTAMPTZ,
  answers       JSONB DEFAULT '[]',           -- [{question_id, answer_text, updated_at}]
  practice_mode BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 6. Evaluations
CREATE TABLE IF NOT EXISTS evaluations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id       UUID REFERENCES exams(id),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_marks   INT,
  scored_marks  FLOAT,
  grade         TEXT,
  breakdown     JSONB DEFAULT '[]',   -- [{question_id, question_text, user_answer, ai_feedback, marks_awarded, max_marks, topic}]
  topic_scores  JSONB DEFAULT '[]',   -- [{topic, score, max}]
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 7. Study Sessions
CREATE TABLE IF NOT EXISTS study_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id      UUID REFERENCES topics(id),
  phase         TEXT DEFAULT 'learn',  -- learn | recall | test
  completed     BOOLEAN DEFAULT false,
  score         JSONB,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 8. Flashcards
CREATE TABLE IF NOT EXISTS flashcards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id      UUID REFERENCES topics(id) ON DELETE CASCADE,
  front         TEXT NOT NULL,
  back          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 9. Revision Plans
CREATE TABLE IF NOT EXISTS revision_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exam_name     TEXT,
  exam_date     DATE,
  intensity     TEXT DEFAULT 'moderate',   -- light | moderate | intensive
  plan          JSONB DEFAULT '[]',         -- [{date, topics:[], duration, type: study|revision|rest}]
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── Indexes for common query patterns ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_materials_user_id ON materials(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_material_id ON topics(material_id);
CREATE INDEX IF NOT EXISTS idx_papers_user_id ON papers(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_user_id ON exams(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_paper_id ON exams(paper_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_exam_id ON evaluations(exam_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_topic_id ON flashcards(topic_id);
CREATE INDEX IF NOT EXISTS idx_revision_plans_user_id ON revision_plans(user_id);
