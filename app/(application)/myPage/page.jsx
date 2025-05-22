'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuComponents from '@/components/(application)/menu';
import PetInputButton from '@/components/(petInputs)/petInput';

export default function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
      credentials: 'include' // 쿠키 포함 (Spring Security 세션 인증 또는 JWT 쿠키일 경우 필요)
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setUserInfo(data))
      .catch(() => router.push('/login'));
  }, []);

  if (!userInfo) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  const menuItems = [
    { title: '회원 정보 수정' },
    { title: '반려동물 관리' },
    { title: '건강 체크 기록' },
    { title: '상담 내역' },
  ];

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-10 px-6 gap-10">
      {/* Sidebar 메뉴 */}
      <aside className="w-full md:w-60 flex-shrink-0 md:mr-10 order-2 md:order-1 mt-10 md:mt-0">
        <nav>
          <ul className="space-y-3">
            <MenuComponents data={menuItems} />
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 order-1 md:order-2">
        <div className="w-full flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-2" />
          <div className="text-center font-semibold">{userInfo.socialName}</div>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl grid grid-cols-2 text-center gap-4 shadow-sm mb-10">
          <div>
            <div className="text-sm text-gray-500">이메일</div>
            <div className="text-lg font-bold">{userInfo.email}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">전화번호</div>
            <div className="text-lg font-bold">{userInfo.phoneNumber}</div>
          </div>
        </div>

        {/* 반려동물 카드 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">나의 반려동물</h2>
            <PetInputButton />
          </div>
          <div className="flex gap-4 flex-wrap">
            {userInfo.pets?.map((pet) => (
              <div
                key={pet.id}
                className="w-32 h-40 border border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white shadow-sm"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
                <div className="text-sm font-medium">{pet.name}</div>
                <div className="text-xs text-gray-500 mt-1">ID: {pet.id}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
