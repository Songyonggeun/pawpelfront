"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function TotalPage() {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

    const categoryToUrl = {
        토픽: "/community/topic",
        "Q&A": "/community/qa",
        일상: "/community/daily",
        BEST: "/community/best",
        전체글: "/community/total",
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
                    credentials: "include",
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                // 게시글 리스트와 totalPages, totalElements 업데이트
                setPosts(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);  // 총 게시글 수 반영
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
            const response = await fetch(
                `${baseUrl}/posts/${postId}/mark-as-read`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            console.log("게시글이 읽은 상태로 업데이트되었습니다.");

            // 읽음 상태 즉시 반영을 위해 로컬 상태 업데이트
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, isRead: true } : post
                )
            );
        } catch (error) {
            console.error(
                "게시글을 읽은 상태로 업데이트하는 데 실패했습니다:",
                error
            );
        }
    };

    function extractFirstImageSrc(html) {
        if (!html) return null;
        const div = document.createElement("div");
        div.innerHTML = html;
        const img = div.querySelector("img");
        return img ? img.src : null;
    }

    return (
        <div className="bg-white text-black min-h-screen w-full mx-auto px-6">
            <div className="max-w-[1300px] mx-auto pt-10 px-4">
                {/* flex 컨테이너: main + aside */}
                <div className="flex flex-col md:flex-row gap-8 overflow-visible">
                    {/* 메인 콘텐츠 */}
                    <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)]">
                        <h2 style={{ fontSize: '18px' }} className="font-bold mb-4">
                            전체글 ({totalElements}건)
                        </h2>
                        <div className="divide-y divide-gray-200 mt-0">
                            {posts.map((post) => {
                                const thumbnail = extractFirstImageSrc(
                                    post.content
                                );
                                const tempDiv = document.createElement("div");
                                tempDiv.innerHTML = post.content;
                                tempDiv
                                    .querySelectorAll("img")
                                    .forEach((img) => img.remove());
                                const textContent =
                                    tempDiv.textContent ||
                                    tempDiv.innerText ||
                                    "";

                                return (
                                    <div
                                        key={post.id}
                                        onClick={() => {
                                            markPostAsRead(post.id);
                                            window.location.href = `/community/detail/${post.id}`;
                                        }}
                                        className="pl-4 py-6 flex gap-4 relative rounded-md transition-colors duration-200 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div className="flex-1 min-w-0">
                                            {/* ✅ 카테고리 링크는 따로 유지 */}
                                            <div className="mb-4">
                                                {post.category && (
                                                    <Link
                                                        href={
                                                            categoryToUrl[post.category] ||
                                                            `/community/category/${encodeURIComponent(post.category)}`
                                                        }
                                                        onClick={(e) => e.stopPropagation()} // ✅ 카드 클릭 방지
                                                        className="text-sm text-gray-600 hover:underline mr-2 font-bold"
                                                    >
                                                        전체&nbsp;&gt;&nbsp;{post.category}
                                                    </Link>
                                                )}
                                                {post.isNew && (
                                                    <span className="text-sm text-white bg-blue-500 px-2 py-0.5 rounded-full font-bold animate-scale-in-out">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-baseline">
                                                <div
                                                    className={`cursor-pointer hover:underline text-l
      ${post.isRead ? "text-gray-500 font-normal" : "text-black font-bold"}`}
                                                >
                                                    {post.title}
                                                </div>

                                                {/* 댓글 수 (있을 때만) */}
                                                {typeof post.commentCount === "number" && post.commentCount > 0 && (
                                                    <Link href={`/community/detail/${post.id}#comments`}>
                                                        <span className="ml-2 text-l text-red-600 hover:underline cursor-pointer font-bold">
                                                            ({post.commentCount})
                                                        </span>
                                                    </Link>
                                                )}
                                            </div>

                                            {/* 본문 텍스트 */}
                                            <div className="text-gray-900 mb-3 mt-2 text-sm line-clamp-3 pr-30">
                                                {(() => {
                                                    const tempDiv = document.createElement("div");
                                                    tempDiv.innerHTML = post.content;
                                                    tempDiv.querySelectorAll("img").forEach((img) => img.remove());
                                                    return tempDiv.textContent || tempDiv.innerText || "";
                                                })()}
                                            </div>

                                            {/* 썸네일 */}
                                            {extractFirstImageSrc(post.content) && (
                                                <div className="absolute top-8 right-7 w-40 h-28 rounded overflow-hidden">
                                                    <img
                                                        src={extractFirstImageSrc(post.content)}
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
                                                {post.commentCount > 0 && (
                                                    <>
                                                        <span className="mx-2">·</span>
                                                        <span>💬 {post.commentCount}</span>
                                                    </>
                                                )}
                                                {post.likeCount > 0 && (
                                                    <>
                                                        <span className="mx-2">·</span>
                                                        <span>❤️ {post.likeCount}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                );
                            })}
                        </div>

                        {/* 페이징 */}
                        <div className="mt-6 mb-10 flex justify-center gap-2 items-center text-sm">
                            <button
                                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                                onClick={() =>
                                    setPage((prev) => Math.max(prev - 1, 0))
                                }
                                disabled={page === 0}
                            >
                                &lt;
                            </button>
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i
                            ).map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    className={`px-3 py-1 rounded ${pageNumber === page
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                        }`}
                                    onClick={() => setPage(pageNumber)}
                                >
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
                                disabled={page === totalPages - 1}
                            >
                                &gt;
                            </button>
                        </div>
                    </main>

                    {/* 인기글 사이드바 */}
                    <div className="hidden md:block md:w-[260px] md:pl-2">
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
            </div >
        </div >
    );
}

// 날짜 표현 함수
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
