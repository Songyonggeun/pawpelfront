'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // useRouter 추가
import CommunityMenu from '@/components/(application)/communityMenu';
import HealthCareMenu from '@/components/(application)/healthCare';
import Link from 'next/link'; // Link 추가

export default function Header() {
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showHealthCareMenu, setShowHealthCareMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 추적
  const router = useRouter();

  useEffect(() => {
    // 페이지 로드 시 쿠키에서 로그인 상태 확인
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));

    if (jwtCookie) {
      setIsLoggedIn(true); // JWT 쿠키가 있으면 로그인 상태
    } else {
      setIsLoggedIn(false); // JWT 쿠키가 없으면 로그인되지 않은 상태
    }
  }, []);

  const toggleCommunityMenu = () => {
    setShowCommunityMenu(prev => !prev);
    setShowHealthCareMenu(false);
  };

  const toggleHealthCareMenu = () => {
    setShowHealthCareMenu(prev => !prev);
    setShowCommunityMenu(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
    if (mobileMenuOpen) {
      setShowCommunityMenu(false);
      setShowHealthCareMenu(false);
    }
  };

  const handleLogout = () => {
    // 쿠키에서 JWT 토큰 삭제
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setIsLoggedIn(false);
    router.push("/login"); // 로그인 페이지로 리디렉션
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-blue-500 text-2xl font-bold">✓</span>
          <span className="text-2xl font-bold text-blue-500">pawple</span>
        </div>  

        <nav className="hidden md:flex space-x-6 text-gray-700 text-sm items-start mr-auto ml-8">
          <button onClick={toggleCommunityMenu} className="relative hover:text-blue-500">
            커뮤니티
          </button>
          <button onClick={toggleHealthCareMenu} className="relative hover:text-blue-500">
            건강관리
          </button>
          <a href="#" className="hover:text-blue-500">펫보험</a>
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <input type="text" placeholder="검색어를 입력해주세요." className="border border-gray-300 rounded-full px-4 py-1.5 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button className="absolute right-3 top-1.5 text-gray-500">🔍</button>
          </div>

          <button className="p-1 rounded hover:bg-gray-100 text-sm" aria-label="알림">알림</button>

          {!isLoggedIn ? (
            <div className="p-1 rounded hover:bg-gray-100 text-sm">
              <Link href="/login" className="text-gray-600">로그인</Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/myPage" className="text-gray-600">마이페이지</Link>
              <button onClick={handleLogout} className="text-gray-600">로그아웃</button>
            </div>
          )}
        </div>

        <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={toggleMobileMenu} aria-label="모바일 메뉴 토글">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {showCommunityMenu && (
        <div className="max-w-7xl mx-auto px-4 border-t border-gray-200 md:block hidden">
          <CommunityMenu visible={showCommunityMenu} />
        </div>
      )}

      {showHealthCareMenu && (
        <div className="max-w-7xl mx-auto px-4 border-t border-gray-200 md:block hidden">
          <HealthCareMenu />
        </div>
      )}

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-4">
          <button onClick={toggleCommunityMenu} className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500">커뮤니티</button>
          {showCommunityMenu && <CommunityMenu visible={showCommunityMenu} />}

          <button onClick={toggleHealthCareMenu} className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500">건강관리</button>
          {showHealthCareMenu && <HealthCareMenu />}

          <a href="#" className="block text-gray-700 hover:text-blue-500">펫보험</a>

          <div className="flex flex-col space-y-2 text-sm">
            <button className="text-left p-1 rounded hover:bg-gray-100">알림</button>

            {!isLoggedIn ? (
              <Link href="/login" className="text-left p-1 rounded hover:bg-gray-100 text-gray-600">로그인</Link>
            ) : (
              <div className="text-left p-1 rounded hover:bg-gray-100">로그아웃</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
