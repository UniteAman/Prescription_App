import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/profile') || req.nextUrl.pathname.startsWith('/appointments');
  const isRoot = req.nextUrl.pathname === '/';

  // Redirect to login if trying to access dashboard without being logged in
  if (isDashboardPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to appointments if trying to access auth pages while logged in
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/appointments', req.nextUrl));
  }

  // Redirect to login if accessing root without being logged in
  if (isRoot && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to appointments if accessing root while logged in
  if (isRoot && isLoggedIn) {
    return NextResponse.redirect(new URL('/appointments', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
