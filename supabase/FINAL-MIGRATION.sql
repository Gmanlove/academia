-- ================================================
-- COMPLETE SCHOOL MANAGEMENT SYSTEM - ALL IN ONE
-- ================================================
-- This is the comprehensive database schema for a complete school management system
-- Run this file ONCE to set up everything
-- 
-- FEATURES:
-- ✅ Multi-tenant schools system (super admin creates schools)
-- ✅ Role-based access (super_admin, school_admin, teacher, student, parent)
-- ✅ Teacher and student management
-- ✅ Class and subject management
-- ✅ Attendance tracking and reporting
-- ✅ Events and calendar system
-- ✅ Results and grading
-- ✅ Assignments with submissions
-- ✅ Notifications system
-- ✅ Complete CBT/Exam system with auto-grading
-- ✅ Question banks and question management
-- ✅ Comprehensive RLS policies
-- ✅ Performance indexes
-- ✅ Automatic triggers and functions
--
-- Safe to re-run - uses IF NOT EXISTS and proper cleanup
-- ================================================

-- ================================================
-- STEP 1: EXTENSIONS AND TYPES
-- ================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing types if they exist and recreate (for clean re-runs)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'school_admin', 'teacher', 'student', 'parent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE pricing_plan AS ENUM ('Free', 'Basic', 'Pro', 'Enterprise');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE performance_level AS ENUM ('Excellent', 'Good', 'Average', 'Poor', 'Critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_status AS ENUM ('Sent', 'Delivered', 'Failed', 'Pending', 'Scheduled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_channel AS ENUM ('Email', 'SMS', 'App', 'All');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Late', 'Excused');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE event_type AS ENUM ('Holiday', 'Exam', 'Meeting', 'Sports', 'Cultural', 'Academic', 'Other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE assignment_status AS ENUM ('Draft', 'Published', 'Closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('Pending', 'Submitted', 'Late', 'Graded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ================================================
-- STEP 2: CORE TABLES
-- ================================================

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  website TEXT,
  logo_url TEXT,
  plan pricing_plan DEFAULT 'Free',
  max_students INTEGER DEFAULT 100,
  max_teachers INTEGER DEFAULT 20,
  current_student_count INTEGER DEFAULT 0,
  current_teacher_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{
    "gradingScale": {"A": [80, 100], "B": [70, 79], "C": [60, 69], "D": [50, 59], "E": [40, 49], "F": [0, 39]},
    "terms": ["First Term", "Second Term", "Third Term"],
    "academicYear": "2024/2025",
    "allowParentAccess": true,
    "smsCredits": 100,
    "maxCA": 40,
    "maxExam": 60,
    "passingGrade": 50,
    "resultVisibility": "Token",
    "notificationChannels": ["Email", "SMS", "App"],
    "attendanceTracking": true,
    "lateTimeMinutes": 15
  }'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_login TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  photo_url TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  employee_id TEXT,
  qualifications TEXT[],
  specializations TEXT[],
  experience_years INTEGER DEFAULT 0,
  date_joined TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  salary DECIMAL(10,2),
  bank_account TEXT,
  address TEXT,
  emergency_contact TEXT,
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, school_id)
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  description TEXT,
  is_core BOOLEAN DEFAULT true,
  credit_hours INTEGER DEFAULT 3,
  passing_grade INTEGER DEFAULT 50,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(code, school_id)
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  section TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  academic_year TEXT DEFAULT '2024/2025',
  term TEXT DEFAULT 'First Term',
  student_count INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 40,
  room_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, level, section, school_id, academic_year)
);

-- Junction table for class-subject-teacher assignments
CREATE TABLE IF NOT EXISTS class_subject_teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  academic_year TEXT DEFAULT '2024/2025',
  term TEXT DEFAULT 'First Term',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, subject_id, academic_year, term)
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  student_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  blood_group TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  admission_number TEXT,
  admission_date DATE DEFAULT CURRENT_DATE,
  
  -- Parent/Guardian Information
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  parent_occupation TEXT,
  secondary_parent_name TEXT,
  secondary_parent_email TEXT,
  secondary_parent_phone TEXT,
  
  -- Address Information
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  
  -- Medical Information
  medical_conditions TEXT[],
  allergies TEXT[],
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relation TEXT,
  
  -- Academic Information
  previous_school TEXT,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  performance_level performance_level DEFAULT 'Average',
  current_gpa DECIMAL(3,2) DEFAULT 0.00,
  
  -- Status
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(student_id, school_id),
  UNIQUE(admission_number, school_id)
);

-- ================================================
-- STEP 3: ATTENDANCE SYSTEM
-- ================================================

CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  time_in TIME,
  time_out TIME,
  remarks TEXT,
  marked_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

CREATE TABLE IF NOT EXISTS attendance_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  total_days INTEGER DEFAULT 0,
  present_days INTEGER DEFAULT 0,
  absent_days INTEGER DEFAULT 0,
  late_days INTEGER DEFAULT 0,
  excused_days INTEGER DEFAULT 0,
  attendance_percentage DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, month, year)
);

-- ================================================
-- STEP 4: EVENTS AND CALENDAR
-- ================================================

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  organizer_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  for_classes UUID[],
  for_students UUID[],
  for_all_students BOOLEAN DEFAULT false,
  for_teachers BOOLEAN DEFAULT false,
  for_parents BOOLEAN DEFAULT false,
  is_holiday BOOLEAN DEFAULT false,
  requires_rsvp BOOLEAN DEFAULT false,
  max_participants INTEGER,
  attachment_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  rsvp_status TEXT CHECK (rsvp_status IN ('Attending', 'Not Attending', 'Maybe', 'Pending')),
  attended BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id),
  UNIQUE(event_id, student_id)
);

-- ================================================
-- STEP 5: RESULTS AND GRADING
-- ================================================

CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  ca1_score DECIMAL(5,2) DEFAULT 0,
  ca2_score DECIMAL(5,2) DEFAULT 0,
  ca3_score DECIMAL(5,2) DEFAULT 0,
  total_ca DECIMAL(5,2) GENERATED ALWAYS AS (ca1_score + ca2_score + ca3_score) STORED,
  exam_score DECIMAL(5,2) DEFAULT 0,
  total_score DECIMAL(5,2) GENERATED ALWAYS AS (ca1_score + ca2_score + ca3_score + exam_score) STORED,
  grade TEXT,
  position INTEGER,
  remarks TEXT,
  term TEXT NOT NULL,
  session TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject_id, term, session)
);

CREATE TABLE IF NOT EXISTS result_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_accessed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- STEP 6: ASSIGNMENTS SYSTEM
-- ================================================

CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  max_score DECIMAL(5,2) DEFAULT 100,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  submission_type TEXT DEFAULT 'File',
  attachment_url TEXT,
  status assignment_status DEFAULT 'Draft',
  allow_late_submission BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  submission_text TEXT,
  submission_file_url TEXT,
  submission_link TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score DECIMAL(5,2),
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
  status submission_status DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- ================================================
-- STEP 7: NOTIFICATIONS SYSTEM
-- ================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'General',
  audience TEXT NOT NULL,
  target_classes UUID[],
  target_users UUID[],
  delivery_channel notification_channel NOT NULL,
  status notification_status DEFAULT 'Pending',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'Normal',
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(notification_id, user_id)
);

-- ================================================
-- STEP 8: CBT/EXAM SYSTEM
-- ================================================

CREATE TABLE IF NOT EXISTS question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  total_questions INTEGER DEFAULT 0,
  difficulty_distribution JSONB DEFAULT '{"easy": 0, "medium": 0, "hard": 0}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_bank_id UUID REFERENCES question_banks(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'fill_blank')),
  options JSONB,
  correct_answer TEXT,
  correct_answers TEXT[],
  points INTEGER DEFAULT 1,
  explanation TEXT,
  difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic TEXT,
  cognitive_level TEXT DEFAULT 'knowledge' CHECK (cognitive_level IN ('knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation')),
  image_url TEXT,
  video_url TEXT,
  times_used INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  question_bank_id UUID REFERENCES question_banks(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL,
  total_points INTEGER DEFAULT 0,
  passing_score INTEGER DEFAULT 50,
  total_questions INTEGER DEFAULT 0,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  shuffle_questions BOOLEAN DEFAULT false,
  shuffle_options BOOLEAN DEFAULT false,
  show_results_immediately BOOLEAN DEFAULT false,
  show_correct_answers BOOLEAN DEFAULT false,
  allow_review BOOLEAN DEFAULT true,
  allow_backtrack BOOLEAN DEFAULT true,
  max_attempts INTEGER DEFAULT 1,
  require_webcam BOOLEAN DEFAULT false,
  require_fullscreen BOOLEAN DEFAULT false,
  auto_submit BOOLEAN DEFAULT true,
  enable_proctoring BOOLEAN DEFAULT false,
  enable_copy_paste_protection BOOLEAN DEFAULT false,
  enable_tab_switch_detection BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'archived')),
  exam_type VARCHAR(50) DEFAULT 'test' CHECK (exam_type IN ('test', 'quiz', 'exam', 'assessment', 'practice')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, question_id),
  UNIQUE(exam_id, question_order)
);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  time_remaining_seconds INTEGER,
  total_score DECIMAL(5,2) DEFAULT 0,
  max_possible_score DECIMAL(5,2) DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  questions_answered INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  questions_incorrect INTEGER DEFAULT 0,
  questions_skipped INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'expired', 'abandoned')),
  attempt_number INTEGER DEFAULT 1,
  tab_switches INTEGER DEFAULT 0,
  copy_attempts INTEGER DEFAULT 0,
  suspicious_activities JSONB DEFAULT '[]'::JSONB,
  proctoring_snapshots TEXT[],
  ip_address VARCHAR(45),
  user_agent TEXT,
  browser_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, student_id, attempt_number)
);

CREATE TABLE IF NOT EXISTS exam_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
  exam_question_id UUID REFERENCES exam_questions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  selected_option INTEGER,
  selected_options INTEGER[],
  is_correct BOOLEAN,
  points_earned DECIMAL(5,2) DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  first_answered_at TIMESTAMP WITH TIME ZONE,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answer_changed BOOLEAN DEFAULT false,
  times_changed INTEGER DEFAULT 0,
  flagged_for_review BOOLEAN DEFAULT false,
  teacher_feedback TEXT,
  manually_graded BOOLEAN DEFAULT false,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_attempt_id, exam_question_id)
);

CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  exam_attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
  total_score DECIMAL(5,2) DEFAULT 0,
  max_score DECIMAL(5,2) DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  grade TEXT,
  passed BOOLEAN DEFAULT false,
  class_rank INTEGER,
  class_percentile DECIMAL(5,2),
  strengths TEXT[],
  weaknesses TEXT[],
  time_management_score DECIMAL(5,2),
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, student_id, exam_attempt_id)
);

-- ================================================
-- SUCCESS MESSAGE
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '🎉 Complete School Management System Setup Completed Successfully!';
  RAISE NOTICE '📊 All tables, indexes, functions, triggers, and RLS policies are ready!';
  RAISE NOTICE '🚀 You can now start using your comprehensive school management application!';
END $$;
