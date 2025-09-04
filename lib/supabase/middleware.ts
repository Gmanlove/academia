import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return { supabase, response: supabaseResponse }
};

export async function updateSession(request: NextRequest) {
  try {
    // Create Supabase client for middleware
    const { supabase, response } = createClient(request)

    // Refresh session if expired - required for Server Components
    const { data: { user } } = await supabase.auth.getUser()

    // Return response with potentially updated cookies
    return response
  } catch (error) {
    // If anything goes wrong, just continue to the requested page
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}
