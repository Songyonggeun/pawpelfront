'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelectPetPage() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // 인증 완료 여부
  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Unauthorized');

        const data = await res.json();
        setPets(data.pets || []);
        setIsAuthChecked(true); // ✅ 로그인 확인 후 렌더링
      } catch (err) {
        router.replace('/login'); // ✅ 로그인 안 되어 있으면 즉시 리디렉션
      }
    };

    fetchPets();
  }, []);

  const handleSubmit = () => {
    if (!selectedPetId) {
      alert('반려동물을 선택해주세요.');
      return;
    }
    localStorage.setItem('selectedPetId', selectedPetId);
    localStorage.setItem('checkDate', date);
    router.push('/health/check/check');
  };

  // ✅ 인증 안 된 상태에서는 아무것도 렌더링하지 않음 (깜빡임 방지)
  if (!isAuthChecked) return null;

  return (
    <div className="max-w-7x3 mx-auto p-6">
      <h1 className="text-xl font-semibold mb-6 text-center">건강체크 대상 선택</h1>

      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {pets.map((pet) => {
          const species = pet.petType?.toLowerCase() || '';
          const isCat = species.includes('cat') || species.includes('고양이') || species.includes('냥');
          const defaultImage = isCat ? '/images/profile/default_cat.jpeg' : '/images/profile/default_dog.jpeg';
          const isDefaultImage = !pet.imageUrl;

          return (
            <div
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`w-60 h-60 border border-gray-300 rounded-lg flex flex-col items-center justify-center shadow-sm cursor-pointer
                ${selectedPetId === pet.id ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-100'}`}
            >
              <div className="w-28 h-28 rounded-full overflow-hidden bg-white flex items-center justify-center mb-5">
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
              <div className="text-xs text-gray-500 font-medium">
                {pet.petType === 'cat' ? '고양이' : pet.petType === 'dog' ? '강아지' : '기타'} / {pet.petAge}년생
              </div>
              <div className="text-m font-medium">{pet.petName}</div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          다음 단계로 →
        </button>
      </div>
    </div>
  );
}
