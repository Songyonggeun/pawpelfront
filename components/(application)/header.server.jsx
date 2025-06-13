// app/components/Header.server.jsx
import React from 'react';
import HeaderClient from './header.client';
import { headers } from 'next/headers';

async function fetchUserInfo(cookieHeader) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!res.ok) return { roles: [] };
    const data = await res.json();
    return { roles: data.roles || [] };
  } catch (err) {
    console.error('유저 정보 조회 실패:', err);
    return { roles: [] };
  }
}``

export default async function Header() {
  const headerList = await headers(); // ✅ await 추가!
  const cookieHeader = headerList.get('cookie') || '';

  const isLoggedIn = cookieHeader.includes('_ka_au_fo_th_');
  let userRoles = [];

  if (isLoggedIn) {
    const userInfo = await fetchUserInfo(cookieHeader);
    userRoles = userInfo.roles;
  }

  return <HeaderClient isLoggedIn={isLoggedIn} userRoles={userRoles} />;
}
