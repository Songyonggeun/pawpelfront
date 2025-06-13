"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PopularPostList from "@/components/(application)/PopularPostList";
import AdBanner from "../../../../components/(application)/AdBanner";
import BlindPost from "@/components/(application)/BlindPost";

export default function TotalPage() {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
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

    // 새 글 판단 함수 (1일 이내)
    const isNewPost = (createdAt) => {
        if (!createdAt) return false;
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
                const response = await fetch(
                    `${baseUrl}/posts?page=${page}&size=10`,
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
                console.error("게시글 불러오기 실패:", error);
            }
        };

        fetchPosts();
    }, [page, baseUrl]);

    const handleSearch = () => {
        setSearchApplied(inputValue.trim().toLowerCase());
        setFieldApplied(searchField);
    };

    useEffect(() => {
        if (!baseUrl) return;

        const fetchPopularPosts = async () => {
            try {
                const response = await fetch(
                    `${baseUrl}/posts/popular/views?page=0&size=15`,
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

    // 읽음 처리
    const markPostAsRead = async (postId) => {
        try {
            const response = await fetch(
                `${baseUrl}/posts/${postId}/mark-as-read`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, isRead: true } : post
                )
            );
        } catch (error) {
            console.error("읽음 상태 업데이트 실패:", error);
        }
    };

    // 검색 필터링
    const filteredPosts = posts.filter((post) => {
        if (!searchApplied) return true;

        if (fieldApplied === "title") {
            return post.title.toLowerCase().includes(searchApplied);
        } else if (fieldApplied === "content") {
            return post.content.toLowerCase().includes(searchApplied);
        } else if (fieldApplied === "authorName") {
            return post.authorName.toLowerCase().includes(searchApplied);
        }
        return true;
    });

    // HTML에서 첫 번째 이미지 src 추출
    function extractFirstImageSrc(html) {
        if (!html) return null;
        const div = document.createElement("div");
        div.innerHTML = html;
        const img = div.querySelector("img");
        return img ? img.src : null;
    }

    // 게시글 클릭 핸들러 (비공개면 이동 안함)
    const onPostClick = (post) => {
        if (post.isPublic === false) return; // 비공개면 무시
        markPostAsRead(post.id);
        window.location.href = `/community/detail/${post.id}`;
    };

    return (
        <div className="bg-white text-black min-h-screen w-full mx-auto px-6">
            <div className="max-w-[1200px] mx-auto pt-10 px-4">
                <div className="flex flex-col md:flex-row gap-8 overflow-visible">
                    <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)]">
                        {/* <AdBanner /> */}
                        <h2
                            style={{ fontSize: "18px" }}
                            className="font-bold mb-4">
                            전체글 ({totalElements}건)
                        </h2>

                        <div className="divide-y divide-gray-200 mt-0">
                            {filteredPosts.map((post) => (
                                <BlindPost
                                    key={post.id}
                                    post={post}
                                    onClick={() => onPostClick(post)}
                                    thumbnail={extractFirstImageSrc(
                                        post.content
                                    )}
                                    isRead={post.isRead}
                                    isNewPost={isNewPost(post.createdAt)}
                                />
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        <div className="mt-6 mb-6 flex justify-center gap-2 items-center text-sm">
                            <button
                                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                                onClick={() =>
                                    setPage((prev) => Math.max(prev - 1, 0))
                                }
                                disabled={page === 0}>
                                &lt;
                            </button>
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i
                            ).map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    className={`px-3 py-1 rounded ${
                                        pageNumber === page
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                    onClick={() => setPage(pageNumber)}>
                                    {pageNumber + 1}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                                onClick={() =>
                                    setPage((prev) =>
                                        Math.min(prev + 1, totalPages - 1)
                                    )
                                }
                                disabled={page === totalPages - 1}>
                                &gt;
                            </button>
                        </div>

                        {/* 검색 기능 */}
                        <div className="mb-4 flex justify-center gap-2">
                            <select
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value="title">제목</option>
                                <option value="content">내용</option>
                                <option value="authorName">작성자</option>
                            </select>

                            <input
                                type="text"
                                placeholder="검색어를 입력하세요"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                style={{ width: "200px" }}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                                검색
                            </button>
                        </div>
                    </main>

                    {/* 인기글 사이드바 */}
                    <PopularPostList popularPosts={popularPosts} />
                    {/* <div className="hidden md:block md:w-[260px] md:pl-2">
                        <aside className="fixed top-[160px] right-[15vw] w-[260px] bg-white/90 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-semibold text-gray-800">
                                    🔥 인기글
                                </h3>
                                <Link
                                    href="/community/best"
                                    className="text-xs text-black hover:underline">
                                    더보기
                                </Link>
                            </div>
                            <ol className="space-y-1 text-sm text-gray-800">
                                {popularPosts.slice(0, 15).map((p) => (
                                    <li
                                        key={p.id}
                                        className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
                                        <Link
                                            href={`/community/detail/${p.id}`}
                                            className="flex-1 truncate">
                                            <span className="text-gray-400 mr-1 text-xs">
                                                [{p.category || "기타"}]
                                            </span>
                                            <span className="hover:underline font-medium text-gray-900">
                                                {p.title}
                                            </span>
                                        </Link>
                                        {p.commentCount > 0 && (
                                            <span className="ml-2 text-red-500 text-xs font-semibold">
                                                ({p.commentCount})
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </aside> */}
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
}
