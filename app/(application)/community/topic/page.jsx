"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const subCategories = ["홈케어", "식이관리", "병원", "영양제", "행동", "질병"];
const category = "토픽";

export default function TopicPage() {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  // 추가 상태
  const [searchField, setSearchField] = useState("title"); // 제목(title), 내용(content), 작성자(authorName)
  const [inputValue, setInputValue] = useState("");
  const [searchApplied, setSearchApplied] = useState(""); // 실제 필터링에 적용된 검색어
  const [fieldApplied, setFieldApplied] = useState("title"); // 실제 필터링에 적용된 

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    setSearchApplied(inputValue.trim().toLowerCase());
    setFieldApplied(searchField);
  };

  // 필터링 로직 수정
  const filteredPosts = posts.filter((post) => {
  if (!searchApplied) return true;

  const lowerSearch = searchApplied.toLowerCase();

  if (fieldApplied === "title") {
    return post.title?.toLowerCase().includes(lowerSearch);
  } else if (fieldApplied === "content") {
    return post.content?.toLowerCase().includes(lowerSearch);
  } else if (fieldApplied === "authorName") {
    return post.authorName?.toLowerCase().includes(lowerSearch);
  }
  return true;
});
  // 날짜가 1일 이내면 "new" 배지 표시
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
        new Date(
          createdDate.getFullYear(),
          createdDate.getMonth(),
          createdDate.getDate()
        )) /
      (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "오늘";
    if (diffInDays === 1) return "어제";
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return createdDate.toLocaleDateString();
  };

  function extractFirstImageSrc(html) {
    if (!html) return null;
    if (typeof window === "undefined") return null;
    const div = document.createElement("div");
    div.innerHTML = html;
    const img = div.querySelector("img");
    return img ? img.src : null;
  }

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPosts = async () => {
      try {
        let url = "";
        if (selectedSubCategory) {
          url = `${baseUrl}/posts/category/${encodeURIComponent(
            category
          )}/sub/${encodeURIComponent(selectedSubCategory)}?page=${page}&size=10`;
        } else {
          url = `${baseUrl}/posts/category/${encodeURIComponent(
            category
          )}?page=${page}&size=10`;
        }

        const response = await fetch(url, {
          credentials: "include",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error("토픽 게시글 불러오기 실패:", error);
      }
    };

    fetchPosts();
  }, [page, selectedSubCategory, baseUrl]);

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

  // 게시글 읽음 처리 API 호출
  const markPostAsRead = async (postId) => {
    try {
      const response = await fetch(`${baseUrl}/posts/${postId}/mark-as-read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      // 읽음 상태 즉시 반영
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, isRead: true } : post
        )
      );
    } catch (error) {
      console.error("읽음 상태 업데이트 실패:", error);
    }
  };

  // 서브카테고리 버튼 컴포넌트
  const SubCategoryButton = ({ label, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl shadow-sm transition duration-200 cursor-pointer ${selected
        ? "bg-blue-500 text-white shadow-md"
        : "bg-white text-gray-800 hover:bg-blue-100 hover:shadow-md"
        }`}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white text-black min-h-screen w-full mx-auto px-6">
      <div className="max-w-[1300px] mx-auto pt-10 px-4">
        <div className="flex flex-col md:flex-row gap-8 overflow-visible">
          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)]">
            <h2 style={{ fontSize: "18px" }} className="font-bold mb-4">
              토픽 게시글 ({totalElements}건)
            </h2>

            {/* 서브카테고리 필터 */}
            <div className="mb-6 flex flex-wrap gap-3">
              <SubCategoryButton
                label="전체보기"
                selected={selectedSubCategory === ""}
                onClick={() => {
                  setSelectedSubCategory("");
                  setPage(0);
                }}
              />
              {subCategories.map((subCat) => (
                <SubCategoryButton
                  key={subCat}
                  label={subCat}
                  selected={selectedSubCategory === subCat}
                  onClick={() => {
                    setSelectedSubCategory(subCat);
                    setPage(0);
                  }}
                />
              ))}
            </div>

            <div className="divide-y divide-gray-200 mt-0">
              {posts.map((post) => {
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
                          href={`/community/topic`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-gray-600 font-semibold hover:underline"
                        >
                          [{selectedSubCategory || category}]
                        </Link>
                      )}

                      <div
                        className={`text-sm md:text-base flex-1 truncate ${post.isRead
                          ? "text-gray-500 font-normal"
                          : "text-black font-bold"
                          }`}
                      >
                        {post.title}
                        {/* 댓글수 + NEW 뱃지 */}
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

                    {/* 작성자, 날짜, 조회수 등 메타정보 */}
                    <div className="text-xs text-gray-500 flex gap-2 whitespace-nowrap">
                      <span>{post.authorName}</span>
                      <span>{formatDateRelative(post.createdAt)}</span>
                      <span>조회 {post.viewCount}</span>
                    </div>

                    {/* 본문 요약 (이미지 제외 텍스트) */}
                    <div className="line-clamp-2 text-xs mt-1 text-gray-600">
                      {textContent.trim()}
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
                style={{ width: '200px' }}
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

          {/* 인기글 사이드바 */}
          <aside className="sticky top-[110px] h-fit">
            <h3 className="text-base font-semibold text-gray-800 mb-3">🔥 인기글</h3>
            <ol className="space-y-1 text-sm text-gray-800">
              {popularPosts.slice(0, 10).map((post, index) => (
                <li key={post.id} className="flex items-center justify-between hover:bg-gray-100 px-2 py-1 rounded">
                  <Link href={`/community/detail/${post.id}`} className="flex-1 truncate group">
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
  );
}
