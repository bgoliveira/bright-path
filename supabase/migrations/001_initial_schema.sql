-- BrightPath Initial Schema
-- Run this in Supabase SQL Editor or via migrations

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent')),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  google_refresh_token TEXT,
  google_access_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student-Parent relationships
CREATE TABLE IF NOT EXISTS public.student_parent_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, parent_id)
);

-- Google Classroom courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  google_course_id TEXT NOT NULL,
  name TEXT NOT NULL,
  section TEXT,
  description_heading TEXT,
  room TEXT,
  teacher_name TEXT,
  enrollment_code TEXT,
  course_state TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, google_course_id)
);

-- Assignments from Google Classroom
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  google_assignment_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  due_time TIME,
  max_points DECIMAL(10, 2),
  assignment_type TEXT,
  work_type TEXT DEFAULT 'assignment',
  materials JSONB,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, google_assignment_id)
);

-- Student submissions and grades
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  state TEXT,
  assigned_grade DECIMAL(10, 2),
  draft_grade DECIMAL(10, 2),
  late BOOLEAN DEFAULT FALSE,
  submission_history JSONB,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Smart Start recommendations
CREATE TABLE IF NOT EXISTS public.assignment_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommended_start_date DATE NOT NULL,
  complexity_score INTEGER CHECK (complexity_score BETWEEN 1 AND 10),
  estimated_hours DECIMAL(5, 2),
  reasoning TEXT,
  priority_rank INTEGER,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- BC Report Cards (manual entry + parsed PDFs)
CREATE TABLE IF NOT EXISTS public.report_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_year TEXT NOT NULL,
  term TEXT NOT NULL,
  report_date DATE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual subject grades from report cards
CREATE TABLE IF NOT EXISTS public.report_card_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_card_id UUID NOT NULL REFERENCES public.report_cards(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  letter_grade TEXT,
  percentage DECIMAL(5, 2),
  teacher_name TEXT,
  teacher_comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weakness detection analysis
CREATE TABLE IF NOT EXISTS public.subject_weaknesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  weakness_level TEXT CHECK (weakness_level IN ('low', 'medium', 'high')),
  avg_grade DECIMAL(5, 2),
  recent_trend TEXT CHECK (recent_trend IN ('improving', 'stable', 'declining')),
  evidence JSONB,
  recommendations TEXT[],
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject_name)
);

-- Student progress snapshots (for trend analysis)
CREATE TABLE IF NOT EXISTS public.progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_assignments INTEGER,
  completed_assignments INTEGER,
  completion_rate DECIMAL(5, 2),
  avg_grade DECIMAL(5, 2),
  overdue_count INTEGER,
  upcoming_count INTEGER,
  by_subject JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_courses_student_id ON public.courses(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_student_id ON public.assignment_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON public.assignment_recommendations(student_id, priority_rank);
CREATE INDEX IF NOT EXISTS idx_student_parent_links_student ON public.student_parent_links(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_links_parent ON public.student_parent_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_report_cards_student_id ON public.report_cards(student_id);
CREATE INDEX IF NOT EXISTS idx_weaknesses_student_id ON public.subject_weaknesses(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_snapshots_student_id ON public.progress_snapshots(student_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parent_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_card_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_weaknesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_snapshots ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Student-Parent Links: Students and parents can view their own links
CREATE POLICY "View own student-parent links" ON public.student_parent_links
  FOR SELECT USING (auth.uid() = student_id OR auth.uid() = parent_id);

CREATE POLICY "Parents can create links" ON public.student_parent_links
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Students can update link status" ON public.student_parent_links
  FOR UPDATE USING (auth.uid() = student_id);

-- Courses: Students see their own, parents see linked children's
CREATE POLICY "Students view own courses" ON public.courses
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.student_parent_links
      WHERE student_id = courses.student_id
      AND parent_id = auth.uid()
      AND status = 'accepted'
    )
  );

CREATE POLICY "Students manage own courses" ON public.courses
  FOR ALL USING (auth.uid() = student_id);

-- Assignments: View through course access
CREATE POLICY "View assignments through course" ON public.assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = assignments.course_id
      AND (
        courses.student_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.student_parent_links
          WHERE student_parent_links.student_id = courses.student_id
          AND student_parent_links.parent_id = auth.uid()
          AND student_parent_links.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Students manage assignments" ON public.assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = assignments.course_id
      AND courses.student_id = auth.uid()
    )
  );

-- Submissions: Same pattern
CREATE POLICY "View own submissions" ON public.submissions
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.student_parent_links
      WHERE student_parent_links.student_id = submissions.student_id
      AND student_parent_links.parent_id = auth.uid()
      AND student_parent_links.status = 'accepted'
    )
  );

CREATE POLICY "Students manage own submissions" ON public.submissions
  FOR ALL USING (auth.uid() = student_id);

-- Recommendations: Same pattern
CREATE POLICY "View own recommendations" ON public.assignment_recommendations
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.student_parent_links
      WHERE student_parent_links.student_id = assignment_recommendations.student_id
      AND student_parent_links.parent_id = auth.uid()
      AND student_parent_links.status = 'accepted'
    )
  );

CREATE POLICY "Students manage own recommendations" ON public.assignment_recommendations
  FOR ALL USING (auth.uid() = student_id);

-- Report cards: Same pattern
CREATE POLICY "View own report cards" ON public.report_cards
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.student_parent_links
      WHERE student_parent_links.student_id = report_cards.student_id
      AND student_parent_links.parent_id = auth.uid()
      AND student_parent_links.status = 'accepted'
    )
  );

CREATE POLICY "Students manage own report cards" ON public.report_cards
  FOR ALL USING (auth.uid() = student_id);

-- Report card grades
CREATE POLICY "View report card grades" ON public.report_card_grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.report_cards
      WHERE report_cards.id = report_card_grades.report_card_id
      AND (
        report_cards.student_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.student_parent_links
          WHERE student_parent_links.student_id = report_cards.student_id
          AND student_parent_links.parent_id = auth.uid()
          AND student_parent_links.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Students manage report card grades" ON public.report_card_grades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.report_cards
      WHERE report_cards.id = report_card_grades.report_card_id
      AND report_cards.student_id = auth.uid()
    )
  );

-- Subject weaknesses
CREATE POLICY "View own weaknesses" ON public.subject_weaknesses
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.student_parent_links
      WHERE student_parent_links.student_id = subject_weaknesses.student_id
      AND student_parent_links.parent_id = auth.uid()
      AND student_parent_links.status = 'accepted'
    )
  );

CREATE POLICY "Students manage own weaknesses" ON public.subject_weaknesses
  FOR ALL USING (auth.uid() = student_id);

-- Progress snapshots
CREATE POLICY "View own progress" ON public.progress_snapshots
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.student_parent_links
      WHERE student_parent_links.student_id = progress_snapshots.student_id
      AND student_parent_links.parent_id = auth.uid()
      AND student_parent_links.status = 'accepted'
    )
  );

CREATE POLICY "Students manage own progress" ON public.progress_snapshots
  FOR ALL USING (auth.uid() = student_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON public.assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_cards_updated_at
    BEFORE UPDATE ON public.report_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create bucket for report card PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-cards', 'report-cards', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage
CREATE POLICY "Students can upload own report cards" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'report-cards' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can view own report cards" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'report-cards' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
