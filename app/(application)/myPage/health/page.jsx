'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuComponents from '@/components/(application)/menu';

export default function PetHealthSection() {
  const [pets, setPets] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setUserInfo(data);
        setPets(data.pets || []);
      } catch (err) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const menuItems = [
    { title: '회원 정보 수정', href: '/myPage/checkpw' },
    { title: '건강 체크 기록', href: '/myPage/health' },
    { title: '작성 글', href: '/myPage/posts' },
  ];

  if (!userInfo) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row max-w-[1100px] mx-auto px-6 py-6 gap-10">
      <aside className="w-full md:w-60 flex-shrink-0 md:mr-10 order-2 md:order-1 mt-10 md:mt-0 bg-gray-50 min-h-[80vh]">
        <nav className="mt-[10px] px-[10px]">
          <ul className="space-y-3">
            <MenuComponents data={menuItems} />
          </ul>
        </nav>
      </aside>

      <main className="flex-1 order-1 md:order-2">
        <section>
          <h2 className="text-lg font-semibold mb-4">건강검진 내역</h2>
          <div className="flex gap-4 flex-wrap">
            {pets.map((pet) => (
              <div key={pet.id} className="w-40 p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                {/* 이미지 영역 */}
                <div className="flex justify-center mb-2">
                  {pet.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${pet.thumbnailUrl || pet.imageUrl}`}
                      alt={pet.petName}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full" />
                  )}
                </div>
                <div className="text-center font-semibold mb-2">{pet.petName}</div>
                {pet.healthRecords && pet.healthRecords.length > 0 ? (
                  pet.healthRecords.map((record, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedRecord(record)}
                      className="text-center text-sm text-gray-700 hover:underline cursor-pointer"
                    >
                      {formatDate(record.checkedAt)}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 text-center">검진 내역 없음</div>
                )}
              </div>
            ))}
          </div>

          {selectedRecord && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">건강검진 결과</h3>
                <p><strong>총점:</strong> {selectedRecord.totalScore}</p>
                <p><strong>결과:</strong> {selectedRecord.resultStatus}</p>
                <p><strong>검진일:</strong> {formatDate(selectedRecord.checkedAt)}</p>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
