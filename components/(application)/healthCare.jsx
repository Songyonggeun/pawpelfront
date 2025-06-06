'use client';

import { useEffect, useState } from 'react';

export default function HealthCareMenu() {
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!res.ok) return; // 비로그인 시 처리
        const data = await res.json();
        setUserRoles(data.roles || []);
      } catch (err) {
        console.error('유저 정보 조회 실패:', err);
      }
    };
    fetchUserInfo();
  }, []);

  const isVetOrAdmin = userRoles.includes('VET') || userRoles.includes('ADMIN');

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 text-sm text-gray-600 p-4 max-w-[1100px] mx-auto">
      <ul className="flex flex-col md:flex-row gap-8">
        <li><a href="/health/home" className="hover:underline block">건강홈</a></li>
        <li><a href="/health/guide" className="hover:underline block">건강검진 가이드</a></li>
        <li><a href="/health/check/select" className="hover:underline block">건강체크</a></li>
        <li><a href="/health/vaccine/select" className="hover:underline block">접종체크</a></li>
        <li><a href="/health/consult" className="hover:underline block">수의사상담</a></li>
        {isVetOrAdmin && (
          <li><a href="/health/consult/list" className="hover:underline block">상담리스트</a></li>
        )}
      </ul>
    </div>
  );
}
