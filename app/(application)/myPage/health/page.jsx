'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

  if (!userInfo) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  return (
    <main className="flex-1 order-1 md:order-2">
      <section>
        <h2 className="text-lg font-semibold mb-4">건강검진 내역</h2>

        <div className="flex flex-col gap-4">
          {pets.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="mb-4">등록된 반려동물이 없습니다.<br />펫을 등록해주세요.</p>
              <button
                onClick={() => router.push('/myPage')}
                className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                등록하러 가기
              </button>
            </div>
          ) : (
            pets.map((pet) => {
              const currentYear = new Date().getFullYear();
              const petAge = currentYear - pet.petAge;

              const sortedRecords = (pet.healthRecords || []).slice().sort((a, b) => {
                return new Date(b.checkedAt) - new Date(a.checkedAt);
              });

              return (
                <div key={pet.id} className="flex border border-gray-300 rounded-lg bg-white shadow-sm p-4">
                  <div className="flex flex-col items-center justify-center w-32 mr-6">
                    {pet.imageUrl ? (
                      <img
                        src={
                          pet.thumbnailUrl || pet.imageUrl
                            ? (pet.thumbnailUrl || pet.imageUrl).startsWith("/images/profile/")
                              ? pet.thumbnailUrl || pet.imageUrl
                              : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${pet.thumbnailUrl || pet.imageUrl}`
                            : ''
                        }
                        alt={pet.petName}
                        className="w-24 h-24 rounded-full object-cover mb-2"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-full mb-2" />
                    )}
                    <div className="text-center font-semibold">{pet.petName}</div>
                    <div className="text-sm text-gray-500">{petAge}세</div>
                  </div>

                  <div className="flex-1 overflow-x-auto">
                    {sortedRecords.length > 0 ? (
                      <table className="w-full text-xs table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-3 py-2 text-center whitespace-nowrap">검진일자</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">점수</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">결과</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">주의 항목</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">상세</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">삭제</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedRecords.map((record, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="px-3 py-2 text-center whitespace-nowrap">{formatDate(record.checkedAt)}</td>
                              <td className="px-3 py-2 text-center whitespace-nowrap">{record.totalScore}</td>
                              <td className="px-3 py-2 text-center whitespace-normal break-words">{record.resultStatus}</td>
                              <td className="text-center whitespace-normal break-words">{record.warnings?.join(', ') || '없음'}</td>
                              <td className="text-center text-blue-500 cursor-pointer hover:underline whitespace-nowrap" onClick={() => setSelectedRecord(record)}>
                                보기
                              </td>
                              <td className="text-center text-red-500 cursor-pointer hover:underline whitespace-nowrap" onClick={async () => {
                                const confirmed = confirm('정말 삭제하시겠습니까?');
                                if (!confirmed) return;
                                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/health/delete/${record.id}`, {
                                  method: 'DELETE',
                                  credentials: 'include',
                                });
                                if (res.ok) {
                                  alert('삭제되었습니다.');
                                  location.reload();
                                } else {
                                  alert('삭제에 실패했습니다.');
                                }
                              }}>
                                삭제
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
            })
          )}
        </div>

        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 text-blue-600 text-center">건강검진 상세 결과</h3>
              <div className="space-y-2 text-sm text-gray-800">
                <div className="flex justify-between">
                  <span className="font-semibold">검진일자:</span>
                  <span>{formatDate(selectedRecord.checkedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">점수:</span>
                  <span>{selectedRecord.totalScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">결과:</span>
                  <span>{selectedRecord.resultStatus}</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">주의 항목:</p>
                  {selectedRecord.warnings?.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700">
                      {selectedRecord.warnings.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">없음</p>
                  )}
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
