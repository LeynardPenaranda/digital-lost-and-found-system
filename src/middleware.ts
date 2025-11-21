// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoute = createRouteMatcher([
  "/",
  "/admin/:path*",
  "/user-messages/:path*",
  "/lost-items/:path*",
  "/found-items/:path*",
  "/report-items/:path*",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Skip sign-in & sign-up pages
  if (
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up")
  ) {
    return NextResponse.next();
  }

  // Redirect if user is not logged in
  if (protectedRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/admin/:path*",
    "/user-messages/:path*",
    "/lost-items/:path*",
    "/found-items/:path*",
    "/report-items/:path*",
  ], // middleware only applies to these
};
