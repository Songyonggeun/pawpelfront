'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TotalPage() {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  const categoryToUrl = {
    '토픽': '/community/topic',
    'Q&A': '/community/qa',
    '일상': '/community/daily',
    'BEST': '/community/best',
    '전체글': '/community/total',
  };

  // 날짜가 1일 이내면 "new" 배지 표시
  const isNewPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInTime = currentDate - postDate;
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays <= 1;
  };

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${baseUrl}/posts?page=${page}&size=10`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    fetchPosts();
  }, [page, baseUrl]);

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPopularPosts = async () => {
      try {
        const response = await fetch(`${baseUrl}/posts/popular/views?page=0&size=10`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPopularPosts(data.content || []);
      } catch (error) {
        console.error('인기글 불러오기 실패:', error);
      }
    };

    fetchPopularPosts();
  }, [baseUrl]);

  // 게시글 읽음 처리 API 호출
  const markPostAsRead = async (postId) => {
    try {
      const response = await fetch(`${baseUrl}/posts/${postId}/mark-as-read`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      console.log('게시글이 읽은 상태로 업데이트되었습니다.');

      // 읽음 상태 즉시 반영을 위해 로컬 상태 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, isRead: true } : post
        )
      );
    } catch (error) {
      console.error('게시글을 읽은 상태로 업데이트하는 데 실패했습니다:', error);
    }
  };

  function extractFirstImageSrc(html) {
    if (!html) return null;
    const div = document.createElement('div');
    div.innerHTML = html;
    const img = div.querySelector('img');
    return img ? img.src : null;
  }

  return (
    <div className="bg-white text-black min-h-screen max-w-[1100px] mx-auto px-6">
      <div className="max-w-[1100px] mx-auto pt-10 px-4">
        <div className="flex flex-col md:flex-row gap-8 overflow-hidden">
          <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)]">
            <h2 className="text-2xl font-bold mb-2">전체글</h2>
            <div className="divide-y divide-gray-200 mt-0">
              {posts.map((post) => {
                const thumbnail = extractFirstImageSrc(post.content);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = post.content;
                tempDiv.querySelectorAll('img').forEach(img => img.remove());
                const textContent = tempDiv.textContent || tempDiv.innerText || '';

                return (
                  <div
                    key={post.id}
                    className="py-6 flex justify-between items-start gap-4 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    {/* 왼쪽 텍스트 영역 */}
                    <div className="flex-1 min-w-0">
                      {/* 카테고리 */}
                      <div className="mb-1">
                        {post.category && (
                          <Link
                            href={categoryToUrl[post.category] || `/community/category/${encodeURIComponent(post.category)}`}
                            className="text-sm text-blue-600 hover:underline mr-2"
                          >
                            {post.category}
                          </Link>
                        )}
                        {post.isNew && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-semibold animate-steady-scale">
                            New
                          </span>
                        )}
                      </div>

                      {/* 제목 */}
                      <Link
                        href={`/community/detail/${post.id}`}
                        className="group inline-block"
                        onClick={() => markPostAsRead(post.id)}
                      >
                        <div
                          className={`mb-1 cursor-pointer hover:underline text-lg
                            ${post.isRead ? 'text-gray-500 font-normal' : 'text-black font-semibold'}`}
                        >
                          {post.title}
                        </div>
                      </Link>

                      {/* 댓글 수 */}
                      {typeof post.commentCount === 'number' && post.commentCount > 0 && (
                        <Link href={`/community/detail/${post.id}#comments`}>
                          <span className="ml-2 text-sm text-blue-600 hover:underline cursor-pointer">
                            [{post.commentCount}]
                          </span>
                        </Link>
                      )}

                      {/* 본문 요약 */}
                      <div className="text-gray-700 mb-3 text-sm line-clamp-3">
                        {textContent}
                      </div>

                      {/* 기타 정보 */}
                      <div className="flex items-center text-xs text-gray-500 flex-wrap mt-2">
                        <span>{post.authorName}</span>
                        <span className="mx-2">·</span>
                        <span>{formatDateRelative(post.createdAt)}</span>
                        <span className="mx-2">·</span>
                        <span>조회수 {post.viewCount}</span>
                        {typeof post.commentCount === 'number' && (
                          <>
                            <span className="mx-2">·</span>
                            <span>💬 {post.commentCount}</span>
                          </>
                        )}
                        {typeof post.likeCount === 'number' && (
                          <>
                            <span className="mx-2">·</span>
                            <span>❤️ {post.likeCount}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 오른쪽 썸네일 영역 */}
                    {thumbnail && (
                      <div className="w-40 h-28 flex-shrink-0 rounded overflow-hidden">
                        <img
                          src={thumbnail}
                          alt="썸네일 이미지"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </main>

          {/* 사이드 인기글 */}
          <aside className="w-full mt-8 border-t border-gray-200 md:w-80 md:ml-8 md:border-l md:border-t-0 md:pl-8">
            <h3 className="text-lg font-bold mb-4">인기글</h3>
            <ol className="space-y-2 text-sm">
              {popularPosts.slice(0, 10).map((post, index) => (
                <li key={post.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-pink-500 font-bold flex-shrink-0">{index + 1}</span>
                    <Link href={`/community/detail/${post.id}`} className="block max-w-[250px]">
                      <span className="block truncate whitespace-nowrap overflow-hidden hover:underline text-gray-800">
                        {post.title}
                      </span>
                    </Link>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500 ml-[26px]">
                    <span>💬 {post.commentCount ?? 0}</span>
                    <span>❤️ {post.likeCount ?? 0}</span>
                    <span>👁️ {post.viewCount ?? 0}</span>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </div>
  );
}

// 날짜 표현 함수
function formatDateRelative(dateString) {
  const createdDate = new Date(dateString);
  const now = new Date();

  const diffInDays = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
      new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())) /
    (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    return '오늘';
  } else if (diffInDays === 1) {
    return '어제';
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return createdDate.toLocaleDateString();
  }
}