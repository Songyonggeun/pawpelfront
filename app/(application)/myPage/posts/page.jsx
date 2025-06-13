'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/my-posts`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        const sortedPosts = data.content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
      }
    };

    fetchMyPosts();
  }, []);

  // 페이지에 표시할 포스트 계산
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <main className="flex-1 order-1 md:order-2 ml-0 md:-ml-6">
      <h1 className="text-2xl font-bold mb-6 text-center">내가 작성한 글</h1>

      <table className="border-t border-gray-300 w-full text-center mt-2 border-collapse">
        <thead>
          <tr className="border-b border-gray-300 text-base text-gray-600 bg-gray-50">
            <th className="py-2">번호</th>
            <th className="py-2">카테고리</th>
            <th className="py-2">제목</th>
            <th className="py-2">작성일</th>
            <th className="py-2">조회수</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <tr key={post.id} className="border-b border-gray-300 hover:bg-gray-100 text-sm">
              <td className="py-2">{posts.length - (startIndex + index)}</td>
              <td className="py-2">{post.category || '-'}</td>
              <td className="py-2 text-left px-4 text-blue-600 cursor-pointer hover:underline">
                <Link href={`/community/detail/${post.id}`}>{post.title}</Link>
              </td>
              <td className="py-2">{post.createdAt.slice(0, 10)}</td>
              <td className="py-2">{post.viewCount}</td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan="5" className="py-6 text-gray-500">
                작성한 글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이징 버튼 */}
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
