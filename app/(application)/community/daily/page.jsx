"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function DailyPage() {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchField, setSearchField] = useState("title");
  const [inputValue, setInputValue] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [fieldApplied, setFieldApplied] = useState("title");

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  const categoryToUrl = {
    토픽: "/community/topic",
    "Q&A": "/community/qa",
    일상: "/community/daily",
    BEST: "/community/best",
    전체글: "/community/total",
  };

  const isNewPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInTime = currentDate - postDate;
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays <= 1;
  };

  // 검색 버튼 클릭 시 필터링 조건 적용
  const handleSearch = () => {
    setSearchApplied(inputValue.trim().toLowerCase());
    setFieldApplied(searchField);
    setPage(0); // 검색 시 1페이지로 초기화
  };

  // 클라이언트 필터링 적용
  const filteredPosts = posts.filter((post) => {
    if (!searchApplied) return true;

    if (fieldApplied === "title") {
      return post.title.toLowerCase().includes(searchApplied);
    } else if (fieldApplied === "content") {
      // HTML 태그 제거 후 검색
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = post.content;
      const textContent = tempDiv.textContent || tempDiv.innerText || "";
      return textContent.toLowerCase().includes(searchApplied);
    } else if (fieldApplied === "authorName") {
      return post.authorName.toLowerCase().includes(searchApplied);
    }
    return true;
  });

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/posts/category/일상?page=${page}&size=10`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPosts();
  }, [page, baseUrl]);

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPopularPosts = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/posts/popular/views?page=0&size=10`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPopularPosts(data.content || []);
      } catch (error) {
        console.error("인기글 불러오기 실패:", error);
      }
    };

    fetchPopularPosts();
  }, [baseUrl]);

  // 썸네일 추출 함수 (content 내 첫 이미지 src)
  const extractFirstImageSrc = (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    const img = div.querySelector("img");
    return img ? img.src : null;
  };

  // 게시글 읽음 표시(간단히 localStorage에 저장하는 예)
  const markPostAsRead = (postId) => {
    const readPosts = JSON.parse(localStorage.getItem("readPosts") || "[]");
    if (!readPosts.includes(postId)) {
      readPosts.push(postId);
      localStorage.setItem("readPosts", JSON.stringify(readPosts));
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isRead: true } : p))
      );
    }
  };

  return (
    <div className="bg-white text-black min-h-screen w-full mx-auto px-6">
      <div className="max-w-[1300px] mx-auto pt-10 px-4">
        <div className="flex flex-col md:flex-row gap-8 overflow-visible">
          <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)]">
            <h2 style={{ fontSize: "18px" }} className="font-bold mb-4">
              일상글 ({totalElements}건)
            </h2>

            {/* 게시글 리스트 (필터링된 posts 렌더링) */}
            <div className="divide-y divide-gray-200 mt-0">
              {filteredPosts.length === 0 && (
                <p className="py-10 text-center text-gray-500">검색 결과가 없습니다.</p>
              )}
              {filteredPosts.map((post) => {
                const thumbnail = extractFirstImageSrc(post.content);
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = post.content;
                tempDiv.querySelectorAll("img").forEach((img) => img.remove());
                const textContent = tempDiv.textContent || tempDiv.innerText || "";

                return (
                  <div
                    key={post.id}
                    onClick={() => {
                      markPostAsRead(post.id);
                      window.location.href = `/community/detail/${post.id}`;
                    }}
                    className="relative py-4 pr-48 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                  >
                    {thumbnail && (
                      <div className="absolute top-2 right-4 w-32 h-20 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={thumbnail}
                          alt="썸네일"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-1">
                      {post.category && (
                        <Link
                          href={
                            categoryToUrl[post.category] ||
                            `/community/category/${encodeURIComponent(post.category)}`
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-gray-600 font-semibold hover:underline"
                        >
                          [{post.category}]
                        </Link>
                      )}

                      <div
                        className={`text-sm md:text-base flex-1 truncate ${
                          post.isRead
                            ? "text-gray-500 font-normal"
                            : "text-black font-bold"
                        }`}
                      >
                        {post.title}
                        {post.commentCount > 0 && (
                          <>
                            <span className="ml-1 text-red-500 text-sm font-semibold">
                              ({post.commentCount})
                            </span>
                            {isNewPost(post.createdAt) && (
                              <span className="ml-1 bg-blue-500 text-white text-xs font-semibold rounded-sm px-2 py-0.5 animate-pulse relative -top-[2px]">
                                NEW
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 line-clamp-2">{textContent}</div>

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
                  className={`px-3 py-1 rounded ${
                    pageNumber === page ? "bg-blue-500 text-white" : "bg-gray-200"
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
            {/* 검색 UI */}
            <div className="mb-4 flex justify-center gap-2">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="authorName">작성자</option>
              </select>

              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                style={{ width: "200px" }}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                검색
              </button>
            </div>
          </main>

          {/* 인기글 */}
          <div className="hidden md:block md:w-[260px] md:pl-2">
            <aside className="sticky top-[110px] h-fit">
              <h3 className="text-base font-semibold text-gray-800 mb-3">🔥 인기글</h3>
              <ol className="space-y-1 text-sm text-gray-800">
                {popularPosts.slice(0, 10).map((post) => (
                  <li
                    key={post.id}
                    className="flex items-center justify-between hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    <Link href={`/community/detail/${post.id}`} className="flex-1 truncate group">
                      <span className="text-gray-400 mr-1 text-xs">
                        [{post.category || "기타"}]
                      </span>
                      <span className="group-hover:underline font-medium text-gray-900">
                        {post.title}
                      </span>
                    </Link>
                    <span className="ml-2 text-gray-600 text-xs">조회수 {post.viewCount}</span>
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

// 상대 날짜 포맷 (예: 2시간 전, 3일 전 등)
function formatDateRelative(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return date.toLocaleDateString();
}
