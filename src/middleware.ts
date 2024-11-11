import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  /* Pages */
  // TODO: REMEMBER TO UNCOMMENT THIS LINE
  // "/dashboard(.*)",
  "/forum(.*)",
  /* API - Clerk Webhook */
  "/api/clerk",
]);

export default clerkMiddleware(
  async (auth, request) => {
    const resolvedAuth = await auth();
    const isLoggedIn = resolvedAuth.userId;

    const url = request.nextUrl;
    const pathName = url.pathname;

    console.log("pathName:", pathName);

    if (!isLoggedIn && isProtectedRoute(request)) {
      resolvedAuth.redirectToSignIn();
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
