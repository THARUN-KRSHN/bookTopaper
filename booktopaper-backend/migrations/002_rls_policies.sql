-- ============================================================
-- BookToPaper — Migration 002: Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable RLS on all user-scoped tables
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics          ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams           ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards      ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_plans  ENABLE ROW LEVEL SECURITY;

-- ── Profiles ──────────────────────────────────────────────────────────────────
CREATE POLICY "users see own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- ── Materials ─────────────────────────────────────────────────────────────────
CREATE POLICY "users see own materials"
  ON materials FOR ALL
  USING (auth.uid() = user_id);

-- ── Topics: readable if the parent material belongs to the user ───────────────
CREATE POLICY "users see own topics"
  ON topics FOR ALL
  USING (
    material_id IN (
      SELECT id FROM materials WHERE user_id = auth.uid()
    )
  );

-- ── Papers ────────────────────────────────────────────────────────────────────
CREATE POLICY "users see own papers"
  ON papers FOR ALL
  USING (auth.uid() = user_id);

-- ── Exams ─────────────────────────────────────────────────────────────────────
CREATE POLICY "users see own exams"
  ON exams FOR ALL
  USING (auth.uid() = user_id);

-- ── Evaluations ───────────────────────────────────────────────────────────────
CREATE POLICY "users see own evaluations"
  ON evaluations FOR ALL
  USING (auth.uid() = user_id);

-- ── Study Sessions ────────────────────────────────────────────────────────────
CREATE POLICY "users see own study sessions"
  ON study_sessions FOR ALL
  USING (auth.uid() = user_id);

-- ── Flashcards: readable if topic belongs to user ─────────────────────────────
CREATE POLICY "users see own flashcards"
  ON flashcards FOR ALL
  USING (
    topic_id IN (
      SELECT t.id FROM topics t
      JOIN materials m ON m.id = t.material_id
      WHERE m.user_id = auth.uid()
    )
  );

-- ── Revision Plans ────────────────────────────────────────────────────────────
CREATE POLICY "users see own revision plans"
  ON revision_plans FOR ALL
  USING (auth.uid() = user_id);

-- ── Service role bypass (used by Flask backend) ───────────────────────────────
-- The Supabase Service Role key bypasses RLS automatically.
-- This is expected behaviour — the Flask backend uses service role for all DB ops.
-- Never expose the service role key to the frontend.
