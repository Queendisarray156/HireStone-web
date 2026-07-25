import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get("jb_role")?.value;
  const token = req.cookies.get("jb_token")?.value;

  const isAuthed = Boolean(token && role);

  if (pathname.startsWith("/dashboard/candidate") && (!isAuthed || role !== "candidate")) {
    return NextResponse.redirect(new URL("/login?role=candidate", req.url));
  }
  if (pathname.startsWith("/dashboard/employer") && (!isAuthed || role !== "employer")) {
    return NextResponse.redirect(new URL("/login?role=employer", req.url));
  }
  if (pathname.startsWith("/admin") && (!isAuthed || role !== "admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
