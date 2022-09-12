import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { nanoid } from "nanoid";

export function middleware(request: NextRequest) {
  if (request.cookies.get("poll-token")) return;

  const cookie = nanoid();
  const response = NextResponse.next();

  response.cookies.set("poll-token", cookie, { sameSite: "strict" });
  return response;
}

export const config = {
  matcher: "/question/:path*",
};
