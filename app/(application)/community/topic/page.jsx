'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const subCategories = [
  "홈케어",
  "식이관리",
  "병원",
  "영양제",
  "행동",
  "질병"
];

const category = "토픽";

export default function TopicPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPosts = async () => {
      try {
        let url = '';
        if (selectedSubCategory) {
          url = `${baseUrl}/posts/category/${encodeURIComponent(category)}/sub/${encodeURIComponent(selectedSubCategory)}?page=${page}&size=10`;
        } else {
          url = `${baseUrl}/posts/category/${encodeURIComponent(category)}?page=${page}&size=10`;
        }

        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error('토픽 게시글 불러오기 실패:', error);
      }
    };

    fetchPosts();
  }, [page, baseUrl, selectedSubCategory]);

  const handleSubCategoryClick = (subCat) => {
    setSelectedSubCategory(subCat);
    setPage(0);
  };

  // 본문에서 첫 번째 이미지 src 추출 함수
  function extractFirstImageSrc(htmlString) {
    if (typeof window === 'undefined') return null;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const img = tempDiv.querySelector('img');
    return img ? img.src : null;
  }

  // 날짜 포맷 함수 (TotalPage와 동일)
  function formatDateRelative(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();

    const diffInDays = Math.floor(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
        new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())
      ) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return '오늘';
    if (diffInDays === 1) return '어제';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return createdDate.toLocaleDateString();
  }

  return (
    <div className="bg-white text-black min-h-screen w-full mx-auto px-6">
      <div className="max-w-[1300px] mx-auto pt-10 px-4">

        {/* 제목 및 서브카테고리 버튼 영역 */}
        <div>
          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <h2 style={{ fontSize: '18px' }} className="font-bold">
              토픽 게시글 ({totalElements}건)
            </h2>
          </div>
          {/* 서브카테고리 버튼 */}
          <div className="flex flex-wrap gap-3 ml-6 mb-10">
            <button
              onClick={() => {
                setSelectedSubCategory('');
                setPage(0);
              }}
              className={`px-4 py-2 rounded-xl shadow-sm transition duration-200 cursor-pointer
                ${selectedSubCategory === ''
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-800 hover:bg-blue-100 hover:shadow-md'}
              `}
            >
              전체보기
            </button>

            {subCategories.map((subCat) => (
              <button
                key={subCat}
                onClick={() => handleSubCategoryClick(subCat)}
                className={`px-4 py-2 rounded-xl shadow-sm transition duration-200 cursor-pointer
                  ${selectedSubCategory === subCat
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-800 hover:bg-blue-100 hover:shadow-md'}
                `}
              >
                {subCat}
              </button>
            ))}
          </div>
        </div>

        {/* 게시글 리스트 */}
        <div className="divide-y divide-gray-200">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-20">게시글이 없습니다.</p>
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
                <div
                  key={post.id}
                  onClick={() => window.location.href = `/community/detail/${post.id}`}
                  className="pl-4 py-6 flex gap-4 relative rounded-md transition-colors duration-200 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    {/* 카테고리 및 서브카테고리 */}
                    <div className="mb-4 text-sm text-gray-600 font-bold">
                      {`토픽${selectedSubCategory ? ` > ${selectedSubCategory}` : ''}`}
                    </div>

                    {/* 제목 */}
                    <div
                      className={`cursor-pointer hover:underline text-lg font-semibold
                        ${post.isRead ? 'text-gray-500 font-normal' : 'text-black font-bold'}
                      `}
                    >
                      {post.title}
                    </div>

                    {/* 본문 텍스트 */}
                    <div className="text-gray-900 mb-3 mt-2 text-sm line-clamp-3 pr-30">
                      {textContent}
                    </div>

                    {/* 썸네일 */}
                    {thumbnail && (
                      <div className="absolute top-8 right-7 w-40 h-28 rounded overflow-hidden">
                        <img
                          src={thumbnail}
                          alt="썸네일 이미지"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}

                    {/* 기타 정보 */}
                    <div className="flex items-center text-xs text-gray-500 flex-wrap mt-4">
                      <span>{post.authorName}</span>
                      <span className="mx-2">·</span>
                      <span>{formatDateRelative(post.createdAt)}</span>
                      <span className="mx-2">·</span>
                      <span>조회수 {post.viewCount}</span>
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
                </div>
              );
            })
          )}
        </div>

        {/* 페이징 */}
        <div className="mt-6 mb-10 flex justify-center gap-2 items-center text-sm">
          <button
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
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
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={page === totalPages - 1}
            aria-label="다음 페이지"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
