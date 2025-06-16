'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PetHealthSection() {
  const [pets, setPets] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailModalRecord, setDetailModalRecord] = useState(null);
  const router = useRouter();
  const cleanCategory = (raw) => raw.replace(/^\d+\.\s*/, '').trim();

  const DEDUCTION_SCORES = {
    '심장': ["심장박동이 불규칙해요", "숨이 가빠요", "기절한 적이 있어요", "쉽게 지쳐요", "없어요"],
    '위/장': ["구토를 자주 해요", "설사를 자주 해요", "밥을 잘 안 먹거나 식욕이 줄었어요", "변 상태가 자주 물처럼 묽어요", "없어요"],
    '피부/귀': ["피부에서 냄새가 나요", "귀에서 분비물이 나와요", "피부가 빨개요", "가려워서 자주 긁어요", "없어요"],
    '신장/방광': ["소변을 자주 봐요", "소변 냄새가 강해요", "소변을 볼 때 힘들어하거나 자주 실수해요", "소변 색이 평소보다 진하거나 붉어요", "없어요"],
    '면역력/호흡기': ["기침을 자주 해요", "콧물이 나고 코를 자주 문질러요", "열이 있어요", "숨이 차서 헐떡거려요", "없어요"],
    '치아': ["입에서 냄새가 나요", "딱딱한 사료를 잘 못 씹어요", "이가 흔들리거나 빠졌어요", "잇몸이 붓고 피가 나요", "없어요"],
    '뼈/관절': ["다리를 절뚝거려요", "계단을 오르기 힘들어해요", "일어나기 힘들어해요", "산책을 싫어해요", "없어요"],
    '눈': ["눈꼽이 많이 껴요", "눈이 빨개요", "빛에 민감하게 반응해요", "눈이 뿌옇게 보여요", "없어요"],
    '행동': ["기운이 없어요", "짖는 횟수가 줄었어요", "숨는 일이 많아졌어요", "혼자 있으려고 해요", "없어요"],
    '체중 및 비만도': ["최근 강아지의 체중이 눈에 띄게 늘었거나 줄었어요", "허리 라인이 잘 안 보이거나 만져지지 않아요", "배를 만졌을 때 갈비뼈가 잘 느껴지지 않아요", "예전보다 덜 움직이고, 활동량이 줄었거나 쉽게 지쳐해요", "없어요"]
  };

  const getDeductionScore = (category, option) => {
    const cleanCat = category.replace(/^\d+\.\s*/, '').trim();
    const cleanOpt = option.trim();

    const list = DEDUCTION_SCORES[cleanCat] || [];
    const index = list.indexOf(cleanOpt);

    if (cleanOpt === '없어요') return 0;
    return index >= 0 ? 4 - index : 0;
  };

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
    <>


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
                    {/* 왼쪽: 이미지 & 정보 */}
                    <div className="flex flex-col items-center justify-center w-32 mr-6">
                      {pet.imageUrl ? (
                        <img
                          src={
                            pet.thumbnailUrl || pet.imageUrl
                              ? (pet.thumbnailUrl || pet.imageUrl).startsWith("/images/profile/")
                                  ? pet.thumbnailUrl || pet.imageUrl
                                  : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${pet.thumbnailUrl || pet.imageUrl}`
                              : defaultImage
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
                              <th className="px-3 py-2 text-center whitespace-nowrap">상세보기</th>
                              <th className="px-3 py-2 text-center whitespace-nowrap">삭제</th>
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
                                <td className="text-center whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      console.log("선택된 기록:", record); // ✅ 여기에 details가 들어 있는지 확인
                                      setDetailModalRecord(record);
                                    }}
                                    className="text-blue-500 hover:underline"
                                  >
                                    상세보기
                                  </button>
                                </td>
                                <td className="text-center text-red-500 cursor-pointer hover:underline whitespace-nowrap"
                                    onClick={async () => {
                                      const confirmed = confirm('정말 삭제하시겠습니까?');
                                      if (!confirmed) return;

                                      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/health/delete/${record.id}`, {
                                        method: 'DELETE',
                                        credentials: 'include',
                                      });

                                      if (res.ok) {
                                        alert('삭제되었습니다.');
                                        location.reload(); // 또는 상태 갱신
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

          {detailModalRecord && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">건강검진 상세 결과</h3>
                <p className="mb-2"><strong>검진일:</strong> {formatDate(detailModalRecord.checkedAt)}</p>
                <p className="mb-4"><strong>총점:</strong> {detailModalRecord.totalScore}점 / <strong>결과:</strong> {detailModalRecord.resultStatus}</p>

                <table className="w-full table-auto text-sm border border-gray-300 [&_*]:border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-left">항목</th>
                      <th className="border px-2 py-1 text-left">선택한 보기</th>
                      <th className="border px-2 py-1 text-center">감점</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailModalRecord.details?.map((detail, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1 align-top">{detail.category}</td>

                        <td className="border px-2 py-1 align-top whitespace-pre-line">
                          {detail.selectedOptions?.length > 0
                            ? detail.selectedOptions.map((opt) => `• ${opt}`).join('\n')
                            : '없음'}
                        </td>

                        <td className="border px-2 py-1 align-top whitespace-pre-line text-center">
                          {detail.selectedOptions?.length > 0
                            ? detail.selectedOptions
                                .map((opt) => `${getDeductionScore(detail.category, opt)}점`)
                                .join('\n')
                            : '0점'}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

                <div className="mt-4 text-right">
                  <button
                    onClick={() => setDetailModalRecord(null)}
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
    </>
  );
}
