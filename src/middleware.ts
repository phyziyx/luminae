import { NextRequest, NextResponse } from "next/server";
import type { Session } from "@/lib/auth/auth";
import { betterFetch } from "@better-fetch/fetch";
import { cache } from "react";

const publicRoutes = ["/"];
const authRoutes = ["/sign-in", "/sign-up", "/accept-invitation"];
const passwordRoutes = ["/forgot-password", "/reset-password"];
const adminRoutes = ["/admin-dashboard"];

const getSession = cache(async (request: NextRequest) => {
  return await betterFetch<Session>("/api/auth/get-session", {
    baseURL: process.env.BETTER_AUTH_URL,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });
});

export default async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  const isAdminRoute = adminRoutes.includes(pathName);
  const isPublicRoute = publicRoutes.includes(pathName);

  console.log(`[${request.method}] ${pathName}`);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const { data: session } = await getSession(request);

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

// TODO: Implement proper matcher
// - Add skipping for api/auth routes

export const config = {
  matcher: [
    // Skip Next.js internals, api, and all static files, unless found in search params
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run
    // "/api(.*)",
    "/trpc(.*)",
  ],
};
