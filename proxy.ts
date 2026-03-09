import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /admin/* (except /admin/login) → /admin/login
  // Final auth enforced client-side via sessionStorage;
  // this prevents direct bookmark/URL access.
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
