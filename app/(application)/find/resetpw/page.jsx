'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(true); // 초기 로딩 상태

  useEffect(() => {
    const queryId = searchParams.get('userId');
    if (queryId) {
      setUserId(queryId);
      setLoading(false); // 정상 접근 시 렌더링 허용
    } else {
      router.replace('/find/findid'); // ❌ userId 없으면 아이디 찾기로 이동
    }
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !newPassword || !confirmPassword) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/permit/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword }),
      });

      if (response.ok) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        window.location.href = '/login';
      } else {
        const result = await response.json();
        alert(result.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
    }
  };

  if (loading) return null; // 리디렉션 중이면 렌더링하지 않음

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">비밀번호 재설정</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={userId}
            readOnly
            className="w-full border p-2 rounded bg-gray-100 text-gray-600"
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            비밀번호 변경
          </button>
        </form>
      </div>
    </div>
  );
}
