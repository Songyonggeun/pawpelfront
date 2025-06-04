'use client';

import React, { useState, useEffect, useRef } from 'react';
import CommunityMenu from '@/components/(application)/communityMenu';
import HealthCareMenu from '@/components/(application)/healthCare';
import HealthBanner from '@/components/(application)/healthBanner';
import Link from 'next/link';

export default function HeaderClient({ isLoggedIn, userRoles }) {
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showHealthCareMenu, setShowHealthCareMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [mouseAtTop, setMouseAtTop] = useState(false);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 50) {
        setMouseAtTop(true);
        setHeaderVisible(true);
      } else {
        setMouseAtTop(false);
        if (window.scrollY > lastScrollY.current) {
          setHeaderVisible(false);
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/';
    } catch (err) {
      console.error('로그아웃 실패:', err);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <header
      className={`w-full z-50 sticky top-0 bg-white shadow-sm transition-transform duration-300 ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-6 py-6 flex items-center justify-between">
        {/* 좌측: 로고 + 메뉴 */}
        <div className="flex items-end">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <span className="text-blue-500 text-2xl font-bold">✓</span>
            <span className="text-2xl font-bold text-blue-500">Pawple</span>
          </Link>

          <nav className="hidden md:flex text-gray-700 text-base font-bold items-end ml-12">
            <button onClick={toggleCommunityMenu} className="ml-0 hover:text-blue-500">커뮤니티</button>
            <button onClick={toggleHealthCareMenu} className="ml-12 hover:text-blue-500">건강관리</button>
          </nav>
        </div>

        {/* 우측: 배너 + 검색창 + 로그인/마이페이지 */}
        <div className="hidden md:flex items-center space-x-6">
          <HealthBanner isLoggedIn={isLoggedIn} className="mb-3" />

          {isClient && (
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색어를 입력해주세요."
                  className="border border-gray-300 rounded-full px-4 py-1.5 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="absolute right-3 top-1.5 text-gray-500">🔍</button>
              </div>

              {isLoggedIn ? (
                userRoles.length === 0 ? null : (
                  <div className="flex items-center space-x-3">
                    {userRoles.includes('ADMIN') ? (
                      <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-500">관리자페이지</Link>
                    ) : (
                      <Link href="/myPage" className="text-sm text-gray-500 hover:text-blue-500">마이페이지</Link>
                    )}
                    <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-blue-500">로그아웃</button>
                  </div>
                )
              ) : (
                <div className="p-1 rounded hover:bg-gray-100 text-sm">
                  <Link href="/login" className="text-sm text-gray-500 hover:text-blue-500">로그인</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 모바일 메뉴 토글 */}
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={toggleMobileMenu} aria-label="모바일 메뉴 토글">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {showCommunityMenu && (
        <div className="max-w-[1100px] mx-auto px-4 border-t border-gray-200 md:block hidden">
          <CommunityMenu visible={showCommunityMenu} />
        </div>
      )}

      {showHealthCareMenu && (
        <div className="max-w-[1100px] mx-auto px-4 border-t border-gray-200 md:block hidden">
          <HealthCareMenu />
        </div>
      )}

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-4 bg-white">
          <button onClick={toggleCommunityMenu} className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500">커뮤니티</button>
          {showCommunityMenu && <CommunityMenu visible={showCommunityMenu} />}

          <button onClick={toggleHealthCareMenu} className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500">건강관리</button>
          {showHealthCareMenu && <HealthCareMenu />}

          <div className="flex flex-col space-y-2 text-sm">
            <button className="text-left p-1 rounded hover:bg-gray-100">알림</button>

            {!isLoggedIn ? (
              <Link href="/login" className="text-left p-1 rounded hover:bg-gray-100 text-gray-600">로그인</Link>
            ) : (
              userRoles.length === 0 ? null : (
                <>
                  {userRoles.includes('ADMIN') ? (
                    <Link href="/admin" className="text-left p-1 rounded hover:bg-gray-100 text-gray-600">관리자페이지</Link>
                  ) : (
                    <Link href="/myPage" className="text-left p-1 rounded hover:bg-gray-100 text-gray-600">마이페이지</Link>
                  )}
                  <button onClick={handleLogout} className="text-left p-1 rounded hover:bg-gray-100 text-gray-600">로그아웃</button>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
