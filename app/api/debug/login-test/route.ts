import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG LOGIN TEST ===');
    
    // Test 1: Parse request body
    let body;
    try {
      body = await request.json();
      console.log('✅ Request body parsed:', body);
    } catch (error) {
      console.error('❌ Failed to parse request body:', error);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { email, password } = body;
    console.log('✅ Extracted credentials:', { email: !!email, password: !!password });

    if (!email || !password) {
      console.log('❌ Missing credentials');
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Test 2: Create Supabase client
    let supabase;
    try {
      supabase = await createClient();
      console.log('✅ Supabase client created');
    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Test 3: Attempt login
    console.log('🔐 Attempting login for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Supabase auth error:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 401 });
    }

    if (!data.user) {
      console.log('❌ No user returned');
      return NextResponse.json({ error: 'No user data returned' }, { status: 401 });
    }

    console.log('✅ Login successful:', data.user.id);

    // Test 4: Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile fetch error:', profileError);
      return NextResponse.json({ 
        error: 'Failed to fetch profile',
        details: profileError
      }, { status: 500 });
    }

    console.log('✅ Profile fetched:', profile);

    return NextResponse.json({
      success: true,
      message: 'Login test completed successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        profile
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
