'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuComponents from '@/components/(application)/menu';
import PetInputButton from '@/components/(petInputs)/petInput';

export default function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPet, setEditPet] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!userRes.ok) throw new Error('Unauthorized');
        const userData = await userRes.json();
        setUserInfo(userData);
        setPets(userData.pets || []);

        const postRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/my-posts`, {
          credentials: 'include',
        });
        if (postRes.ok) {
          const postData = await postRes.json();
          setPostCount(postData.content.length || 0);
        }
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (!userInfo) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  const menuItems = [
    { title: '회원 정보 수정', href: '/myPage/checkpw' },
    { title: '건강 체크 기록', href: '/myPage/health' },
    { title: '작성 글', href: '/myPage/posts' },
  ];

  const totalHealthCheckCount = pets.reduce((sum, pet) => {
    return sum + (pet.healthRecords?.length || 0);
  }, 0);

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-10 px-6 gap-10">
      {/* 왼쪽 메뉴 */}
      <aside className="w-full md:w-60 flex-shrink-0 md:mr-10 order-2 md:order-1 mt-10 md:mt-0 bg-gray-50 min-h-[80vh]">
        <nav className="mt-[10px] px-[10px]">
          <ul className="space-y-3">
            <MenuComponents data={menuItems} />
          </ul>
        </nav>
      </aside>

      {/* 본문 영역 */}
      <main className="flex-1 order-1 md:order-2">
        {/* 사용자 프로필 */}
        <div className="w-full flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-2" />
          <div className="text-center font-semibold">{userInfo.socialName}</div>
        </div>

        {/* 사용자 데이터 */}
        <div className="bg-gray-100 p-6 rounded-xl grid grid-cols-2 text-center gap-4 shadow-sm mb-10">
          {/* <div>
            <div className="text-sm text-gray-500">이메일</div>
            <div className="text-lg font-bold">{userInfo.email}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">전화번호</div>
            <div className="text-lg font-bold">{userInfo.phoneNumber}</div>
          </div> */}
          <div>
            <div className="text-sm text-gray-500">건강 체크 수</div>
            <div className="text-lg font-bold">{totalHealthCheckCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">작성 글 수</div>
            <div className="text-lg font-bold">{postCount}</div>
          </div>

        </div>

        {/* 반려동물 목록 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">나의 반려동물</h2>
            <PetInputButton />
          </div>

          <div className="flex gap-4 flex-wrap">
            {pets.map((pet, index) => (
              <div
                key={pet.id ?? `${pet.petName}-${index}`}
                onClick={() => setEditPet(pet)}
                className="w-32 h-40 border border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white shadow-sm cursor-pointer hover:bg-gray-100"
              >
                {pet.imageUrl ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${pet.thumbnailUrl || pet.imageUrl}`}
                    alt={pet.petName}
                    className="w-20 h-20 rounded-full object-cover mb-2"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full mb-2" />
                )}
                <div className="text-sm font-medium">{pet.petName}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 수정 모달 */}
        {editPet && (
          <PetInputButton
            isEdit={true}
            pet={editPet}
            onClose={() => setEditPet(null)}
          />
        )}
      </main>
    </div>
  );
}
