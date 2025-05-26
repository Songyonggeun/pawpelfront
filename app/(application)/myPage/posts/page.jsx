'use client';

import { useEffect, useState } from 'react';
import MenuComponents from '@/components/(application)/menu';
import Link from 'next/link';

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/posts/my-posts`, {
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

  const menuItems = [
    { title: '회원 정보 수정', href: '/myPage/checkpw' },
    { title: '건강 체크 기록', href: '/myPage/checkpw' },
    { title: '작성 글', href: '/myPage/posts' },
  ];

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-10 px-6 gap-10 ">
      <aside className="w-full md:w-60 flex-shrink-0 md:mr-10 order-2 md:order-1 mt-10 md:mt-0 bg-gray-50 min-h-[80vh]">
        <nav className="mt-[10px] px-[10px]">
          <ul className="space-y-3">
            <MenuComponents data={menuItems} />
          </ul>
        </nav>
      </aside>

      <main className="flex-1 order-1 md:order-2 ml-0 md:-ml-6">
        <h1 className="text-2xl font-bold mb-6 text-center">내가 작성한 글</h1>

        <div className="border-t border-gray-300">
          <table className="w-full text-center mt-2">
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
              {posts.map((post, index) => (
                <tr key={post.id} className="border-b hover:bg-gray-100 text-sm">
                  <td className="py-2">{posts.length - index}</td>
                  <td className="py-2">{post.category || '-'}</td>
                  <td className="py-2 text-left px-4 text-blue-600 cursor-pointer hover:underline">
                    <Link href={`/community/post/${post.id}`}>{post.title}</Link>
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
        </div>
      </main>
    </div>
  );
}
