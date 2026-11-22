import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { normalizeRole, getDefaultHome } from '@/lib/rbac';

/**
 * Konvensi Route Protection & Role Guards (RBAC Proxy / Middleware)
 */
export const proxy = auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const user = req.auth?.user;
  const isAuthenticated = Boolean(user) && req.auth?.error !== 'RefreshTokenError';
  const userRole = user?.role;
  const currentPrefix = normalizeRole(userRole);

  // 1. Rute Tamu: /login atau Root /
  if (pathname === '/login' || pathname === '/') {
    if (isAuthenticated && currentPrefix) {
      const defaultHome = getDefaultHome(currentPrefix);
      return NextResponse.redirect(new URL(defaultHome, req.url));
    }
    // Tamu yang mengakses root diarahkan ke login
    if (!isAuthenticated && pathname === '/') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // 2. Rute Universal: /dashboard -> dialihkan ke rute spesifik role
  if (pathname === '/dashboard') {
    if (isAuthenticated && currentPrefix) {
      return NextResponse.redirect(new URL(getDefaultHome(currentPrefix), req.url));
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', '/dashboard');
    return NextResponse.redirect(loginUrl);
  }

  // 3. Rute Terproteksi Multi-Role: /sales/*, /manager/*, /director/*, /admin/*
  const isSalesRoute = pathname.startsWith('/sales');
  const isManagerRoute = pathname.startsWith('/manager');
  const isDirectorRoute = pathname.startsWith('/director');
  const isAdminRoute = pathname.startsWith('/admin');

  if (isSalesRoute || isManagerRoute || isDirectorRoute || isAdminRoute) {
    // A. Pengguna belum login
    if (!isAuthenticated || !currentPrefix) {
      const loginUrl = new URL('/login', req.url);
      const callbackPath = `${pathname}${nextUrl.search}`;
      loginUrl.searchParams.set('callbackUrl', callbackPath);
      return NextResponse.redirect(loginUrl);
    }

    // B. Pengecekan kecocokan rute dengan role yang dinormalisasi
    const isAuthorized =
      (isSalesRoute && currentPrefix === 'sales') ||
      (isManagerRoute && currentPrefix === 'manager') ||
      (isDirectorRoute && currentPrefix === 'director') ||
      (isAdminRoute && currentPrefix === 'admin');

    // Jika role tidak sesuai rute (contoh: Director buka /sales/*), alihkan ke default home role miliknya
    if (!isAuthorized) {
      return NextResponse.redirect(new URL(getDefaultHome(currentPrefix), req.url));
    }

    // C. Role cocok: teruskan request dan sematkan header identitas role
    const response = NextResponse.next();
    response.headers.set('x-user-role', currentPrefix);
    return response;
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon\\.ico|manifest\\.json|sitemap\\.xml|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
