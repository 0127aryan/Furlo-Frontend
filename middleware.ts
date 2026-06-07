import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected route prefixes that require authentication
const PROTECTED_PREFIXES = ['/feed', '/onboarding', '/settings', '/notifications', '/admin', '/reports']

// Auth routes that should redirect to feed if already logged in
const AUTH_ROUTES = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for the session cookie set by our backend API (furlo_session)
  const sessionToken = request.cookies.get('furlo_session')?.value

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route)

  // 1. If accessing a protected route without a valid session token, redirect to login
  if (isProtected && !sessionToken) {
    const loginUrl = new URL('/login', request.url)
    // Optional: preserve the original path to redirect back after successful login
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. If already logged in and attempting to visit login/signup, redirect to /feed
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  return NextResponse.next()
}

// Config to specify on which paths the middleware should execute
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (internal or proxied API routes)
     * - _next/static (Next.js static files)
     * - _next/image (Next.js image optimization)
     * - favicon.ico, logo.png, and other assets with extensions (e.g. .svg, .jpg, .png)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\..*).*)',
  ],
}
