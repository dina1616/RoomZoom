import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/authUtils';

// Define route prefixes based on roles
const ADMIN_ROUTES = ['/admin'];
const LANDLORD_ROUTES = ['/dashboard']; // Assuming dashboard is for landlords
const PROTECTED_ROUTES = ['/profile', '/settings', ...ADMIN_ROUTES, ...LANDLORD_ROUTES]; // Add role-specific routes
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  let userData: { userId: string; email: string; role: string } | null = null;
  if (token) {
    // Explicitly type the expected payload structure
    const decoded = await verifyToken(token);
    if (decoded && typeof decoded === 'object' && decoded.userId && decoded.role) {
       userData = decoded as { userId: string; email: string; role: string };
    }
  }

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isLandlordRoute = LANDLORD_ROUTES.some(route => pathname.startsWith(route));

  // Redirect logged-in users from auth routes
  if (userData && isAuthRoute) {
    // Redirect based on role after login/register attempt
    const redirectUrl = userData.role === 'LANDLORD' ? '/dashboard' : (userData.role === 'ADMIN' ? '/admin' : '/'); // Default redirect for STUDENT etc.
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirect non-logged-in users from protected routes
  if (!userData && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control for logged-in users
  if (userData) {
    // Trying to access admin route without ADMIN role
    if (isAdminRoute && userData.role !== 'ADMIN') {
       console.warn(`RBAC: User ${userData.email} (Role: ${userData.role}) blocked from admin route ${pathname}`);
       return NextResponse.redirect(new URL('/unauthorized', request.url)); // Or redirect to home
    }
    // Trying to access landlord route without LANDLORD role
    if (isLandlordRoute && userData.role !== 'LANDLORD') {
      console.warn(`RBAC: User ${userData.email} (Role: ${userData.role}) blocked from landlord route ${pathname}`);
      return NextResponse.redirect(new URL('/unauthorized', request.url)); // Or redirect to home
    }
  }
  
  // Allow the request to proceed if none of the above conditions met
  return NextResponse.next();
}

// Specify paths middleware should run on
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - images (public image files)
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 