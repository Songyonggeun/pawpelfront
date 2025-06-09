'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function QnaPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  useEffect(() => {
    if (!baseUrl) return;

    const fetchQnaPosts = async () => {
      try {
        const category = encodeURIComponent("Q&A");
        const response = await fetch(`${baseUrl}/posts/category/${category}?page=${page}&size=10`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const uncommentedPosts = data.content
          .filter((post) => post.commentCount === 0)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const commentedPosts = data.content
          .filter((post) => post.commentCount > 0)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setPosts([...uncommentedPosts, ...commentedPosts]);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error('Q&A 게시글 불러오기 실패:', error);
      }
    };

    fetchQnaPosts();
  }, [page, baseUrl]);

  return (
    <div className="bg-white text-black min-h-screen max-w-[1100px] mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">질문과 답</h2>

      <div className="divide-y divide-gray-200">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">게시글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="py-6 px-4 rounded">
              {post.subCategory && (
                <div className="mb-1 flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{post.subCategory}</span>

                  {post.commentCount > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      답변작성
                    </span>
                  )}

                  {post.comments?.some((comment) => comment.likeCount > 0) && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                      BEST
                    </span>
                  )}
                </div>
              )}

              <Link href={`/community/detail/${post.id}`}>
                <div className="flex items-center justify-between hover:underline cursor-pointer">
                  <h3 className="font-semibold text-lg">
                    {post.title}
                    {typeof post.commentCount === 'number' && post.commentCount > 0 && (
                      <span className="text-blue-600 ml-2">[{post.commentCount}]</span>
                    )}
                  </h3>
                </div>
              </Link>

              <div
                className="text-gray-700 mb-3 text-sm line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-2">
                <span>{post.authorName}</span>
                <span className="mx-1">·</span>
                <span>{formatDateRelative(post.createdAt)}</span>
                <span className="mx-1">·</span>
                <span>조회수 {post.viewCount}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이징 */}
      <div className="mt-6 flex justify-center gap-2 items-center text-sm">
        <button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-3 py-1 rounded ${pageNumber === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

function formatDateRelative(dateString) {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
      new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())) /
    (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return '오늘';
  if (diffInDays < 7) return `${diffInDays}일 전`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
  return `${Math.floor(diffInDays / 30)}달 전`;
}
