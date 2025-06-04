'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuComponents from '@/components/(application)/menu';

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

  const menuItems = [
    { title: '회원 정보 수정', href: '/myPage/checkpw' },
    { title: '건강체크 기록', href: '/myPage/health' },
    { title: '백신접종 기록', href: '/myPage/vaccine' },
    { title: '작성 글', href: '/myPage/posts' },
  ];

  return (
    <div className="flex max-w-[1100px] mx-auto px-6 py-6 md:px-6 gap-10">
      {/* 왼쪽 메뉴 */}
      <aside className="w-full md:w-60 flex-shrink-0 bg-gray-50 min-h-[80vh]">
        <nav className="mt-[10px] px-[10px]">
          <ul className="space-y-3">
            <MenuComponents data={menuItems} />
          </ul>
        </nav>
      </aside>

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
    </div>



  );
}
