# 🎓 Academia - Complete School Management System

A comprehensive, modern school management platform built with Next.js 15, React 19, TypeScript, and Supabase.

## ✨ Features

### 👥 User Management
- **Multi-Role System**: Super Admin, School Admin, Teachers, Students, Parents
- **Secure Authentication**: Email verification, password reset, session management
- **Role-Based Access Control**: Strict route protection and permissions
- **User Profiles**: Complete profile management with avatars

### 🏫 School Administration
- **Multi-Tenant Architecture**: Support multiple schools in one system
- **School Settings**: Custom grading scales, terms, academic years
- **Teacher Management**: Employee records, qualifications, assignments
- **Student Management**: Enrollment, class assignments, medical records
- **Class & Subject Management**: Flexible class structures and subject allocation

### 📚 Academic Management
- **Results & Grading**: CA scores, exam marks, grade calculation
- **Attendance Tracking**: Daily attendance with reports and analytics
- **Assignment System**: Create, distribute, and grade assignments
- **Academic Calendar**: Events, holidays, exam schedules

### 💻 CBT (Computer-Based Testing)
- **Question Banks**: Organize questions by subject and difficulty
- **Exam Creation**: Flexible exam builder with multiple question types
- **Auto-Grading**: Instant grading for objective questions
- **Exam Analytics**: Performance reports and statistics
- **Proctoring Features**: Tab detection, time limits, attempt tracking

### 📊 Analytics & Reports
- **Student Performance**: Trend analysis and grade tracking
- **Class Analytics**: Subject distribution and comparison
- **Attendance Reports**: Summary and detailed attendance data
- **Exam Results**: Individual and class performance metrics

### 🔔 Communication
- **Notifications System**: Email, SMS, and in-app notifications
- **Targeted Messaging**: Send to specific classes or user groups
- **Event Announcements**: School-wide or class-specific events

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account and project
- Git

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/academia.git
cd academia
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Database Setup
Run the migration file in your Supabase SQL Editor:

1. Go to your Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/FINAL-MIGRATION.sql`
3. Paste and execute

This will create:
- 24 database tables
- 50+ Row Level Security (RLS) policies
- 15+ database triggers and functions
- Performance indexes

### 5. Create Initial Super Admin (Optional)
After registering your first user, run this in Supabase SQL Editor:

```sql
UPDATE user_profiles 
SET role = 'super_admin' 
WHERE email = 'your-admin-email@example.com';
```

### 6. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
academia/
├── app/                          # Next.js App Router
│   ├── (admin)/                 # Admin routes (protected)
│   │   └── admin/
│   │       ├── dashboard/       # Admin overview
│   │       ├── students/        # Student management
│   │       ├── teachers/        # Teacher management
│   │       ├── classes/         # Class management
│   │       ├── subjects/        # Subject management
│   │       ├── results/         # Results management
│   │       └── analytics/       # School analytics
│   ├── (teacher)/              # Teacher routes (protected)
│   │   └── teacher/
│   │       ├── dashboard/       # Teacher overview
│   │       ├── classes/         # Manage classes
│   │       ├── cbt/            # CBT exam management
│   │       └── scores/         # Enter exam scores
│   ├── (student)/              # Student routes (protected)
│   │   └── student/
│   │       ├── dashboard/       # Student overview
│   │       ├── results/         # View grades
│   │       ├── cbt/            # Take exams
│   │       └── notifications/   # View notifications
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── cbt/               # CBT system endpoints
│   │   ├── classes/           # Class management API
│   │   ├── students/          # Student management API
│   │   └── results/           # Results API
│   ├── auth/                  # Auth pages (login, register)
│   ├── results/               # Public result viewing
│   └── emergency-logout/      # Emergency logout tool
├── components/                 # React components
│   ├── ui/                    # Shadcn UI components
│   ├── charts/                # Chart components
│   ├── auth-guard.tsx         # Route protection
│   ├── supabase-auth-provider.tsx  # Auth context
│   ├── admin-shell.tsx        # Admin layout
│   ├── teacher-shell.tsx      # Teacher layout
│   └── student-shell.tsx      # Student layout
├── lib/                       # Utility functions
│   ├── supabase/             # Supabase clients (client/server)
│   ├── routes.ts             # Route definitions & access control
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Helper functions
├── supabase/                  # Database migrations
│   ├── FINAL-MIGRATION.sql   # Complete database schema
│   └── fix-rls-user-profiles.sql  # RLS policy fixes
├── middleware.ts              # Next.js middleware (auth check)
└── README.md                 # This file
```

## 🔐 Authentication & Security

### Authentication Flow
1. User registers with email and password
2. Email verification sent (via Supabase)
3. User verifies email and logs in
4. Session created with JWT tokens
5. Role-based access control enforced

### Security Features
- ✅ Row Level Security (RLS) on all tables
- ✅ JWT-based authentication
- ✅ HttpOnly cookies for session tokens
- ✅ CSRF protection
- ✅ Role-based route protection via middleware
- ✅ Secure password hashing (bcrypt via Supabase)
- ✅ Email verification required

### Logout System
The app implements a **super aggressive logout** system:
- Clears all client-side storage (localStorage, sessionStorage)
- Deletes all cookies (client and server-side)
- Signs out from Supabase with global scope
- Clears IndexedDB databases
- Forces hard redirect to prevent caching

## 👥 User Roles & Permissions

### Super Admin
- Create and manage schools
- System-wide access
- View all analytics across schools
- Manage system settings

### School Admin
- Manage teachers and students within their school
- Configure school settings (grading, terms, etc.)
- View school-wide reports and analytics
- Manage classes and subjects
- Send notifications

### Teacher
- Manage assigned classes
- Create and grade assignments
- Create and manage CBT exams
- Enter student results (CA and exam scores)
- View class analytics
- Mark attendance

### Student
- View personal dashboard with performance metrics
- Take CBT exams
- Check results and grades
- View attendance records
- Receive and read notifications

### Parent
- View child's performance and grades
- Check attendance records
- Receive notifications about child
- View academic calendar

## 📱 Key Pages

### Public Pages
- `/` - Landing page with feature showcase
- `/auth` - Login & Registration
- `/results/view` - Public result checker (requires token)

### Admin Pages
- `/admin/dashboard` - Admin overview with statistics
- `/admin/students` - Student management (add, edit, view)
- `/admin/teachers` - Teacher management
- `/admin/classes` - Class management
- `/admin/subjects` - Subject management
- `/admin/results` - Results overview and management
- `/admin/analytics` - School-wide analytics
- `/admin/notifications` - Send notifications

### Teacher Pages
- `/teacher/dashboard` - Teacher overview with class stats
- `/teacher/classes` - View and manage assigned classes
- `/teacher/cbt` - Create and manage CBT exams
- `/teacher/cbt/question-banks/new` - Create question banks
- `/teacher/scores/entry` - Enter CA and exam scores

### Student Pages
- `/student/dashboard` - Student overview with performance
- `/student/results` - View all grades and results
- `/student/cbt` - Available exams to take
- `/student/cbt/exam/[id]` - Take an exam
- `/student/notifications` - View notifications
- `/student/history` - Academic history

### Emergency Tools
- `/emergency-logout` - Force logout with visual debugging

## 🧪 Testing Checklist

- [ ] User registration with email verification
- [ ] Login with admin, teacher, student roles
- [ ] Access control (cannot access other role routes)
- [ ] Logout clears session completely
- [ ] Create and edit students
- [ ] Create and edit teachers
- [ ] Create classes and assign subjects
- [ ] Create CBT exam and question bank
- [ ] Take CBT exam as student
- [ ] Enter results (CA and exam scores)
- [ ] View student results
- [ ] Mark attendance
- [ ] Send notifications
- [ ] View analytics dashboards

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Build for Production
```bash
npm run build
npm start
```

## 📚 Documentation

- **QUICK_START.md** - Quick reference guide
- **ARCHITECTURE.md** - System architecture and diagrams
- **ACCESS_CONTROL_GUIDE.md** - Visual access control guide
- **ACCESS_CONTROL_RULES.md** - Detailed permission matrix
- **CBT_SYSTEM_README.md** - CBT system documentation
- **CBT_USER_GUIDE.md** - User guide for CBT
- **DEPLOYMENT_GUIDE.md** - Deployment instructions
- **LOGOUT_FIX_QUICKSTART.md** - Logout troubleshooting guide
- **SYSTEM_OVERVIEW.md** - Complete system overview

## 🐛 Troubleshooting

### Logout Not Working
Visit `/emergency-logout` for visual debugging and force logout with step-by-step logs.

### Database Connection Issues
1. Check Supabase project status in dashboard
2. Verify environment variables in `.env.local`
3. Test connection: `npm run dev` and check console

### RLS Policy Errors
```sql
-- Run in Supabase SQL Editor
-- Check if user_profiles entry exists
SELECT * FROM user_profiles WHERE email = 'your@email.com';

-- If not found, check auth.users
SELECT * FROM auth.users WHERE email = 'your@email.com';

-- Fix RLS with provided script
-- See supabase/fix-rls-user-profiles.sql
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript
npm install -D typescript@latest
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting PR

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Recharts](https://recharts.org/) - Charting library

## 📞 Support

For support:
- Open an issue on GitHub
- Email: support@yourschool.com
- Check documentation in `/docs`

---

**Built with ❤️ for schools worldwide**

Version 1.0.0 | Last Updated: November 2025
