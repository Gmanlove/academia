-- Database schema for Academia App

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('admin', 'teacher', 'student', 'parent');
create type brand_type as enum ('Acme', 'Contoso', 'Globex');
create type pricing_plan as enum ('Free', 'Basic', 'Pro', 'Enterprise');
create type performance_level as enum ('Excellent', 'Good', 'Average', 'Poor', 'Critical');
create type notification_status as enum ('Sent', 'Delivered', 'Failed', 'Pending', 'Scheduled');
create type notification_channel as enum ('Email', 'SMS', 'App', 'All');

-- Schools table
create table schools (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  brand brand_type not null,
  contact_email text not null,
  contact_phone text,
  address text,
  website text,
  created_at timestamp with time zone default now(),
  active boolean default true,
  plan pricing_plan default 'Free',
  max_students integer default 100,
  current_student_count integer default 0,
  admin_assigned text,
  settings jsonb default '{
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
create table teachers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique not null,
  phone_number text,
  photo_url text,
  school_id uuid references schools(id) on delete cascade,
  active boolean default true,
  last_login timestamp with time zone,
  qualifications text[],
  experience integer,
  date_joined timestamp with time zone default now(),
  specializations text[],
  created_at timestamp with time zone default now()
);

-- Classes table
create table classes (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- e.g. "JSS 1A"
  level text not null, -- e.g. "JSS 1"
  school_id uuid references schools(id) on delete cascade,
  teacher_id uuid references teachers(id) on delete set null,
  student_count integer default 0,
  capacity integer default 30,
  academic_year text default '2024/2025',
  term text default 'Term 1',
  created_at timestamp with time zone default now()
);

-- Subjects table
create table subjects (
  id uuid default uuid_generate_v4() primary key,
  code text not null, -- e.g. "MTH"
  name text not null, -- e.g. "Mathematics"
  school_id uuid references schools(id) on delete cascade,
  is_core boolean default true,
  credit_hours integer default 3,
  description text,
  passing_grade integer default 50,
  created_at timestamp with time zone default now()
);

-- Junction table for teacher-subject relationships
create table teacher_subjects (
  id uuid default uuid_generate_v4() primary key,
  teacher_id uuid references teachers(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  unique(teacher_id, subject_id)
);

-- Junction table for class-subject relationships
create table class_subjects (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references classes(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  unique(class_id, subject_id)
);

-- Students table
create table students (
  id uuid default uuid_generate_v4() primary key,
  student_id text not null,
  name text not null,
  email text,
  photo_url text,
  date_of_birth date,
  gender text check (gender in ('Male', 'Female')),
  school_id uuid references schools(id) on delete cascade,
  class_id uuid references classes(id) on delete set null,
  parent_name text,
  parent_email text,
  parent_phone text,
  secondary_parent_name text,
  secondary_parent_email text,
  secondary_parent_phone text,
  address text,
  enrollment_date timestamp with time zone default now(),
  active boolean default true,
  last_login timestamp with time zone,
  performance_level performance_level default 'Average',
  current_gpa decimal(3,2) default 3.0,
  medical_info jsonb,
  created_at timestamp with time zone default now(),
  unique(student_id, school_id)
);

-- Results table
create table results (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references students(id) on delete cascade,
  school_id uuid references schools(id) on delete cascade,
  class_id uuid references classes(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  ca_score integer not null check (ca_score >= 0 and ca_score <= 30),
  exam_score integer not null check (exam_score >= 0 and exam_score <= 70),
  total_score integer generated always as (ca_score + exam_score) stored,
  grade text,
  position integer,
  term text not null,
  session text not null, -- e.g. "2024/2025"
  submitted_at timestamp with time zone default now(),
  submitted_by uuid references teachers(id) on delete set null,
  teacher_remark text,
  created_at timestamp with time zone default now()
);

-- Notifications table
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text not null,
  school_id uuid references schools(id) on delete cascade,
  audience text not null, -- 'all', 'teachers', 'students', 'parents'
  delivery notification_channel not null,
  status notification_status default 'Scheduled',
  scheduled_for timestamp with time zone,
  sent_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  created_by uuid -- could reference teachers or admin
);

-- Tokens table for result access
create table result_tokens (
  id uuid default uuid_generate_v4() primary key,
  student_id text not null, -- This is the public student_id, not the UUID
  attempts integer default 0,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- User profiles table (extends Supabase auth.users)
create table user_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role user_role not null,
  school_id uuid references schools(id) on delete cascade,
  teacher_id uuid references teachers(id) on delete set null,
  student_id uuid references students(id) on delete set null,
  name text not null,
  permissions text[] default array[]::text[],
  last_login timestamp with time zone,
  email_verified boolean default false,
  status text default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_students_school_id on students(school_id);
create index idx_students_class_id on students(class_id);
create index idx_students_student_id on students(student_id);
create index idx_teachers_school_id on teachers(school_id);
create index idx_classes_school_id on classes(school_id);
create index idx_subjects_school_id on subjects(school_id);
create index idx_results_student_id on results(student_id);
create index idx_results_school_id on results(school_id);
create index idx_results_class_id on results(class_id);
create index idx_results_subject_id on results(subject_id);
create index idx_notifications_school_id on notifications(school_id);
create index idx_user_profiles_school_id on user_profiles(school_id);
create index idx_user_profiles_role on user_profiles(role);

-- Create functions for automatic updates
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger update_user_profiles_updated_at
  before update on user_profiles
  for each row execute function update_updated_at_column();

-- Function to update student count when students are added/removed
create or replace function update_student_counts()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    -- Update class count
    update classes set student_count = student_count + 1 where id = new.class_id;
    -- Update school count
    update schools set current_student_count = current_student_count + 1 where id = new.school_id;
    return new;
  elsif TG_OP = 'DELETE' then
    -- Update class count
    update classes set student_count = student_count - 1 where id = old.class_id;
    -- Update school count
    update schools set current_student_count = current_student_count - 1 where id = old.school_id;
    return old;
  elsif TG_OP = 'UPDATE' then
    -- If class changed, update both old and new class counts
    if old.class_id != new.class_id then
      update classes set student_count = student_count - 1 where id = old.class_id;
      update classes set student_count = student_count + 1 where id = new.class_id;
    end if;
    -- If school changed, update both old and new school counts
    if old.school_id != new.school_id then
      update schools set current_student_count = current_student_count - 1 where id = old.school_id;
      update schools set current_student_count = current_student_count + 1 where id = new.school_id;
    end if;
    return new;
  end if;
  return null;
end;
$$ language plpgsql;

-- Create triggers for student count updates
create trigger update_student_counts_trigger
  after insert or update or delete on students
  for each row execute function update_student_counts();

-- Row Level Security (RLS) policies
alter table schools enable row level security;
alter table teachers enable row level security;
alter table classes enable row level security;
alter table subjects enable row level security;
alter table students enable row level security;
alter table results enable row level security;
alter table notifications enable row level security;
alter table result_tokens enable row level security;
alter table user_profiles enable row level security;

-- Policies for user_profiles
create policy "Users can view their own profile" on user_profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on user_profiles
  for update using (auth.uid() = id);

-- Policies for schools (admins can see all, others see their own school)
create policy "Admins can view all schools" on schools
  for select using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can view their own school" on schools
  for select using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and school_id = schools.id
    )
  );

-- Policies for other tables
create policy "Teachers can view their school data" on teachers
  for select using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and school_id = teachers.school_id
    )
  );

create policy "Students can view their school data" on students
  for select using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and school_id = students.school_id
    )
  );

create policy "Users can view their school classes" on classes
  for select using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and school_id = classes.school_id
    )
  );

create policy "Users can view their school subjects" on subjects
  for select using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and school_id = subjects.school_id
    )
  );

create policy "Users can view their school results" on results
  for select using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and school_id = results.school_id
    )
  );

create policy "Users can view their school notifications" on notifications
  for select using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and school_id = notifications.school_id
    )
  );

-- Admin policies for insert/update/delete
create policy "Admins can manage all data" on schools
  for all using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "School admins can manage their school" on teachers
  for all using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and (role = 'admin' or school_id = teachers.school_id)
    )
  );

create policy "School users can manage their school data" on students
  for all using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and (role = 'admin' or school_id = students.school_id)
    )
  );
