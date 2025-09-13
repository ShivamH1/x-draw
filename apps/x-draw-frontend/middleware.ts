import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/api', // API routes
    '/canvas',
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If it's a public route, continue
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies or headers
  // Since you're using localStorage, we'll rely on client-side protection
  // But you could add server-side token validation here if needed
  
  const token = request.cookies.get('authToken')?.value;
  
  if (!token) {
    // Redirect to login if no token found
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to specific routes
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
};
