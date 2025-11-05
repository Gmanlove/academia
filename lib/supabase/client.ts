// Use the official browser client from supabase-js for client-side usage.
import { createClient as createBrowserSupabaseClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Singleton instance to prevent multiple clients
let supabaseInstance: SupabaseClient | null = null

export const createClient = () => {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL=${Boolean(
        supabaseUrl
      )}, NEXT_PUBLIC_SUPABASE_ANON_KEY=${Boolean(supabaseKey)}`
    )
  }

  // Create and cache the instance
  supabaseInstance = createBrowserSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  })

  console.log('✅ Supabase client instance created')
  
  return supabaseInstance
}
