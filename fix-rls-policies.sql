-- Temporary solution for RLS issues
-- Run this in your Supabase SQL editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create more permissive policies for testing
CREATE POLICY "Allow authenticated users to view profiles" ON user_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- For debugging, also allow service role full access
CREATE POLICY "Service role full access" ON user_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
