# CBT System - User Guide

## 🎓 For Teachers

### 1. CBT Dashboard
**URL:** `/teacher/cbt`
- View all your exams (draft and published)
- View all your question banks
- Create new question banks and exams

### 2. Create Question Bank
**URL:** `/teacher/cbt/question-banks/new`
- Create a new collection of questions
- Specify subject and description
- After creation, you'll be taken to add questions

### 3. Manage Question Bank
**URL:** `/teacher/cbt/question-banks/[id]`
- Add new questions to the bank
- Edit existing questions
- Delete questions
- Question types supported:
  - Multiple Choice (auto-graded)
  - True/False (auto-graded)
  - Short Answer (auto-graded)
  - Essay (manually graded)

### 4. Create Exam
**URL:** `/teacher/cbt/exams/new`
- Select questions from your question banks
- Set exam duration (timer)
- Set passing score
- Configure exam settings:
  - Shuffle questions
  - Shuffle answer options
  - Show results immediately
  - Allow exam review
  - Maximum attempts
- Schedule start and end times

### 5. Manage Exam
**URL:** `/teacher/cbt/exams/[id]`
- Edit exam settings
- View student attempts
- Publish or unpublish exam
- Grade essay questions manually

---

## 📝 For Students

### 1. Available Exams
**URL:** `/student/cbt`
- See all published exams for your class
- View exam details:
  - Duration
  - Number of questions
  - Passing score
  - Availability status
- Start taking exams

### 2. Take Exam
**URL:** `/student/cbt/exam/[id]` (ALREADY CREATED ✅)
**Features:**
- **Live countdown timer** - shows time remaining
- **Auto-save** - answers saved automatically
- **Question navigation** - jump to any question
- **Progress tracking** - see which questions answered
- **Warning alerts** - red alert when < 5 minutes remain
- **Auto-submit** - exam submits automatically when time expires
- **Answer types:**
  - Multiple choice (radio buttons)
  - True/False (radio buttons)
  - Short answer (text input)
  - Essay (textarea)

### 3. View Results
**URL:** `/student/cbt/results/[attemptId]`
- See your score and percentage
- View correct/incorrect answers (if teacher allows)
- See explanations for questions
- View teacher feedback on essays

---

## 🔄 Complete Workflow

### Teacher Creates Exam:
1. Go to `/teacher/cbt`
2. Click "Create Question Bank"
3. Fill in title and subject
4. Add questions to the bank (multiple choice, true/false, etc.)
5. Click "Create Exam"
6. Select questions from your bank
7. Set duration, passing score, and other settings
8. Publish the exam

### Student Takes Exam:
1. Go to `/student/cbt`
2. See available exams
3. Click "Start Exam"
4. Answer questions with live timer
5. Click "Submit" or wait for auto-submit
6. View results (if allowed by teacher)

---

## 📊 Auto-Grading

The system automatically grades:
- ✅ Multiple choice questions
- ✅ True/False questions
- ✅ Short answer questions (exact match)

Teacher must manually grade:
- 📝 Essay questions

---

## 🗄️ Database Tables

The CBT system uses 6 tables:
1. **question_banks** - Collections of questions
2. **questions** - Individual questions
3. **exams** - Exam configurations
4. **exam_questions** - Questions in specific exams
5. **exam_attempts** - Student exam sessions
6. **exam_answers** - Individual answers

Migration file: `supabase/cbt-migration.sql`

---

## 🚀 Next Steps

1. **Run the database migration:**
   - Go to Supabase Dashboard → SQL Editor
   - Run `supabase/cbt-migration.sql`

2. **Test as Teacher:**
   - Login at `/auth`
   - Go to `/teacher/cbt`
   - Create a question bank
   - Add questions
   - Create and publish an exam

3. **Test as Student:**
   - Login as student
   - Go to `/student/cbt`
   - Take the exam
   - View results

---

## 📁 File Structure

```
app/
  (teacher)/teacher/cbt/
    page.tsx                    # Teacher CBT dashboard
    question-banks/
      new/page.tsx             # Create question bank ✅
      [id]/page.tsx            # Manage questions (to be created)
    exams/
      new/page.tsx             # Create exam (to be created)
      [id]/page.tsx            # Manage exam (to be created)
      
  (student)/student/cbt/
    page.tsx                    # Available exams list ✅
    exam/
      [id]/page.tsx            # Take exam with timer ✅
    results/
      [attemptId]/page.tsx     # View results (to be created)
      
  api/cbt/
    question-banks/route.ts     # CRUD question banks ✅
    questions/route.ts          # CRUD questions ✅
    exams/route.ts             # CRUD exams ✅
    exam-attempts/route.ts      # Start exams ✅
    exam-answers/route.ts       # Submit answers ✅
```

---

## ✅ What's Already Done

- ✅ Database schema with 6 tables
- ✅ All 5 API endpoints
- ✅ Teacher CBT dashboard
- ✅ Student exam-taking interface with timer
- ✅ Student available exams list
- ✅ Teacher create question bank page
- ✅ Auto-grading system
- ✅ Auto-submit on timer expiry

## 🔨 Still To Create

- ⏳ Question management page (add/edit questions)
- ⏳ Exam creation wizard
- ⏳ Exam management page
- ⏳ Student results viewing page
- ⏳ Teacher manual grading interface for essays

---

## 🎯 Quick Links

**For Teachers:**
- Dashboard: http://localhost:3000/teacher/cbt
- Create Question Bank: http://localhost:3000/teacher/cbt/question-banks/new

**For Students:**
- Available Exams: http://localhost:3000/student/cbt

**Admin:**
- Login: http://localhost:3000/auth
- Fix Profile: http://localhost:3000/emergency-fix.html
