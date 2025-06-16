"use client";

import React, { useEffect, useState } from "react";
import PopularPostList from "@/components/(application)/PopularPostList";
import BlindPost from "@/components/(application)/BlindPost";

export default function QnaPage() {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [popularPage, setPopularPage] = useState(0);
  const [popularTotalPages, setPopularTotalPages] = useState(0);

  const [searchField, setSearchField] = useState("title");
  const [inputValue, setInputValue] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [fieldApplied, setFieldApplied] = useState("title");

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  // 날짜가 1일 이내면 "new" 표시
  const isNewPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const now = new Date();
    return (now - postDate) / (1000 * 3600 * 24) <= 1;
  };

  // 검색 적용
  const handleSearch = () => {
    setSearchApplied(inputValue.trim().toLowerCase());
    setFieldApplied(searchField);
  };

  // 필터링
  const filteredPosts = posts.filter((post) => {
    if (!searchApplied) return true;
    if (fieldApplied === "title") return post.title.toLowerCase().includes(searchApplied);
    if (fieldApplied === "content") return post.content.toLowerCase().includes(searchApplied);
    if (fieldApplied === "authorName") return post.authorName.toLowerCase().includes(searchApplied);
    return true;
  });

  // 본문에서 첫 이미지 src 추출
  function extractFirstImageSrc(html) {
    if (!html) return null;
    const div = document.createElement("div");
    div.innerHTML = html;
    const img = div.querySelector("img");
    return img ? img.src : null;
  }

  // 본문 텍스트만 추출 (이미지 제거)
  function extractTextContent(html) {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    div.querySelectorAll("img").forEach((img) => img.remove());
    return div.textContent || "";
  }

  // 날짜 포맷 (오늘, 어제, N일 전 등)
  function formatDateRelative(dateStr) {
    const created = new Date(dateStr);
    const now = new Date();

    const diffDays = Math.floor(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
        new Date(created.getFullYear(), created.getMonth(), created.getDate())) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 7) return `${diffDays}일 전`;
    return created.toLocaleDateString();
  }

  useEffect(() => {
    if (!baseUrl) return;
    (async () => {
      try {
        const category = encodeURIComponent("Q&A");
        const res = await fetch(`${baseUrl}/posts/category/${category}?page=${page}&size=10`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`status: ${res.status}`);
        const data = await res.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (e) {
        console.error("Q&A posts fetch failed:", e);
      }
    })();
  }, [page, baseUrl]);

  useEffect(() => {
    if (!baseUrl) return;
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/posts/views/public?page=${popularPage}&size=10`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`status: ${res.status}`);
        const data = await res.json();
        setPopularPosts(data.content || []);
        setPopularTotalPages(data.totalPages || 0);
      } catch (e) {
        console.error("Popular posts fetch failed:", e);
      }
    })();
  }, [popularPage, baseUrl]);

  return (
    <div className="bg-white text-black min-h-screen w-full mx-auto px-6 mb-20">
      <div className="max-w-[1200px] mx-auto pt-10 px-4">
        <div className="flex flex-col md:flex-row gap-8 overflow-visible">
          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)]">
            <h2 className="font-bold mb-4 text-lg">
              질문과 답변 ({totalElements}건)
            </h2>

            <div className="divide-y divide-gray-200">
              {filteredPosts.map((post) => {
                const thumbnail = extractFirstImageSrc(post.content);
                return (
                  <BlindPost
                    key={post.id}
                    post={{
                      ...post,
                      textContent: extractTextContent(post.content),
                      formatDateRelative,
                      isNew: isNewPost(post.createdAt),
                    }}
                    thumbnail={thumbnail}
                    onClick={() => (window.location.href = `/community/detail/${post.id}`)}
                  />
                );
              })}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-6 mb-10 flex justify-center gap-2 items-center text-sm">
              <button
                onClick={() => setPage(Math.max(page - 1, 0))}
                disabled={page === 0}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-3 py-1 rounded ${
                    i === page ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
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
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ width: "200px" }}
              />

              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                검색
              </button>
            </div>
          </main>

          {/* 인기글 사이드바 */}
          <PopularPostList popularPosts={popularPosts} />
        </div>
      </div>
    </div>
  );
}
