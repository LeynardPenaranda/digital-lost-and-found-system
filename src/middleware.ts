import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Define which routes are protected
const isProtectedRoute = createRouteMatcher([
  "/", // protect homepage
  "/dashboard(.*)", // protect all /dashboard routes
  "/chat(.*)", // protect chat routes
  "/profile(.*)", // protect profile routes
  "/user(.*)", // protect normal user routes
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If route is protected and no user is logged in
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Otherwise, allow the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
