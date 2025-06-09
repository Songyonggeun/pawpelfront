'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DailyPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPosts = async () => {
      try {
        const category = encodeURIComponent("일상");
        const url = `${baseUrl}/posts/category/${category}?page=${page}&size=10`;

        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error('일상 게시글 불러오기 실패:', error);
      }
    };

    fetchPosts();
  }, [page, baseUrl]);

  function extractFirstImageSrc(htmlString) {
    if (typeof window === 'undefined') return null;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const img = tempDiv.querySelector('img');
    return img ? img.src : null;
  }

  function formatDateRelative(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();

    const diffInDays = Math.floor(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
        new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())
      ) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return '오늘';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
    return `${Math.floor(diffInDays / 30)}달 전`;
  }

  return (
    <div className="bg-white text-black min-h-screen max-w-[1100px] mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">일상</h2>

      <div className="divide-y divide-gray-200">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">게시글이 없습니다.</p>
        ) : (
          posts.map((post) => {
            const thumbnail = extractFirstImageSrc(post.content);

            const tempDiv = typeof window !== 'undefined' ? document.createElement('div') : null;
            let textContent = '';
            if (tempDiv) {
              tempDiv.innerHTML = post.content;
              tempDiv.querySelectorAll('img').forEach(img => img.remove());
              textContent = tempDiv.textContent || tempDiv.innerText || '';
            }

            return (
              <div key={post.id} className="py-6">
                <div className="text-sm text-gray-500 mb-1">{post.subCategory || post.category}</div>

                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt="썸네일 이미지"
                    className="w-40 h-28 object-cover rounded mb-3"
                  />
                )}

                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/community/detail/${post.id}`} className="group inline-block">
                    <div className="font-semibold text-lg hover:underline cursor-pointer">
                      {post.title}
                    </div>
                  </Link>
                  {/* 댓글 수가 0보다 클 때만 표시 */}
                  {typeof post.commentCount === 'number' && post.commentCount > 0 && (
                    <Link href={`/community/detail/${post.id}#comments`}>
                      <span
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                        aria-label="댓글 수로 이동"
                      >
                        [{post.commentCount}]
                      </span>
                    </Link>
                  )}
                </div>

                <div className="text-gray-700 mb-3 text-sm line-clamp-2">
                  {textContent}
                </div>

                <div className="flex items-center text-xs text-gray-500">
                  <span>{post.authorName}</span>
                  <span className="mx-2">·</span>
                  <span>{formatDateRelative(post.createdAt)}</span>
                  <span className="mx-2">·</span>
                  <span>👁️ {post.viewCount}</span>
                  {typeof post.commentCount === 'number' && post.commentCount > 0 && (
                    <>
                      <span className="mx-2">·</span>
                      <span>💬 {post.commentCount}</span>
                    </>
                  )}
                  {typeof post.likeCount === 'number' && post.likeCount > 0 && (
                    <>
                      <span className="mx-2">·</span>
                      <span>❤️ {post.likeCount}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

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
          aria-label="다음 페이지"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
