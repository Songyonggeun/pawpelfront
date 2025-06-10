"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function QnaPage() {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

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

    const fetchQnaPosts = async () => {
      try {
        const category = encodeURIComponent("Q&A");
        const response = await fetch(
          `${baseUrl}/posts/category/${category}?page=${page}&size=10`,
          {
            credentials: "include",
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error("Q&A 게시글 불러오기 실패:", error);
      }
    };

    fetchQnaPosts();
  }, [page, baseUrl]);

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPopularPosts = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/posts/popular/views?page=0&size=10`,
          {
            credentials: "include",
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPopularPosts(data.content || []);
      } catch (error) {
        console.error("인기글 불러오기 실패:", error);
      }
    };

    fetchPopularPosts();
  }, [baseUrl]);

  // 본문에서 첫 번째 이미지 src 추출
  function extractFirstImageSrc(html) {
    if (!html) return null;
    const div = document.createElement("div");
    div.innerHTML = html;
    const img = div.querySelector("img");
    return img ? img.src : null;
  }

  // 본문 텍스트 요약 (이미지 태그 제거)
  function extractTextContent(html) {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    div.querySelectorAll("img").forEach((img) => img.remove());
    return div.textContent || div.innerText || "";
  }

  // 날짜 표현 함수 (TotalPage 스타일과 동일)
  function formatDateRelative(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();

    const diffInDays = Math.floor(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
        new Date(
          createdDate.getFullYear(),
          createdDate.getMonth(),
          createdDate.getDate()
        )) /
      (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return "오늘";
    } else if (diffInDays === 1) {
      return "어제";
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return createdDate.toLocaleDateString();
    }
  }

  // 카테고리 URL 매핑 (필요 시 추가 가능)
  const categoryToUrl = {
    "Q&A": "/community/qa",
  };

  return (
    <div className="bg-white text-black min-h-screen w-full mx-auto px-6">
      <div className="max-w-[1300px] mx-auto pt-10 px-4">
        <div className="flex flex-col md:flex-row gap-8 overflow-visible">
          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)]">
            <h2 style={{ fontSize: "18px" }} className="font-bold mb-4">
              질문과 답변 ({totalElements}건)
            </h2>

            <div className="divide-y divide-gray-200 mt-0">
              {posts.map((post) => {
                const thumbnail = extractFirstImageSrc(post.content);
                const textContent = extractTextContent(post.content);

                return (
                  <div
                    key={post.id}
                    onClick={() =>
                      (window.location.href = `/community/detail/${post.id}`)
                    }
                    className="relative py-4 pr-48 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                  >
                    {/* 썸네일 (오른쪽 상단 고정) */}
                    {thumbnail && (
                      <div className="absolute top-2 right-4 w-32 h-20 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={thumbnail}
                          alt="썸네일"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* 제목 줄 */}
                    <div className="flex items-center gap-2 mb-1">
                      {post.category && (
                        <Link
                          href={
                            categoryToUrl[post.category] ||
                            `/community/category/${encodeURIComponent(
                              post.category
                            )}`
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-gray-600 font-semibold hover:underline"
                        >
                          [{post.category}]
                        </Link>
                      )}

                      <div className="text-sm md:text-base flex-1 truncate font-bold text-black">
                        {post.title}

                        {post.commentCount > 0 && (
                          <>
                            <span className="ml-1 text-red-500 text-sm font-semibold">
                              ({post.commentCount})
                            </span>

                            {/* 답변 완료 뱃지 */}
                            <span className="ml-2 bg-green-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                              답변 완료
                            </span>
                          </>
                        )}

                        {/* NEW 뱃지는 댓글과 별개로 항상 새 글이면 표시 */}
                        {isNewPost(post.createdAt) && (
                          <span className="ml-1 bg-blue-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>

                    </div>

                    {/* 본문 요약 */}
                    <div className="text-sm text-gray-700 line-clamp-2">
                      {textContent}
                    </div>

                    {/* 작성자 / 날짜 / 조회수 / 댓글수 / 좋아요 */}
                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                      <span>{post.authorName}</span>
                      <span>· {formatDateRelative(post.createdAt)}</span>
                      <span>· 조회수 {post.viewCount}</span>
                      {post.commentCount > 0 && <span>· 💬 {post.commentCount}</span>}
                      {post.likeCount > 0 && <span>· ❤️ {post.likeCount}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 페이징 */}
            <div className="mt-6 mb-10 flex justify-center gap-2 items-center text-sm">
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
                  className={`px-3 py-1 rounded ${pageNumber === page ? "bg-blue-500 text-white" : "bg-gray-200"
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
              >
                &gt;
              </button>
            </div>
          </main>

          {/* 인기글 사이드바 */}
          <div className="hidden md:block md:w-[260px] md:pl-2">
            <aside className="sticky top-[110px] h-fit">
              <h3 className="text-base font-semibold text-gray-800 mb-3">🔥 인기 Q&A</h3>
              <ol className="space-y-1 text-sm text-gray-800">
                {popularPosts.slice(0, 10).map((post) => (
                  <li
                    key={post.id}
                    className="flex items-center justify-between hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    <Link
                      href={`/community/detail/${post.id}`}
                      className="flex-1 truncate group"
                    >
                      <span className="text-gray-400 mr-1 text-xs">
                        [{post.category || "기타"}]
                      </span>
                      <span className="group-hover:underline font-medium text-gray-900">
                        {post.title}
                      </span>
                    </Link>
                    {post.commentCount > 0 && (
                      <span className="ml-2 text-red-500 text-xs font-semibold">
                        ({post.commentCount})
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
