'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

  const totalHealthCheckCount = pets.reduce((sum, pet) => {
    return sum + (pet.healthRecords?.length || 0);
  }, 0);

  return (
    <>

      {/* 본문 영역 */}
      <main className="flex-1 order-1 md:order-2">
        {/* 사용자 프로필 */}
        <div className="w-full flex flex-col items-center mb-6 relative group">
          {/* 이미지 영역 */}
          {userInfo.imageUrl ? (
            <div className="relative">
            <img
                src={
                (userInfo.thumbnailUrl || userInfo.imageUrl)?.startsWith("/images/profile/")
                  ? `${userInfo.thumbnailUrl || userInfo.imageUrl}?t=${Date.now()}`
                  : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${
                      userInfo.thumbnailUrl || userInfo.imageUrl
                    }?t=${Date.now()}`
              }
              alt="User Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
              {/* 삭제 버튼 */}
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/delete-image`, {
                      method: 'DELETE',
                      credentials: 'include',
                    });
                    if (res.ok) {
                      setUserInfo((prev) => ({ ...prev, imageUrl: null, thumbnailUrl: null }));
                    }
                  } catch (err) {
                    console.error('이미지 삭제 실패:', err);
                  }
                }}
                className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <label
              htmlFor="uploadProfileImage"
              className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xl cursor-pointer hover:bg-gray-300"
              title="클릭하여 이미지 추가"
            >
              +
              <input
                id="uploadProfileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append(
                    'data',
                    new Blob([JSON.stringify({})], { type: 'application/json' })
                  );
                  formData.append('image', file);

                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/update`, {
                      method: 'PUT',
                      credentials: 'include',
                      body: formData,
                    });
                    if (res.ok) {
                      location.reload();
                      // const updated = await res.json();
                      // const timestamp = Date.now();
                      // setUserInfo((prev) => ({
                      //   ...prev,
                      //   imageUrl: updated.imageUrl ? `${updated.imageUrl}?t=${timestamp}` : null,
                      //   thumbnailUrl: updated.thumbnailUrl ? `${updated.thumbnailUrl}?t=${timestamp}` : null,
                      // }));
                    }
                  } catch (err) {
                    console.error('이미지 업로드 실패:', err);
                  }
                }}
              />
            </label>
          )}

          <div className="text-center font-semibold mt-2">{userInfo.socialName}</div>
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
          <div onClick={() => router.push('/myPage/health')} className="cursor-pointer">
            <div className="text-sm text-gray-500">건강 체크 수</div>
            <div className="text-lg font-bold">{totalHealthCheckCount}</div>
          </div>
          <div onClick={() => router.push('/myPage/posts')} className="cursor-pointer">
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
          {pets.map((pet, index) => {
            const species = pet.petType?.toLowerCase() || '';
            const isCat = species.includes('cat') || species.includes('고양이');
            const defaultImage = isCat ? '/images/profile/default_cat.jpeg' : '/images/profile/default_dog.jpeg';
            const isDefaultImage = !pet.imageUrl;

            return (
              <div
                key={pet.id ?? `${pet.petName}-${index}`}
                onClick={() => setEditPet(pet)}
                className="w-32 h-40 border border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white shadow-sm cursor-pointer hover:bg-gray-100"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={
                      pet.thumbnailUrl || pet.imageUrl
                        ? (pet.thumbnailUrl || pet.imageUrl).startsWith("/images/profile/")
                            ? pet.thumbnailUrl || pet.imageUrl
                            : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${pet.thumbnailUrl || pet.imageUrl}`
                        : defaultImage
                    }
                    alt={pet.petName}
                    className={`w-full h-full ${
                      isDefaultImage
                        ? isCat
                          ? 'object-contain p-[10px] filter grayscale brightness-110 opacity-60'
                          : 'object-contain p-1 filter grayscale brightness-110 opacity-60'
                        : 'object-cover'
                    }`}
                  />
                </div>
                <div className="text-sm font-medium mt-2">{pet.petName}</div>
              </div>
            );
          })}
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
    </>
  );
}
