import { NextRequest, NextResponse } from "next/server";
import type { Session } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";

const publicRoutes = ["/"];
const authRoutes = ["/sign-in", "/sign-up", "/accept-invitation"];
const passwordRoutes = ["/forgot-password", "/reset-password"];
const adminRoutes = ["/admin-dashboard"];

export default async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  const isAdminRoute = adminRoutes.includes(pathName);
  const isPublicRoute = publicRoutes.includes(pathName);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!session) {
    if (isAuthRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }

  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // if (!isAdminRoute && session.user.role !== "user") {
  //   return NextResponse.next();
  // }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     // Skip Next.js internals, api/auth and all static files, unless found in search params
//     "/((?!api/auth|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

export const config = {
  matcher: [
    // Skip Next.js internals, api/auth, and all static files, unless found in search params
    "/((?!api/auth|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes (excluding api/auth)
    "/api/:path*",
    "/trpc(.*)",
  ],
};
