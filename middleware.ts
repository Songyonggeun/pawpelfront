import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('_ka_au_fo_th_'); // Spring에서 설정한 JWT 쿠키 이름
  const url = request.nextUrl;

  // 로그인 상태인데 /login 접근 → 홈으로 이동
  if (url.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 보호 경로 리스트
  const protectedPaths = ['/myPage', '/admin', '/store/checkout'];
  const isProtectedPath = protectedPaths.some((path) => url.pathname.startsWith(path));
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 감시할 경로 지정
export const config = {
  matcher: [
    '/login',
    '/myPage/:path*',
    '/admin/:path*',
    '/store/checkout',
  ],
};
