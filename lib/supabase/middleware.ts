import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect resident portal routes
  if (
    request.nextUrl.pathname.startsWith('/resident') &&
    !request.nextUrl.pathname.startsWith('/resident/login') &&
    !request.nextUrl.pathname.startsWith('/resident/register') &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/resident/login'
    return NextResponse.redirect(url)
  }

  // Protect official portal routes
  if (
    request.nextUrl.pathname.startsWith('/official') &&
    !request.nextUrl.pathname.startsWith('/official/login') &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/official/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access login pages, redirect to dashboard
  if (user) {
    const userRole = user.user_metadata?.role
    
    if (request.nextUrl.pathname === '/resident/login' || request.nextUrl.pathname === '/resident/register') {
      if (userRole === 'resident') {
        const url = request.nextUrl.clone()
        url.pathname = '/resident'
        return NextResponse.redirect(url)
      }
    }
    
    if (request.nextUrl.pathname === '/official/login') {
      if (userRole === 'official') {
        const url = request.nextUrl.clone()
        url.pathname = '/official'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
