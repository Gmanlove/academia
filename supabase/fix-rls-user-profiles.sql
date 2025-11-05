-- Fix RLS policies for user_profiles table
-- This allows users to read their own profile without hanging

-- Drop and recreate the SELECT policy with better performance
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT 
  USING (id = auth.uid());

-- Also add a policy for service role to bypass RLS
DROP POLICY IF EXISTS "Service role can manage all profiles" ON user_profiles;
CREATE POLICY "Service role can manage all profiles" ON user_profiles
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- Make sure the INSERT policy allows creating profiles
DROP POLICY IF EXISTS "Allow all authenticated users to insert into user_profiles" ON user_profiles;
CREATE POLICY "Users can create their own profile" ON user_profiles
  FOR INSERT 
  WITH CHECK (id = auth.uid() OR auth.jwt()->>'role' = 'service_role');

-- Allow updates
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE 
  USING (id = auth.uid() OR auth.jwt()->>'role' = 'service_role');

-- Check if any orphaned auth users exist without profiles
SELECT 
  au.id,
  au.email,
  CASE WHEN up.id IS NULL THEN 'NO PROFILE' ELSE 'HAS PROFILE' END as status
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC
LIMIT 10;
