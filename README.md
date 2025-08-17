# Academia - School Management System

A comprehensive school management system built with Next.js 15, React 19, TypeScript, and Supabase.

## Features

### 🎓 Multi-Role Dashboard System
- **Admin Dashboard**: Complete school oversight and management
- **Teacher Portal**: Class management, grade entry, and analytics
- **Student Portal**: Results viewing, assignments, and progress tracking

### 📊 Advanced Analytics
- Real-time performance tracking
- Interactive charts and visualizations
- Comparative analysis (class, school, national averages)
- AI-powered insights and recommendations

### 🔐 Secure Authentication
- Role-based access control
- Supabase authentication integration
- Session management and security

### 📱 Modern UI/UX
- Responsive design with Tailwind CSS
- shadcn/ui component library
- Dark/light theme support
- Mobile-first approach

### 🎯 Key Modules
- **Student Management**: Registration, profiles, and tracking
- **Teacher Management**: Staff profiles and class assignments
- **Class Management**: Course creation and student enrollment
- **Results Management**: Secure result viewing and sharing
- **Notification System**: Real-time updates and communications
- **Analytics Dashboard**: Performance insights and reporting

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/academia.git
   cd academia
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   \`\`\`

4. **Set up Supabase Database**
   
   Run the SQL scripts in the `supabase/` directory to set up your database schema:
   \`\`\`sql
   -- Run schema.sql first
   -- Then run safe-migration.sql
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   pnpm dev
   \`\`\`

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
academia/
├── app/                          # Next.js 15 App Router
│   ├── (admin)/                  # Admin dashboard routes
│   ├── (teacher)/                # Teacher portal routes
│   ├── (student)/                # Student portal routes
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   └── results/                  # Results viewing system
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── charts/                   # Chart components
│   └── ...                       # Custom components
├── lib/                          # Utility functions and configurations
│   ├── supabase/                 # Supabase client configurations
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions
├── supabase/                     # Database schema and migrations
├── public/                       # Static assets
└── styles/                       # Global styles
\`\`\`

## Key Features Breakdown

### Admin Dashboard
- **School Overview**: Real-time statistics and metrics
- **Student Management**: Add, edit, and track student records
- **Teacher Management**: Staff profiles and assignments
- **Class Management**: Course creation and enrollment
- **Analytics**: Comprehensive performance insights
- **Notifications**: System-wide communication tools

### Teacher Portal
- **Class Analytics**: Detailed performance tracking
- **Grade Entry**: Secure score input and management
- **Student Insights**: Individual progress monitoring
- **Report Generation**: Automated report creation
- **Communication**: Parent-teacher interaction tools

### Student Portal
- **Results Viewing**: Secure access to academic results
- **Progress Tracking**: Personal performance analytics
- **Assignment Management**: Task tracking and submissions
- **Notifications**: Important updates and announcements

### Results System
- **Secure Access**: Time-limited, authenticated result viewing
- **Comprehensive Display**: Detailed performance breakdown
- **Print/Share Options**: PDF generation and secure sharing
- **Audit Trail**: Access logging and security measures

## Database Schema

The system uses a PostgreSQL database with the following main tables:

- `user_profiles`: User authentication and profile data
- `schools`: School information and settings
- `students`: Student records and academic information
- `teachers`: Teacher profiles and assignments
- `classes`: Course and class management
- `results`: Academic results and grades
- `notifications`: System notifications and communications

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Session validation

### Data Management
- `GET /api/students` - Fetch students
- `POST /api/students` - Create student
- `GET /api/teachers` - Fetch teachers
- `GET /api/classes` - Fetch classes
- `GET /api/results` - Fetch results
- `GET /api/notifications` - Fetch notifications

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start the production server**
   \`\`\`bash
   npm start
   \`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Site URL for redirects | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@academia.com or join our Slack channel.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
