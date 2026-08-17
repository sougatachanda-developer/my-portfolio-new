import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Block /admin and /api/cms in production deployments with a 404 Not Found
  if (process.env.NODE_ENV === 'production') {
    if (pathname.startsWith('/admin')) {
      return NextResponse.rewrite(new URL('/_not-found', request.url));
    }
  }

  // 2. Refresh Supabase auth session and get authenticated user
  const { supabaseResponse, user } = await updateSession(request);

  // 3. Route Protection: Redirect unauthenticated requests to /admin to /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // 4. Redirect logged-in user away from /admin/login to /admin
  if (pathname.startsWith('/admin/login') && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files, image optimization, favicon, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
