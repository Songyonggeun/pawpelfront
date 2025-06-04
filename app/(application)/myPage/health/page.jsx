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
    { title: '건강체크 기록', href: '/myPage/health' },
    { title: '백신접종 기록', href: '/myPage/vaccine' },
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

          <div className="flex flex-col gap-4">
            {pets.map((pet) => {
              const currentYear = new Date().getFullYear();
              const petAge = currentYear - pet.petAge;

              const sortedRecords = (pet.healthRecords || []).slice().sort((a, b) => {
                return new Date(b.checkedAt) - new Date(a.checkedAt);
              });

              return (
                <div key={pet.id} className="flex border border-gray-300 rounded-lg bg-white shadow-sm p-4">
                  {/* 왼쪽: 이미지 & 정보 */}
                  <div className="flex flex-col items-center justify-center w-32 mr-6">
                    {pet.imageUrl ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${pet.thumbnailUrl || pet.imageUrl}`}
                        alt={pet.petName}
                        className="w-24 h-24 rounded-full object-cover mb-2"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-full mb-2" />
                    )}
                    <div className="text-center font-semibold">{pet.petName}</div>
                    <div className="text-sm text-gray-500">{petAge}세</div>
                  </div>

                  {/* 오른쪽: 건강검진 표 */}
                  <div className="flex-1 overflow-x-auto">
                    {sortedRecords.length > 0 ? (
                      <table className="w-full text-xs table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-3 py-2 text-center whitespace-nowrap">검진일자</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">점수</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">결과</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">주의 항목</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedRecords.map((record, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="px-3 py-2 text-center whitespace-nowrap">
                                {formatDate(record.checkedAt)}
                              </td>
                              <td className="px-3 py-2 text-center whitespace-nowrap">
                                {record.totalScore}
                              </td>
                              <td className="px-3 py-2 text-center whitespace-normal break-words">
                                {record.resultStatus}
                              </td>
                              <td className="text-center whitespace-normal break-words">
                                {record.warnings?.join(', ') || '없음'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-sm text-center text-gray-400">검진 내역 없음</div>
                    )}
                  </div>
                </div>
              );
            })}
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
