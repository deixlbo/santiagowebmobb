import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Redirect based on user role
      const role = data.user.user_metadata?.role
      if (role === 'official' || role === 'admin') {
        return NextResponse.redirect(`${origin}/official`)
      }
      return NextResponse.redirect(`${origin}/resident`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
