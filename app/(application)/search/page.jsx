'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);


  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  useEffect(() => {
    if (!baseUrl) return;
    if (!keyword.trim()) {
      setPosts([]);
      setTotalPages(0);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/posts/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=10`,
          { credentials: 'include' }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error('검색 결과 불러오기 실패:', error);
      }
    };

    fetchSearchResults();
  }, [keyword, page, baseUrl]);

  function extractFirstImageSrc(html) {
    if (!html) return null;
    if (typeof document === 'undefined') return null;
    const div = document.createElement('div');
    div.innerHTML = html;
    const img = div.querySelector('img');
    return img ? img.src : null;
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

  return (
    <div className="bg-white text-black min-h-screen max-w-[1100px] mx-auto px-6">
      <div className="max-w-[1100px] mx-auto pt-10 px-4">
        <main className="min-w-0">
          <h2 className="text-2xl font-bold mb-2">검색 결과: "{keyword}"</h2>
          <p className="text-gray-600 mb-4">총 {totalElements}건의 결과가 있습니다.</p>

          <div className="divide-y divide-gray-200 mt-0">
            {posts.length === 0 ? (
              <p className="py-6 text-center text-gray-500">검색 결과가 없습니다.</p>
            ) : (
              posts.map((post) => {
                const thumbnail = extractFirstImageSrc(post.content);

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = post.content;
                tempDiv.querySelectorAll('img').forEach(img => img.remove());
                const textContent = tempDiv.textContent || tempDiv.innerText || '';

                return (
                  <div
                    key={post.id}
                    onClick={() => {
                      if (typeof markPostAsRead === 'function') {
                        markPostAsRead(post.id);
                      }
                      window.location.href = `/community/detail/${post.id}`;
                    }}
                    className="relative py-4 pr-48 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                  >
                    {/* 썸네일 (오른쪽 상단 고정) */}
                    {thumbnail && (
                      <div className="absolute top-2 right-4 w-32 h-20 rounded-md overflow-hidden border border-gray-200">
                        <img src={thumbnail} alt="썸네일" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* 제목 */}
                    <div
                      className={`text-lg font-semibold mb-1 ${post.isRead ? "text-gray-500 font-normal" : "text-black font-bold"
                        } truncate`}
                    >
                      {post.title}
                    </div>

                    {/* 본문 요약 (이미지 제외 텍스트) */}
                    <div className="line-clamp-2 text-sm text-gray-700 mb-3">
                      {textContent.trim()}
                    </div>

                    {/* 작성자, 날짜, 조회수, 댓글, 좋아요 */}
                    <div className="flex items-center text-xs text-gray-500 gap-2 whitespace-nowrap">
                      <span>{post.authorName}</span>
                      <span>·</span>
                      <span>{formatDateRelative(post.createdAt)}</span>
                      <span>·</span>
                      <span>조회수 {post.viewCount}</span>
                      {typeof post.commentCount === 'number' && (
                        <>
                          <span>·</span>
                          <span>💬 {post.commentCount}</span>
                        </>
                      )}
                      {typeof post.likeCount === 'number' && (
                        <>
                          <span>·</span>
                          <span>❤️ {post.likeCount}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
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
          )}
        </main>
      </div>
    </div>
  );
}
