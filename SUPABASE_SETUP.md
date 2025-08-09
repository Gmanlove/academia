# Academia App - Supabase Setup Instructions

## Database Setup

1. **Run the database schema in your Supabase SQL Editor:**
   - Go to your Supabase dashboard → SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Click "Run" to create all tables, indexes, and policies

2. **Configure Row Level Security (RLS):**
   - The schema automatically enables RLS on all tables
   - Review and adjust policies in the Supabase dashboard if needed

## Environment Variables

Make sure your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Authentication Setup

1. **Configure Supabase Auth:**
   - Go to Authentication → Settings in your Supabase dashboard
   - Enable email authentication
   - Set up email templates if needed

2. **Create your first admin user:**
   - Go to Authentication → Users in Supabase dashboard
   - Click "Create user"
   - Add email and password
   - After creating, go to your `user_profiles` table and add a record:
     ```sql
     INSERT INTO user_profiles (id, email, role, name, permissions, email_verified, status)
     VALUES (
       'user_id_from_auth_users',
       'admin@example.com',
       'admin',
       'Admin User',
       ARRAY['read', 'write', 'delete', 'manage_users', 'manage_schools', 'view_analytics'],
       true,
       'active'
     );
     ```

## Features Migrated to Supabase

✅ **Database Layer:**
- All tables created with proper relationships
- Row Level Security (RLS) enabled
- Automatic triggers for student counts
- Indexes for performance

✅ **API Routes:**
- `/api/students` - CRUD operations for students
- `/api/students/import` - Bulk import functionality
- `/api/schools` - School management
- `/api/notifications` - Notification system
- `/api/token` - Result access tokens
- `/api/auth/*` - Authentication endpoints

✅ **Authentication:**
- Supabase Auth integration
- User profiles with roles and permissions
- Protected routes with middleware

✅ **Frontend:**
- Updated components to use Supabase data
- Real-time subscriptions ready
- Auth provider with proper session management

## Removed Mock Dependencies

The following mock data files are no longer used:
- `lib/mock-db.ts` (replaced with `lib/supabase-db.ts`)
- Old auth system in `components/auth-provider.tsx`

## Next Steps

1. **Test the application:**
   ```bash
   pnpm dev
   ```

2. **Create your first school:**
   - Use the admin interface to add schools
   - Add classes and subjects
   - Import or add students

3. **Customize as needed:**
   - Adjust RLS policies for your specific requirements
   - Add more tables/features as needed
   - Configure email templates in Supabase

## Database Schema Overview

- **schools** - School information and settings
- **teachers** - Teacher profiles and assignments
- **students** - Student records and performance
- **classes** - Class/classroom management
- **subjects** - Subject definitions
- **results** - Academic results and grades
- **notifications** - Communication system
- **result_tokens** - Public result access tokens
- **user_profiles** - User authentication and roles

The app is now a fully functional, real full-stack application with Supabase!
