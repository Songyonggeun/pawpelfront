'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    if (!agree) {
      setError('탈퇴 약관에 동의해주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 비밀번호 검증 & 탈퇴 API 호출 (서버에서 한 번에 처리해도 좋고, 분리해도 됨)
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/withdraw`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        alert('회원 탈퇴가 완료되었습니다.');
        router.push('/'); // 홈으로 이동 (또는 로그인 페이지)
      } else {
        const data = await res.json();
        setError(data.message || '탈퇴에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">회원 탈퇴</h1>

      <p className="mb-4 text-gray-700">
        회원 탈퇴 시 회원님의 모든 정보가 삭제됩니다. 복구할 수 없으니 신중히 결정해주세요.
      </p>

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mr-2"
        />
        <span>탈퇴 약관에 동의합니다.</span>
      </label>

      <label className="block mb-2">
        <span className="block text-gray-700 mb-1">비밀번호 확인</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="비밀번호를 입력하세요"
          disabled={loading}
        />
      </label>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleWithdraw}
          disabled={!agree || !password || loading}
          className={`flex-1 py-2 rounded text-white font-semibold ${
            !agree || !password || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {loading ? '처리 중...' : '회원 탈퇴'}
        </button>

        <button
          onClick={() => router.back()}
          disabled={loading}
          className="flex-1 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          취소
        </button>
      </div>
    </div>
  );
}
