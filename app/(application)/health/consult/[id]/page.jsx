'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ConsultDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [consult, setConsult] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [detailModalRecord, setDetailModalRecord] = useState(null); // 건강기록 모달용
  const [currentUserId, setCurrentUserId] = useState(null); // 로그인한 유저 ID

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
    const cleanCategory = category.replace(/^\d+\.\s*/, '').trim(); // ✅ 숫자 + 점 + 공백 제거
    const list = DEDUCTION_SCORES[cleanCategory] || [];
    const index = list.indexOf(option.trim());

    return option === '없어요' ? 0 : index >= 0 ? 4 - index : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        const userData = await userRes.json();
        setUserRoles(userData.roles || []);
        setCurrentUserId(userData.id);

        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/consult/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setConsult(data);
      } catch (err) {
        router.replace('/login');
      }
    };
    fetchData();
  }, [id]);


  const handleSubmit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/consult/${id}/reply`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: replyContent }),
    });
    if (res.ok) {
      setIsSubmitted(true);
      location.reload();
    }
  };

  if (!consult) return <div className="text-center mt-10">로딩 중...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">

      {/* 상담글 카드 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* 카테고리 뱃지 */}
        <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full mb-2">
          {consult.subCategory}
        </div>

        <div className="text-lg font-semibold mb-2">{consult.title}</div>
        <div className="text-xs text-gray-500 mb-4">{consult.username} · {consult.createdAt?.split('T')[0]}</div>
        {consult.petName && (
          <div className="bg-gray-50 rounded-md px-3 py-3 mt-3 text-xs text-gray-600 space-y-1">
            <div>🐾 <strong>{consult.petName}</strong> / {consult.petType}, {consult.breed}, {consult.gender}, {consult.birthYear}년생</div>

            {(currentUserId === consult.userId || userRoles.includes('VET')) && consult.latestHealthRecord && (
              <button
                onClick={() => setDetailModalRecord(consult.latestHealthRecord)}
                className="text-blue-500 underline hover:text-blue-600 text-xs mt-1"
              >
                최근 건강체크 기록 보기
              </button>
            )}
          </div>
        )}
        <div className="text-sm mt-4 whitespace-pre-wrap text-gray-800">{consult.content}</div>
      </div>

      {/* 수의사 답변 영역 */}
      {(consult.replyContent || userRoles.includes('VET')) && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-base font-semibold mb-3">수의사 답변</div>

          {consult.replyContent ? (
            <div className="text-sm whitespace-pre-wrap text-gray-800">
              {consult.replyContent}
              <div className="text-xs text-gray-400 mt-3">
                {consult.replyAuthor} · {consult.replyCreatedAt?.split('T')[0]}
              </div>
            </div>
          ) : (
            userRoles.includes('VET') && !isSubmitted && (
              <div className="w-full space-y-2">
                <textarea
                  className="w-full p-3 text-sm h-32 rounded-xl border"
                  style={{ borderColor: '#ddd' }}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="수의사로서의 의견을 입력해주세요."
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-1 text-sm text-white rounded-full shadow"
                    style={{ backgroundColor: '#64a9f6' }}
                  >
                    확인
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {detailModalRecord && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">건강검진 상세 결과</h3>
            <p className="mb-2"><strong>검진일:</strong> {detailModalRecord.checkedAt.split('T')[0]}</p>
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
                    <td className="border px-2 py-1 align-top text-center whitespace-pre-line">
                      {detail.selectedOptions?.length > 0
                        ? detail.selectedOptions.map((opt) => `${getDeductionScore(detail.category, opt)}점`).join('\n')
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



    </div>
  );
}
