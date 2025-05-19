'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter 추가
import CommunityMenu from '@/components/(application)/communityMenu';
import HealthCareMenu from '@/components/(application)/healthCare';
import Link from 'next/link'; // Link 추가

export default function Header() {
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showHealthCareMenu, setShowHealthCareMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter(); // useRouter 훅 사용

  // 사용자 데이터 시뮬레이션 (실제 인증 로직으로 대체 필요)
  const user = {
    isLoggedIn: true, // 로그인 여부 (false로 변경하면 로그인 안 됨)
    role: 'user' // 역할 (예: 'admin', 'user', 'guest')
  };

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

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center space-x-2">
          <span className="text-blue-500 text-2xl font-bold">✓</span>
          <span className="text-2xl font-bold text-blue-500">pawpel</span>
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex space-x-6 text-gray-700 text-sm items-start mr-auto ml-8">
          <button
            onClick={toggleCommunityMenu}
            className="relative hover:text-blue-500"
          >
            커뮤니티
          </button>
          <button
            onClick={toggleHealthCareMenu}
            className="relative hover:text-blue-500"
          >
            건강관리
          </button>
          <a href="#" className="hover:text-blue-500">펫보험</a>
        </nav>

        {/* 검색 + 아이콘 (데스크탑) */}
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
          {!user.isLoggedIn ? (
            <div className="p-1 rounded hover:bg-gray-100 text-sm">
              <Link href="/login" className="text-gray-600">로그인</Link>
            </div>
          ) : user.role === 'admin' ? (
            <button className="p-1 rounded hover:bg-gray-100 text-sm" aria-label="관리자">관리자</button>
          ) : (
            <Link href="/myPage" className="p-1 rounded hover:bg-gray-100 text-sm" aria-label="마이페이지">마이페이지</Link>
          )}
        </div>

        {/* 모바일 햄버거 메뉴 버튼 */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={toggleMobileMenu}
          aria-label="모바일 메뉴 토글"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* 커뮤니티 서브 메뉴 (데스크탑) */}
      {showCommunityMenu && (
        <div className="max-w-7xl mx-auto px-4 border-t border-gray-200 md:block hidden">
          <CommunityMenu visible={showCommunityMenu} />
        </div>
      )}

      {/* 건강관리 서브 메뉴 (데스크탑) */}
      {showHealthCareMenu && (
        <div className="max-w-7xl mx-auto px-4 border-t border-gray-200 md:block hidden">
          <HealthCareMenu />
        </div>
      )}

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-4">
          <button
            onClick={toggleCommunityMenu}
            className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500"
          >
            커뮤니티
          </button>
          {showCommunityMenu && <CommunityMenu visible={showCommunityMenu} />}

          <button
            onClick={toggleHealthCareMenu}
            className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500"
          >
            건강관리
          </button>
          {showHealthCareMenu && <HealthCareMenu />}

          <a href="#" className="block text-gray-700 hover:text-blue-500">펫보험</a>

          {/* 모바일 아이콘 버튼 세로 정렬 */}
          <div className="flex flex-col space-y-2 text-sm">
            <button className="text-left p-1 rounded hover:bg-gray-100" aria-label="알림">알림</button>

            {/* 모바일 상태에 따른 버튼 표시 */}
            {!user.isLoggedIn ? (
              <Link href="/login" className="text-left p-1 rounded hover:bg-gray-100 text-gray-600">로그인</Link>
            ) : user.role === 'admin' ? (
              <button className="text-left p-1 rounded hover:bg-gray-100">관리자</button>
            ) : (
              <Link href="/myPage" className="text-left p-1 rounded hover:bg-gray-100">마이페이지</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
