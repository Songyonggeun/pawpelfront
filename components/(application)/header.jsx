'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 앱 로드 시 토큰을 확인하고 사용자 정보를 가져옵니다.
  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); // 로컬 스토리지에서 JWT 토큰 가져오기
    if (token) {
      // 토큰이 있으면 사용자 인증 정보를 확인합니다.
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/permit/auth/user`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // 헤더에 JWT 토큰 추가
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data); // 사용자 정보 상태 업데이트
          } else {
            setUser(null);  // 토큰이 유효하지 않으면 사용자 정보를 null로 설정
          }
        } catch (error) {
          console.error('사용자 정보 로딩 오류:', error);
          setUser(null);
        }
      };

      fetchUserData();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // 로컬 스토리지에서 JWT 토큰 삭제
    setUser(null); // 사용자 정보 초기화
    router.push('/login'); // 로그인 페이지로 리다이렉트
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-blue-500 text-2xl font-bold">✓</span>
          <span className="text-2xl font-bold text-blue-500">pawpel</span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              className="border border-gray-300 rounded-full px-4 py-1.5 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="absolute right-3 top-1.5 text-gray-500">
              🔍
            </button>
          </div>

          <button className="p-1 rounded hover:bg-gray-100 text-sm" aria-label="알림">알림</button>

          {/* 로그인 상태에 따른 버튼 표시 */}
          {user ? (
            <Link href="/myPage" className="p-1 rounded hover:bg-gray-100 text-sm" aria-label="마이페이지">
              마이페이지
            </Link>
          ) : (
            <Link href="/login" className="p-1 rounded hover:bg-gray-100 text-sm" aria-label="로그인">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
