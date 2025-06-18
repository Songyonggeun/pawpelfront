"use client";

import React from "react";
import Link from "next/link";

export default function BlindPost({
    post,
    onClick,
    thumbnail,
    isRead,
    isNewPost,
}) {
    const isBlinded = post.isPublic === false; // 비공개면 블라인드 처리

    return (
        <div
            onClick={() => {
                if (!isBlinded && onClick) onClick();
            }}
            className="relative py-4 pr-48 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
            title={isBlinded ? "비공개 처리된 글입니다." : ""}
            aria-disabled={isBlinded}>
            {thumbnail && !isBlinded && (
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
                        href={`/community/category/${encodeURIComponent(
                            post.category
                        )}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-gray-600 font-semibold hover:underline">
                        [{post.category}]
                    </Link>
                )}

                <div
                    className={`text-sm md:text-base flex-1 truncate ${
                        isRead
                            ? "text-gray-500 font-normal"
                            : "text-black font-bold"
                    } ${
                        isBlinded ? "italic text-gray-600 font-semibold" : ""
                    }`}>
                    {isBlinded ? "비공개 처리된 글입니다." : post.title}
                    {!isBlinded && post.commentCount > 0 && (
                        <>
                            <span className="ml-1 text-gray-500 text-sm font-semibold">
                                ({post.commentCount})
                            </span>
                            {isNewPost && (
                                <span className="ml-1 bg-blue-500 text-white text-xs font-semibold rounded-sm px-2 py-0.5 animate-pulse relative -top-[2px]">
                                    NEW
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {!isBlinded && (
                <div className="text-sm text-gray-700 line-clamp-2">
                    {extractTextWithoutImages(post.content)}
                </div>
            )}

            {/* 작성자 / 시간 / 조회수 / 댓글 / 좋아요 */}
            {isBlinded ? (
                <div className="text-xs text-gray-500 mt-1 " />
            ) : (
                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                    <span>{post.authorName}</span>
                    <span>· {formatDateRelative(post.createdAt)}</span>
                    <span>· 조회수 {post.viewCount}</span>
                    {post.commentCount > 0 && (
                        <span>· 💬 {post.commentCount}</span>
                    )}
                    {post.likeCount > 0 && <span>· ❤️ {post.likeCount}</span>}
                </div>
            )}
        </div>
    );
}

function extractTextWithoutImages(html) {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    div.querySelectorAll("img").forEach((img) => img.remove());
    return div.textContent || div.innerText || "";
}

function formatDateRelative(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return "방금 전";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "어제";
    if (days < 31) return `${days}일 전`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}개월 전`;

    const years = Math.floor(months / 12);
    return `${years}년 전`;
}
