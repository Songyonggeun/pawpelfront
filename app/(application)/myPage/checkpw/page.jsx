'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckPasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/checkpw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/myPage/edit');
      } else {
        const result = await res.json();
        setError(result.message || '비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };


  return (
    <>

      {/* 오른쪽 본문 */}
      <main className="flex-grow pt-10">
        <div className="w-full max-w-md bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">비밀번호 확인</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="비밀번호 입력"
              className="w-full px-4 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              확인
            </button>
          </form>
        </div>
      </main>
    </>



  );
}
