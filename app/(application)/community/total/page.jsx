'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TotalPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/posts?page=${page}&size=10&sort=${sortBy}`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    fetchPosts();
  }, [page, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-6xl mx-auto pt-10 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 왼쪽: 전체글 리스트 */}
          <main className="flex-1">
            <h2 className="text-2xl font-bold mb-2">전체글</h2>
            <div className="flex justify-end mb-6">
              <select
                className="bg-white text-black border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
              </select>
            </div>
            <div className="divide-y divide-gray-200 mt-0">
              {posts.map((post) => (
                <div key={post.id} className="py-6">
                  <div className={`text-sm text-gray-500 mb-1`}>{post.category}</div>
                  <Link href={`/community/detail/${post.id}`}>
                    <div className="font-semibold text-lg mb-1 hover:underline cursor-pointer">
                      {post.title}
                    </div>
                  </Link>
                  <div
                    className="text-gray-700 mb-3 text-sm line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{post.authorName}</span>
                    <span className="mx-2">·</span>
                    <span>{formatDateRelative(post.createdAt)}</span>
                    <span className="mx-2">·</span>
                    <span>조회수 {post.viewCount}</span>
                    <span className="ml-auto flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <HeartIcon />
                        {post.likeCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <CommentIcon />
                        {post.commentCount || 0}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-6 flex justify-center gap-2 items-center text-sm">
              <button
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                aria-label="이전 페이지"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i).map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`px-3 py-1 rounded ${pageNumber === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber + 1}
                </button>
              ))}

              <button
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
                aria-label="다음 페이지"
              >
                &gt;
              </button>
            </div>
          </main>

          {/* 오른쪽: 인기글 (모바일에서는 아래로 내려감) */}
          <aside className="w-full mt-8 border-t border-gray-200 md:w-80 md:ml-8 md:border-l md:border-t-0 md:pl-8">
            <h3 className="text-lg font-bold mb-4">인기글</h3>
            <ol className="space-y-2 text-sm">
              {posts
                .slice(0, 10)
                .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                .map((post, index) => (
                  <li key={post.id} className="flex items-center gap-2">
                    <span className="text-pink-500 font-bold">{index + 1}</span>
                    <span className="truncate">{post.title}</span>
                  </li>
                ))}
            </ol>
          </aside>
        </div>
      </div>
    </div>
  );
}

function formatDateRelative(dateString) {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now - createdDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return '오늘';
  if (diffInDays < 7) return `${diffInDays}일 전`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
  return `${Math.floor(diffInDays / 30)}달 전`;
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M17 8h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2" />
      <polyline points="15 3 12 0 9 3" />
    </svg>
  );
}
