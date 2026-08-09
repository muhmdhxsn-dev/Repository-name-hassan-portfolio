import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApiPath = pathname.startsWith("/api/admin");

  if (isAdminPath || isAdminApiPath) {
    if (pathname === "/admin/login" || pathname === "/login") {
      const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      if (token) {
        try {
          await verifyAdminToken(token);
          return NextResponse.redirect(new URL("/admin", request.url));
        } catch {
          const response = NextResponse.next();
          response.cookies.delete(ADMIN_SESSION_COOKIE);
          return response;
        }
      }
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!token) {
      if (isAdminApiPath) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await verifyAdminToken(token);
      return NextResponse.next();
    } catch {
      if (isAdminApiPath) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(ADMIN_SESSION_COOKIE);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
