"use client";

import React, { useEffect, useState } from "react";

export default function PopularPage() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState("title");
  const [inputValue, setInputValue] = useState("");

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10;

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPopularPosts = async () => {
      try {
        const response = await fetch(`${baseUrl}/posts/popular/views?size=1000`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPopularPosts(data.content || []);
      } catch (error) {
        console.error("인기글 불러오기 실패:", error);
      }
    };

    fetchPopularPosts();
  }, [baseUrl]);

  // 검색 필터 처리
  useEffect(() => {
    let filtered = [...popularPosts];
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      filtered = popularPosts.filter((post) => {
        if (searchField === "title") {
          return post.title?.toLowerCase().includes(q);
        } else if (searchField === "content") {
          return post.content?.toLowerCase().includes(q);
        } else if (searchField === "authorName") {
          return post.authorName?.toLowerCase().includes(q);
        }
        return true;
      });
    }

    setFilteredPosts(filtered);
    setCurrentPage(0); // 검색 시 첫 페이지로 초기화
  }, [searchQuery, searchField, popularPosts]);

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  const paginatedPosts = filteredPosts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const extractFirstImageSrc = (html) => {
    if (!html) return null;
    const div = document.createElement("div");
    div.innerHTML = html;
    const img = div.querySelector("img");
    return img ? img.src : null;
  };

  const isNewPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInTime = currentDate - postDate;
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays <= 1;
  };

  const formatDateRelative = (dateString) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
        new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())) /
        (1000 * 60 * 60 * 24)
    );
    if (diffInDays === 0) return "오늘";
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
    return `${Math.floor(diffInDays / 30)}달 전`;
  };

  return (
    <div className="bg-white text-black min-h-screen w-full mx-auto px-6">
      <div className="max-w-[1300px] mx-auto pt-10 px-4">
        <main className="flex-1 min-w-0">
          <h2 className="font-bold mb-4 text-lg">인기글 ({filteredPosts.length}건)</h2>

          {paginatedPosts.length === 0 ? (
            <p className="text-center text-gray-500 py-10">인기글이 없습니다.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedPosts.map((post) => {
                const thumbnail = extractFirstImageSrc(post.content);
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = post.content;
                tempDiv.querySelectorAll("img").forEach((img) => img.remove());
                const textContent = tempDiv.textContent || tempDiv.innerText || "";

                return (
                  <div
                    key={post.id}
                    onClick={() => (window.location.href = `/community/detail/${post.id}`)}
                    className="relative py-4 pr-48 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                  >
                    {thumbnail && (
                      <div className="absolute top-2 right-4 w-32 h-20 rounded-md overflow-hidden border border-gray-200">
                        <img src={thumbnail} alt="썸네일" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      {post.category && (
                        <span className="text-sm text-gray-600 font-semibold">[{post.category}]</span>
                      )}
                      <div className="text-sm md:text-base flex-1 truncate font-bold text-black">
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
          )}

          {/* 페이지네이션 */}
          <div className="mt-6 mb-10 flex justify-center gap-2 items-center text-sm">
            <button
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
            >
              &gt;
            </button>
          </div>
                    <div className="mb-4 flex justify-center gap-2">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
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
              className="px-4 py-2 border border-gray-300 rounded-md"
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              검색
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
