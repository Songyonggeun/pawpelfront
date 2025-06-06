'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ConsultDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [consult, setConsult] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        const userData = await userRes.json();
        setUserRole(userData.roles[0]);

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
      {/* 반려동물 정보 카드 */}
      {consult.pet && (
        <div className="bg-gray-50 rounded-xl p-4 shadow-md">
          <h2 className="text-sm font-semibold mb-2">🐾 반려동물 정보</h2>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div><strong>이름:</strong> {consult.pet.petName}</div>
            <div><strong>종류:</strong> {consult.pet.petType}</div>
            <div><strong>품종:</strong> {consult.pet.breed}</div>
            <div><strong>성별:</strong> {consult.pet.gender}</div>
            <div><strong>출생연도:</strong> {consult.pet.birthYear}년</div>
          </div>
        </div>
      )}

      {/* 상담글 카드 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* 카테고리 뱃지 */}
        <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full mb-2">
          {consult.subCategory}
        </div>

        <div className="text-lg font-semibold mb-2">{consult.title}</div>
        <div className="text-xs text-gray-500 mb-4">{consult.username} · {consult.createdAt?.split('T')[0]}</div>
        <div className="text-sm whitespace-pre-wrap text-gray-800">{consult.content}</div>
      </div>

      {/* 수의사 답변 영역 - 조건부 렌더링 */}
      {(consult.replyContent || userRole === 'vet') && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-base font-semibold mb-3">수의사 답변</div>

          {/* 답변이 등록되어 있는 경우: 모두 볼 수 있음 */}
          {consult.replyContent ? (
              <div className="text-sm whitespace-pre-wrap text-gray-800">
                {consult.replyContent}
                <div className="text-xs text-gray-400 mt-3">
                  {consult.replyAuthor} · {consult.replyCreatedAt?.split('T')[0]}
                </div>
              </div>
            ) : (
              // 답변이 없고 수의사만 입력창을 볼 수 있음
              userRole === 'vet' && !isSubmitted && (
                <div>
                  <textarea
                    className="w-full border rounded p-2 text-sm h-32"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="수의사로서의 의견을 입력해주세요."
                  />
                  <button
                    onClick={handleSubmit}
                    className="mt-2 px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    답변 등록
                  </button>
                </div>
              )
            )}
          </div>
        )}

    </div>
  );
}
