import { NextResponse, type NextRequest } from "next/server";

const ADMIN_AUTH_COOKIE = "invorights_admin_token";
const USER_AUTH_COOKIE = "invorights_user_token";
const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/forgot-password"]);
const AUTH_PATHS = new Set(["/login", "/signup", "/forgot-password", "/reset-password"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasAdminSession = Boolean(request.cookies.get(ADMIN_AUTH_COOKIE)?.value);
  const hasUserSession = Boolean(request.cookies.get(USER_AUTH_COOKIE)?.value);
  const isPublicAdminRoute = PUBLIC_ADMIN_PATHS.has(pathname);
  const isCustomerAppRoute = pathname === "/app" || pathname.startsWith("/app/");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isCustomerAppRoute && (hasAdminSession || !hasUserSession)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/app") {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  if (AUTH_PATHS.has(pathname) && hasAdminSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (AUTH_PATHS.has(pathname) && hasUserSession) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  if (isAdminRoute) {
    if (hasUserSession) {
      return NextResponse.redirect(new URL("/app/dashboard", request.url));
    }

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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/app", "/app/:path*", "/login", "/signup", "/forgot-password", "/reset-password"],
};
