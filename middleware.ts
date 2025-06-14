import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the token from cookies or localStorage (in client-side)
  const token = request.cookies.get('token')?.value

  // Define public paths that don't require authentication
  const publicPaths = ['/landing', '/login', '/signup', '/oauthCallback']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Check if the request is for the root path
  const isRootPath = request.nextUrl.pathname === '/'

  // If there's no token and the user is trying to access a protected route
  if (!token && !isPublicPath) {
    // Redirect to landing page
    return NextResponse.redirect(new URL('/landing', request.url))
  }

  // If there's a token and the user is trying to access login/signup
  if (token && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
