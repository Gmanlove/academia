-- Safe Database Migration for Academia App
-- This script checks for existing objects before creating them

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'parent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE brand_type AS ENUM ('Acme', 'Contoso', 'Globex');
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

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  brand brand_type NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  address text,
  website text,
  created_at timestamp with time zone DEFAULT now(),
  active boolean DEFAULT true,
  plan pricing_plan DEFAULT 'Free',
  max_students integer DEFAULT 100,
  current_student_count integer DEFAULT 0,
  admin_assigned text,
  settings jsonb DEFAULT '{
    "gradingScale": ["A", "B", "C", "D", "E", "F"],
    "terms": ["Term 1", "Term 2", "Term 3"],
    "academicYear": "2024/2025",
    "allowParentAccess": true,
    "smsCredits": 100,
    "maxCA": 30,
    "maxExam": 70,
    "passingGrade": 50,
    "resultVisibility": "Token",
    "notificationChannels": ["Email", "SMS"]
  }'::jsonb
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone_number text,
  photo_url text,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  active boolean DEFAULT true,
  last_login timestamp with time zone,
  qualifications text[],
  experience integer,
  date_joined timestamp with time zone DEFAULT now(),
  specializations text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  level text NOT NULL,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  student_count integer DEFAULT 0,
  capacity integer DEFAULT 30,
  academic_year text DEFAULT '2024/2025',
  term text DEFAULT 'Term 1',
  created_at timestamp with time zone DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code text NOT NULL,
  name text NOT NULL,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  is_core boolean DEFAULT true,
  credit_hours integer DEFAULT 3,
  description text,
  passing_grade integer DEFAULT 50,
  created_at timestamp with time zone DEFAULT now()
);

-- Teacher-subject junction table
CREATE TABLE IF NOT EXISTS teacher_subjects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, subject_id)
);

-- Class-subject junction table
CREATE TABLE IF NOT EXISTS class_subjects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(class_id, subject_id)
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id text NOT NULL,
  name text NOT NULL,
  email text,
  photo_url text,
  date_of_birth date,
  gender text CHECK (gender IN ('Male', 'Female')),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  parent_name text,
  parent_email text,
  parent_phone text,
  secondary_parent_name text,
  secondary_parent_email text,
  secondary_parent_phone text,
  address text,
  enrollment_date timestamp with time zone DEFAULT now(),
  active boolean DEFAULT true,
  last_login timestamp with time zone,
  performance_level performance_level DEFAULT 'Average',
  current_gpa decimal(3,2) DEFAULT 3.0,
  medical_info jsonb,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(student_id, school_id)
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  ca_score integer NOT NULL CHECK (ca_score >= 0 AND ca_score <= 30),
  exam_score integer NOT NULL CHECK (exam_score >= 0 AND exam_score <= 70),
  total_score integer GENERATED ALWAYS AS (ca_score + exam_score) STORED,
  grade text,
  position integer,
  term text NOT NULL,
  session text NOT NULL,
  submitted_at timestamp with time zone DEFAULT now(),
  submitted_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  teacher_remark text,
  created_at timestamp with time zone DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  audience text NOT NULL,
  delivery notification_channel NOT NULL,
  status notification_status DEFAULT 'Scheduled',
  scheduled_for timestamp with time zone,
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Result tokens table
CREATE TABLE IF NOT EXISTS result_tokens (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id text NOT NULL,
  attempts integer DEFAULT 0,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- User profiles table (THIS IS THE CRITICAL ONE!)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  role user_role NOT NULL,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  student_id uuid REFERENCES students(id) ON DELETE SET NULL,
  name text NOT NULL,
  permissions text[] DEFAULT array[]::text[],
  last_login timestamp with time zone,
  email_verified boolean DEFAULT false,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_school_id ON results(school_id);
CREATE INDEX IF NOT EXISTS idx_results_class_id ON results(class_id);
CREATE INDEX IF NOT EXISTS idx_results_subject_id ON results(subject_id);
CREATE INDEX IF NOT EXISTS idx_notifications_school_id ON notifications(school_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Create update function (replace if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create student count function (replace if exists)
CREATE OR REPLACE FUNCTION update_student_counts()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE classes SET student_count = student_count + 1 WHERE id = NEW.class_id;
    UPDATE schools SET current_student_count = current_student_count + 1 WHERE id = NEW.school_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE classes SET student_count = student_count - 1 WHERE id = OLD.class_id;
    UPDATE schools SET current_student_count = current_student_count - 1 WHERE id = OLD.school_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.class_id != NEW.class_id THEN
      UPDATE classes SET student_count = student_count - 1 WHERE id = OLD.class_id;
      UPDATE classes SET student_count = student_count + 1 WHERE id = NEW.class_id;
    END IF;
    IF OLD.school_id != NEW.school_id THEN
      UPDATE schools SET current_student_count = current_student_count - 1 WHERE id = OLD.school_id;
      UPDATE schools SET current_student_count = current_student_count + 1 WHERE id = NEW.school_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then create them
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_student_counts_trigger ON students;
CREATE TRIGGER update_student_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON students
  FOR EACH ROW EXECUTE FUNCTION update_student_counts();

-- Enable RLS (safe to run multiple times)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts, then recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Simplified policies for testing (you can make these more restrictive later)
DROP POLICY IF EXISTS "Allow all authenticated users to read schools" ON schools;
CREATE POLICY "Allow all authenticated users to read schools" ON schools
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all authenticated users to insert into user_profiles" ON user_profiles;
CREATE POLICY "Allow all authenticated users to insert into user_profiles" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Insert a default school for testing
INSERT INTO schools (name, brand, contact_email, contact_phone, address) 
VALUES ('Test School', 'Acme', 'admin@testschool.com', '+1234567890', '123 Test Street')
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Database schema setup completed successfully!' AS status;
