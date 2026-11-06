import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { type UserRole } from '@/types/user.types';

/**
 * Normalisasi role backend/DB ke prefix rute App Router
 */
function getRolePrefix(role?: string): 'sales' | 'manager' | 'director' | null {
  if (!role) return null;
  if (role === 'sales') return 'sales';
  if (role === 'sales_manager' || role === 'manager') return 'manager';
  if (role === 'director') return 'director';
  return null;
}

/**
 * Mendapatkan rute default home berdasarkan role pengguna
 */
function getDefaultHome(role?: UserRole | string): string {
  const prefix = getRolePrefix(role);
  switch (prefix) {
    case 'sales':
      return '/sales/kanban';
    case 'manager':
      return '/manager/kanban';
    case 'director':
      return '/director/dashboard';
    default:
      return '/login';
  }
}

/**
 * Konvensi Next.js 16: Proxy handler untuk proteksi rute RBAC
 */
export const proxy = auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const user = req.auth?.user;
  const isAuthenticated = Boolean(user);
  const userRole = user?.role;

  // 1. Rute Tamu: /login atau Root /
  if (pathname === '/login' || pathname === '/') {
    if (isAuthenticated && userRole) {
      const defaultHome = getDefaultHome(userRole);
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
    if (isAuthenticated && userRole) {
      return NextResponse.redirect(new URL(getDefaultHome(userRole), req.url));
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', '/dashboard');
    return NextResponse.redirect(loginUrl);
  }

  // 3. Rute Terproteksi Multi-Role: /sales/*, /manager/*, /director/*
  const isSalesRoute = pathname.startsWith('/sales');
  const isManagerRoute = pathname.startsWith('/manager');
  const isDirectorRoute = pathname.startsWith('/director');

  if (isSalesRoute || isManagerRoute || isDirectorRoute) {
    // A. Pengguna belum login
    if (!isAuthenticated || !userRole) {
      const loginUrl = new URL('/login', req.url);
      const callbackPath = `${pathname}${nextUrl.search}`;
      loginUrl.searchParams.set('callbackUrl', callbackPath);
      return NextResponse.redirect(loginUrl);
    }

    const currentPrefix = getRolePrefix(userRole);

    // B. Pengecekan kecocokan rute dengan role
    const isAuthorized =
      (isSalesRoute && currentPrefix === 'sales') ||
      (isManagerRoute && currentPrefix === 'manager') ||
      (isDirectorRoute && currentPrefix === 'director');

    // Jika role tidak sesuai rute, alihkan ke default home role miliknya
    if (!isAuthorized) {
      return NextResponse.redirect(new URL(getDefaultHome(userRole), req.url));
    }

    // C. Role cocok: teruskan request dan sematkan header identitas role
    const response = NextResponse.next();
    response.headers.set('x-user-role', userRole);
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

