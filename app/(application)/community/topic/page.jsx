"use client";

import React, { useEffect, useState } from "react";
import PopularPostList from "@/components/(application)/PopularPostList";
import BlindPost from "@/components/(application)/BlindPost";
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

  // 검색 관련 상태
  const [searchField, setSearchField] = useState("title"); // title, content, authorName
  const [inputValue, setInputValue] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [fieldApplied, setFieldApplied] = useState("title");

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  // 검색 버튼 클릭 시 검색어 적용 + 페이지 0으로 초기화
  const handleSearch = () => {
    setSearchApplied(inputValue.trim().toLowerCase());
    setFieldApplied(searchField);
    setPage(0);
  };

  // 검색어에 따른 필터링
  const filteredPosts = posts.filter((post) => {
    if (!searchApplied) return true;

    const lowerSearch = searchApplied.toLowerCase();

    if (fieldApplied === "title") {
      return post.title?.toLowerCase().includes(lowerSearch);
    }
    if (fieldApplied === "content") {
      return post.content?.toLowerCase().includes(lowerSearch);
    }
    if (fieldApplied === "authorName") {
      return post.authorName?.toLowerCase().includes(lowerSearch);
    }
    return true;
  });

  const isNewPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const now = new Date();
    const diffTime = now.getTime() - postDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 1;
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

        const res = await fetch(url, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [page, selectedSubCategory, baseUrl]);

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPopularPosts = async () => {
      try {
        const res = await fetch(`${baseUrl}/posts/views/public?page=0&size=10`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch popular posts");
        const data = await res.json();
        setPopularPosts(data.content || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPopularPosts();
  }, [baseUrl]);

  const markPostAsRead = async (postId) => {
    try {
      const res = await fetch(`${baseUrl}/posts/${postId}/mark-as-read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, isRead: true } : post
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const SubCategoryButton = ({ label, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl shadow-sm transition duration-200 cursor-pointer ${
        selected
          ? "bg-blue-500 text-white shadow-md"
          : "bg-white text-gray-800 hover:bg-blue-100 hover:shadow-md"
      }`}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white text-black min-h-screen w-full mx-auto px-6 mb-20">
      <div className="max-w-[1200px] mx-auto pt-10 px-4">
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
              {filteredPosts.map((post) => {
                const thumbnail = extractFirstImageSrc(post.content);
                return (
                  <BlindPost
                    key={post.id}
                    post={post}
                    thumbnail={thumbnail}
                    isRead={post.isRead}
                    isNewPost={isNewPost(post.createdAt)}
                    onClick={() => {
                      markPostAsRead(post.id);
                      window.location.href = `/community/detail/${post.id}`;
                    }}
                  />
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
              {Array.from({ length: totalPages }, (_, i) => i).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`px-3 py-1 rounded ${
                      pageNumber === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber + 1}
                  </button>
                )
              )}
              <button
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={page === totalPages - 1}
              >
                &gt;
              </button>
            </div>
              <div className="mb-4 flex justify-center gap-2">
                        <select
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2">
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
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            검색
                        </button>
                    </div>
          </main>

          {/* 인기글 사이드바 */}
          <aside
            style={{ minWidth: "320px" }}
            className="flex flex-col shrink-0 gap-6"
          >
            <PopularPostList popularPosts={popularPosts} />
          </aside>
        </div>
      </div>
    </div>
  );
}
