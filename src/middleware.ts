import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

export default clerkMiddleware(
  async (authFn, request) => {
    const url = request.nextUrl;
    const pathName = url.pathname;

    console.log("pathName:", pathName);

    // Fix: Redirect to /home, if the user goes to main page
    if (pathName === "/" || pathName === "/") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (isProtectedRoute(request)) {
      authFn().redirectToSignIn();
    }
  },
  {
    debug: false,
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
