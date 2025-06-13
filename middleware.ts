// middleware.ts (Next.js 프로젝트 루트에 생성)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('_ka_au_fo_th_'); // Spring에서 설정한 JWT 쿠키 이름
  const url = request.nextUrl;

  // 로그인 상태인데 /login 페이지 접근 시 → 홈으로 이동
  if (url.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login'], // 이 경로만 감시
};
