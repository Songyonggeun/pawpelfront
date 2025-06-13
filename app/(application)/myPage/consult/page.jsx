'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyConsultsPage() {
  const [consults, setConsults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  // 현재 페이지에 보여줄 상담글 slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = consults.slice(startIndex, endIndex);
  const totalPages = Math.ceil(consults.length / itemsPerPage);

  return (
    <main className="flex-1 order-1 md:order-2 ml-0 md:-ml-6">
      <h1 className="text-2xl font-bold mb-6 text-center">내 상담글 목록</h1>

      <table className="border-t border-gray-300 w-full text-center mt-2 border-collapse">
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
          {currentItems.map((consult, index) => (
            <tr key={consult.id} className="border-b border-gray-300 hover:bg-gray-100 text-sm">
              <td className="py-2">{consults.length - (startIndex + index)}</td>
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

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
