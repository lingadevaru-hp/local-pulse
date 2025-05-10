
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/', // Home page is public
  '/sign-in(.*)', // Clerk sign-in routes
  '/sign-up(.*)', // Clerk sign-up routes
  '/api/(.*)', // Allow public API routes (adjust if needed)
  '/manifest.json',
  '/sw.js',
  '/icons/(.*)',
  '/favicon.ico',
  // Add any other specific public pages like /about, /contact, /terms, /privacy if they exist as separate pages
  // '/about', 
  // '/contact',
  // '/terms',
  // '/privacy',
]);

// Example of explicitly protecting routes.
// By default, all routes not listed in isPublicRoute are protected.
// const isProtectedRoute = createRouteMatcher([
//   '/profile(.*)',
//   '/organizer(.*)',
//   '/events/create(.*)', 
// ]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return; // Allow access to public routes without authentication
  }
  
  // For any other route not listed in isPublicRoute, require authentication.
  auth().protect();

  // If you had specific protected routes defined and wanted different logic:
  // if (isProtectedRoute(req)) {
  //   auth().protect(); 
  // }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
