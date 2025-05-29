'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CommunityMenu from '@/components/(application)/communityMenu';
import HealthCareMenu from '@/components/(application)/healthCare';

export default function Header() {
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showHealthCareMenu, setShowHealthCareMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const router = useRouter();

  const goTo = (path) => () => {
    router.push(path);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUserRoles(data.roles || []);
          setIsLoggedIn(true); // ✅ 여기서 상태 설정
        } else {
          setIsLoggedIn(false);
          setUserRoles([]);
        }
      } catch (err) {
        console.error('유저 정보 조회 실패:', err);
        setIsLoggedIn(false);
      }
    };

    fetchUserInfo();
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

      setIsLoggedIn(false);
      setUserRoles([]);
      window.location.href = '/';
    } catch (err) {
      console.error('로그아웃 실패:', err);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={goTo('/')}>
          <span className="text-blue-500 text-3xl font-bold">✓</span>
          <span className="text-4xl font-bold text-blue-500">Pawple</span>
        </div>

        <nav className="hidden md:flex space-x-6 text-gray-700 text-xl items-start mr-auto ml-8">
          <button onClick={toggleCommunityMenu} className="relative hover:text-blue-500">
            커뮤니티
          </button>
          <button onClick={toggleHealthCareMenu} className="relative hover:text-blue-500">
            건강관리
          </button>
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              className="border border-gray-300 rounded-full px-4 py-1.5 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="absolute right-3 top-1.5 text-gray-500">🔍</button>
          </div>

          <button className="text-left p-1 rounded hover:bg-gray-100 text-sm">알림</button>

          {isLoggedIn ? (
            userRoles.length === 0 ? null : (
              <div className="flex items-center space-x-3">
                {userRoles.includes('ADMIN') ? (
                  <button onClick={goTo('/admin')} className="text-left p-1 rounded hover:bg-gray-100 text-sm">
                    관리자페이지
                  </button>
                ) : (
                  <button onClick={goTo('/myPage')} className="text-left p-1 rounded hover:bg-gray-100 text-sm">
                    마이페이지
                  </button>
                )}
                <button onClick={handleLogout} className="text-left p-1 rounded hover:bg-gray-100 text-sm">
                  로그아웃
                </button>
              </div>
            )
          ) : (
            <button onClick={goTo('/login')} className="text-left p-1 rounded hover:bg-gray-100 text-sm">
              로그인
            </button>
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
          <button onClick={toggleCommunityMenu} className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500">
            커뮤니티
          </button>
          {showCommunityMenu && <CommunityMenu visible={showCommunityMenu} />}

          <button onClick={toggleHealthCareMenu} className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500">
            건강관리
          </button>
          {showHealthCareMenu && <HealthCareMenu />}

          <div className="flex flex-col space-y-2 text-sm">
            <button className="text-left p-1 rounded hover:bg-gray-100">알림</button>

            {!isLoggedIn ? (
              <button onClick={goTo('/login')} className="text-left p-1 rounded hover:bg-gray-100">
                로그인
              </button>
            ) : (
              <div className="flex flex-col space-y-2">
                {userRoles.includes('ADMIN') ? (
                  <button onClick={goTo('/admin')} className="text-left p-1 rounded hover:bg-gray-100">
                    관리자페이지
                  </button>
                ) : (
                  <button onClick={goTo('/myPage')} className="text-left p-1 rounded hover:bg-gray-100">
                    마이페이지
                  </button>
                )}
                <button onClick={handleLogout} className="text-left p-1 rounded hover:bg-gray-100">
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
