import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get("jwt")?.value;
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (!jwt && pathname.startsWith("/protected")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (jwt && (pathname === "/login" || pathname === "/register")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*", "/login", "/register"],
};
