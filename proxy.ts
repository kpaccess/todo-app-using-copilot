import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
  // Check if the path is login or register page
  const { pathname } = request.nextUrl;

  if (pathname === "/login" || pathname === "/register") {
    // Check if user is already authenticated
    const user = await verifyToken(request);
    if (user) {
      // Redirect authenticated users away from login/register pages
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // For all other routes, check authentication
  const user = await verifyToken(request);

  if (!user) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except static files and api routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
