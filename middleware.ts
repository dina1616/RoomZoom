import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/authUtils';

// Define route prefixes based on roles
const ADMIN_ROUTES = ['/admin', '/[locale]/admin'];
const LANDLORD_ROUTES = ['/dashboard', '/[locale]/dashboard']; // Assuming dashboard is for landlords
const PROTECTED_ROUTES = ['/profile', '/settings', '/[locale]/profile', '/[locale]/settings', ...ADMIN_ROUTES, ...LANDLORD_ROUTES]; // Add role-specific routes
const AUTH_ROUTES = ['/login', '/register', '/[locale]/login', '/[locale]/register'];

// Helper to determine if path matches any of the patterns
const isPathMatching = (path: string, patterns: string[]): boolean => {
  // For dynamic locale routes, extract locale and check if the rest matches
  if (path.startsWith('/')) {
    const parts = path.split('/');
    if (parts.length >= 3) {
      // Check if it's a locale path like /en/profile
      const withoutLocale = `/${parts.slice(2).join('/')}`;
      if (patterns.includes(withoutLocale)) {
        return true;
      }
    }
  }
  
  // Direct pattern check
  return patterns.some(pattern => {
    // For exact patterns
    if (!pattern.includes('[locale]')) {
      return path === pattern || path.startsWith(`${pattern}/`);
    }
    
    // For [locale] patterns, replace [locale] with a regex for any locale
    const regexPattern = pattern.replace('[locale]', '[a-z]{2}');
    const regex = new RegExp(`^${regexPattern}(/.*)?$`);
    return regex.test(path);
  });
};

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

  const isAuthRoute = isPathMatching(pathname, AUTH_ROUTES);
  const isProtectedRoute = isPathMatching(pathname, PROTECTED_ROUTES);
  const isAdminRoute = isPathMatching(pathname, ADMIN_ROUTES);
  const isLandlordRoute = isPathMatching(pathname, LANDLORD_ROUTES);

  // Get the locale from the path if present
  const locale = pathname.split('/')[1]?.length === 2 ? pathname.split('/')[1] : '';
  const localePath = locale ? `/${locale}` : '';

  // Redirect logged-in users from auth routes
  if (userData && isAuthRoute) {
    // Redirect based on role after login/register attempt
    const redirectUrl = userData.role === 'LANDLORD' 
      ? `${localePath}/dashboard` 
      : (userData.role === 'ADMIN' ? `${localePath}/admin` : `${localePath}`);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirect non-logged-in users from protected routes
  if (!userData && isProtectedRoute) {
    const loginUrl = new URL(`${localePath}/login`, request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control for logged-in users
  if (userData) {
    // Trying to access admin route without ADMIN role
    if (isAdminRoute && userData.role !== 'ADMIN') {
       console.warn(`RBAC: User ${userData.email} (Role: ${userData.role}) blocked from admin route ${pathname}`);
       return NextResponse.redirect(new URL(`${localePath}/unauthorized`, request.url));
    }
    // Trying to access landlord route without LANDLORD role
    if (isLandlordRoute && userData.role !== 'LANDLORD') {
      console.warn(`RBAC: User ${userData.email} (Role: ${userData.role}) blocked from landlord route ${pathname}`);
      return NextResponse.redirect(new URL(`${localePath}/unauthorized`, request.url));
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