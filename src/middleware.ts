import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoute = createRouteMatcher([
  "/admin/:path*",
  "/user-messages/:path*",
  "/lost-items/:path*",
  "/found-items/:path*",
  "/report-items/:path*",
  "/banned-users/:path*",
  "/home/:path*",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // Pages to skip auth
  const skipPages = ["/sign-in", "/sign-up", "/sign-in/factor-one", "/sign-in/redirect"];

  const skipClerkInternal = pathname.includes("SignIn_clerk_catchall_check");

  if (skipPages.some((p) => pathname.startsWith(p)) || skipClerkInternal) {
    return NextResponse.next();
  }

  // Only redirect if accessing protected route AND user is not logged in
  if (protectedRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
    "/user-messages/:path*",
    "/lost-items/:path*",
    "/found-items/:path*",
    "/report-items/:path*",
    "/banned-users/:path*",
    "/home/:path*",
  ],
};
