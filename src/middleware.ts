import createMiddleware from 'next-intl/middleware';

// This middleware intercepts requests for internationalized routes
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'ar'],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en'
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 