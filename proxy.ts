import { NextResponse, type NextRequest } from "next/server";

const ADMIN_AUTH_COOKIE = "invozy_admin_token";
const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/forgot-password"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasAdminSession = Boolean(request.cookies.get(ADMIN_AUTH_COOKIE)?.value);
  const isPublicAdminRoute = PUBLIC_ADMIN_PATHS.has(pathname);

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL(hasAdminSession ? "/admin/dashboard" : "/admin/login", request.url));
  }

  if (!hasAdminSession && !isPublicAdminRoute) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (hasAdminSession && isPublicAdminRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
