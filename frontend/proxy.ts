import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const hostProtectedPatterns = [/^\/dashboard(\/.*)?$/, /^\/quiz(\/.*)?$/];
const publicPatterns = [/^\/$/, /^\/dang-nhap$/, /^\/dang-ky$/, /^\/tham-gia$/, /^\/phong\/[a-zA-Z0-9_-]+\/cho$/, /^\/phong\/[a-zA-Z0-9_-]+\/game$/, /^\/phong\/[a-zA-Z0-9_-]+\/ket-thuc$/];

function matches(pathname: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(pathname));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (matches(pathname, publicPatterns)) {
    return NextResponse.next();
  }

  if (matches(pathname, hostProtectedPatterns) && !accessToken) {
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
