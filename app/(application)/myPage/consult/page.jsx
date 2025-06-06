'use client';

import { useEffect, useState } from 'react';
import MenuComponents from '@/components/(application)/menu';
import Link from 'next/link';

export default function MyConsultsPage() {
  const [consults, setConsults] = useState([]);

  useEffect(() => {
    const fetchMyConsults = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/consult/my`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        const sorted = data.content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setConsults(sorted);
      } catch (err) {
        console.error('상담글 불러오기 실패:', err);
      }
    };

    fetchMyConsults();
  }, []);

  const menuItems = [
    { title: '회원 정보 수정', href: '/myPage/checkpw' },
    { title: '건강체크 기록', href: '/myPage/health' },
    { title: '백신접종 기록', href: '/myPage/vaccine' },
    { title: '상담 글', href: '/myPage/consult' },
    { title: '작성 글', href: '/myPage/posts' },
  ];

  return (
    <div className="flex flex-col md:flex-row max-w-[1100px] mx-auto px-6 py-6 gap-10">
      <aside className="w-full md:w-60 flex-shrink-0 md:mr-10 order-2 md:order-1 mt-10 md:mt-0 bg-gray-50 min-h-[80vh]">
        <nav className="mt-[10px] px-[10px]">
          <ul className="space-y-3">
            <MenuComponents data={menuItems} />
          </ul>
        </nav>
      </aside>

      <main className="flex-1 order-1 md:order-2 ml-0 md:-ml-6">
        <h1 className="text-2xl font-bold mb-6 text-center">내 상담글 목록</h1>

        <div className="border-t border-gray-300">
          <table className="w-full text-center mt-2">
            <thead>
              <tr className="border-b border-gray-300 text-base text-gray-600 bg-gray-50">
                <th className="py-2">번호</th>
                <th className="py-2">카테고리</th>
                <th className="py-2">제목</th>
                <th className="py-2">작성일</th>
                <th className="py-2">상태</th>
              </tr>
            </thead>
            <tbody>
              {consults.map((consult, index) => (
                <tr key={consult.id} className="border-b hover:bg-gray-100 text-sm">
                  <td className="py-2">{consults.length - index}</td>
                  <td className="py-2">{consult.subCategory || '-'}</td>
                  <td className="py-2 text-left px-4 text-blue-600 cursor-pointer hover:underline">
                    <Link href={`/health/consult/${consult.id}`}>{consult.title}</Link>
                  </td>
                  <td className="py-2">{consult.createdAt.slice(0, 10)}</td>
                  <td className="py-2">{consult.status === 'ANSWERED' ? '답변완료' : '답변대기'}</td>
                </tr>
              ))}
              {consults.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-gray-500">
                    작성한 상담글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
