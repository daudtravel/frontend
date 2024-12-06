import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export function authMiddleware(request: NextRequest) {
  const sessionToken = request.cookies.get('connect.sid')?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}


export function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  
  if (intlResponse) {
    return intlResponse;
  }
  return authMiddleware(request);
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};