
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/', // Home page
  '/sign-in(.*)', // Clerk sign-in routes
  '/sign-up(.*)', // Clerk sign-up routes
  '/api/(.*)', // Allow public API routes (adjust if needed)
  '/manifest.json',
  '/sw.js',
  '/icons/(.*)',
  '/favicon.ico',
]);

// Define protected routes that require authentication
// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)',
//   '/profile(.*)',
//   '/events/create(.*)', 
//   // Add other routes that need protection
// ]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return; // Allow access to public routes
  }

  // For any other route, require authentication
  auth().protect();

  // Example for specifically protecting routes if needed:
  // if (isProtectedRoute(req)) {
  //   auth().protect();
  // }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
