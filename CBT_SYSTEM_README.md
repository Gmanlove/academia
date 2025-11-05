# CBT (Computer-Based Testing) System for Academia

## Overview
A comprehensive Computer-Based Testing system that allows teachers to create timed exams and students to take them online with automatic grading.

## Features Implemented

### For Teachers
1. **Question Bank Management**
   - Create and organize questions by subject
   - Support for multiple question types:
     - Multiple Choice (auto-graded)
     - True/False (auto-graded)
     - Short Answer (auto-graded with exact match)
     - Essay (manually graded)
   - Set points and difficulty levels
   - Add explanations for correct answers

2. **Exam Creation**
   - Select questions from question banks
   - Set exam duration (timed)
   - Configure passing score
   - Schedule start and end times
   - Options for:
     - Shuffle questions
     - Shuffle answer options
     - Show results immediately
     - Allow exam review
     - Limit number of attempts

3. **Exam Management**
   - Draft, publish, and archive exams
   - Assign to specific classes
   - View student attempts and scores
   - Manual grading for essay questions

### For Students
1. **Exam Taking Interface**
   - **Live Timer**: Countdown timer with auto-submit when time expires
   - **Question Navigation**: Jump to any question, see answered/unanswered status
   - **Auto-Save**: Answers are automatically saved as student types
   - **Progress Tracking**: See how many questions answered
   - **Warning Alerts**: Get notified when time is running low
   - **Auto-Submit**: Exam automatically submits when timer reaches zero

2. **Exam Features**
   - View available exams for your class
   - See exam details (duration, questions, passing score)
   - Take exam with real-time timer
   - Navigate between questions freely
   - Submit when ready or auto-submit on timeout

3. **Results**
   - View scores and percentage
   - See correct/incorrect answers (if allowed by teacher)
   - Review explanations for questions
   - Track attempt history

## Database Schema

### Tables Created
1. **question_banks** - Collections of questions
2. **questions** - Individual questions with options and correct answers
3. **exams** - Exam configurations and settings
4. **exam_questions** - Questions selected for specific exams
5. **exam_attempts** - Student exam sessions with timing
6. **exam_answers** - Individual answers submitted by students

### Auto-Grading System
- Automatic grading for objective questions (multiple choice, true/false, short answer)
- Manual grading workflow for essay questions
- Real-time score calculation
- Pass/fail determination based on passing score

## API Endpoints

### Teacher Endpoints
- `GET/POST /api/cbt/question-banks` - Manage question banks
- `GET/POST/PUT/DELETE /api/cbt/questions` - Manage questions
- `GET/POST/PUT /api/cbt/exams` - Manage exams

### Student Endpoints
- `GET /api/cbt/exams` - View available exams
- `POST /api/cbt/exam-attempts` - Start exam attempt
- `GET /api/cbt/exam-attempts?attempt_id=X` - Get current attempt
- `POST /api/cbt/exam-answers` - Submit/update answers
- `PUT /api/cbt/exam-answers` - Submit entire exam

## Pages Created

### Teacher Pages
- `/teacher/cbt` - CBT dashboard (exams and question banks overview)
- `/teacher/cbt/question-banks/new` - Create question bank
- `/teacher/cbt/question-banks/[id]` - Manage questions in bank
- `/teacher/cbt/exams/new` - Create new exam
- `/teacher/cbt/exams/[id]` - Edit exam and view attempts

### Student Pages
- `/student/cbt` - Available exams list
- `/student/cbt/exam/[id]` - Take exam with timer
- `/student/cbt/results/[attemptId]` - View exam results

## Setup Instructions

### 1. Run Database Migration
```bash
# Apply the CBT migration to your Supabase database
# Run the SQL in: supabase/cbt-migration.sql
```

You can run this via:
1. Supabase Dashboard → SQL Editor → Paste the migration
2. Or use Supabase CLI: `supabase db push`

### 2. Install Dependencies
```bash
npm install @radix-ui/react-radio-group
```

### 3. Update Navigation
Add CBT links to teacher and student sidebars:

**Teacher Sidebar**: Add link to `/teacher/cbt`
**Student Sidebar**: Add link to `/student/cbt`

## How It Works

### Teacher Workflow
1. Create a Question Bank for a subject
2. Add questions to the bank (multiple choice, true/false, etc.)
3. Create an Exam and select questions from the bank
4. Set duration, passing score, and other settings
5. Publish the exam for students to access
6. Monitor student attempts and grade essay questions if needed

### Student Workflow
1. View available exams for their class
2. Click "Start Exam" when ready
3. Answer questions with live timer counting down
4. Navigate between questions freely
5. Submit manually or wait for auto-submit
6. View results immediately (if enabled) or wait for teacher grading

### Timer Features
- **Live Countdown**: Shows minutes:seconds remaining
- **Auto-Save**: Each answer is saved immediately
- **Warning**: Red alert when less than 5 minutes remain
- **Auto-Submit**: Exam automatically submits at 00:00
- **Time Tracking**: Records time spent on each question

## Security Features
- Row Level Security (RLS) policies for all tables
- Teachers can only access their own question banks and exams
- Students can only access exams for their class
- Students can only view their own attempts and answers
- Correct answers hidden during exam (only shown after submission)

## Future Enhancements (Optional)
- [ ] Question randomization from pools
- [ ] Image/media support in questions
- [ ] Proctoring features (webcam, screen recording)
- [ ] Analytics dashboard for teachers
- [ ] Bulk question import from CSV/Excel
- [ ] Question versioning and history
- [ ] Peer review for essay questions
- [ ] Adaptive testing (difficulty adjustment)
- [ ] Practice mode without time limits

## Testing the System

### As Teacher:
1. Go to `/teacher/cbt`
2. Create a new Question Bank
3. Add 5-10 questions
4. Create an Exam and select questions
5. Set duration to 10 minutes
6. Publish the exam

### As Student:
1. Go to `/student/cbt`
2. Find the published exam
3. Click "Start Exam"
4. Observe the timer counting down
5. Answer questions
6. Submit or wait for auto-submit
7. View results

## Notes
- The timer runs client-side but is verified server-side
- Answers are saved immediately as typed (no need to click save)
- Auto-submit happens when timer reaches zero
- Teachers can set multiple attempts if needed
- All objective questions are auto-graded
- Essay questions require manual teacher review

## Support
For issues or questions, check:
- Database logs for RLS policy errors
- Browser console for client-side errors
- Network tab for API call failures
