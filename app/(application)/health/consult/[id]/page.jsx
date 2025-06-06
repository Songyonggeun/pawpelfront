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
        console.log('[consult]', data); 
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
          <div className="bg-gray-50 rounded-md px-3 py-3 mt-3 text-xs text-gray-600">
            🐾 <strong>{consult.petName}</strong> / {consult.petType}, {consult.breed}, {consult.gender}, {consult.birthYear}년생
          </div>
        )}
        <div className="text-sm mt-4 whitespace-pre-wrap text-gray-800">{consult.content}</div>
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
