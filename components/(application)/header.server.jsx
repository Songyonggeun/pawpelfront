// app/components/Header.server.jsx
import React from 'react';
import HeaderClient from './header.client';
import { cookies } from 'next/headers';

async function fetchUserInfo(cookieHeader) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
      headers: {
        cookie: cookieHeader || '',
      },
      // 서버 fetch에는 credentials 옵션 안 써요
    });

    if (!res.ok) {
      return { roles: [] };
    }

    const data = await res.json();
    return { roles: data.roles || [] };
  } catch (err) {
    console.error('유저 정보 조회 실패:', err);
    return { roles: [] };
  }
}

export default async function Header() {
  // next/headers의 cookies() 사용해서 쿠키 가져오기 (Next.js 13+)
  const cookieStore = cookies();
  const jwtCookie = cookieStore.get('_ka_au_fo_th_');
  const isLoggedIn = Boolean(jwtCookie);
  const cookieHeader = jwtCookie ? `_ka_au_fo_th_=${jwtCookie.value}` : '';

  let userRoles = [];
  if (isLoggedIn) {
    const userInfo = await fetchUserInfo(cookieHeader);
    userRoles = userInfo.roles;
  }

  return <HeaderClient isLoggedIn={isLoggedIn} userRoles={userRoles} />;
}
