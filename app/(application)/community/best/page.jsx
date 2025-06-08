'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TotalPage() {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortOption, setSortOption] = useState('latest');

    const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

    useEffect(() => {
        if (!baseUrl) return;

        const fetchPosts = async () => {
            try {
                let url = `${baseUrl}/posts?page=${page}&size=10`;

                if (sortOption === 'likes') {
                    url = `${baseUrl}/posts/popular/likes?page=${page}&size=10`;
                } else if (sortOption === 'comments') {
                    url = `${baseUrl}/posts/popular/comments?page=${page}&size=10`;
                } else if (sortOption === 'views') {
                    url = `${baseUrl}/posts/popular/views?page=${page}&size=10`;
                }

                const response = await fetch(url, { credentials: 'include' });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setPosts(data.content || []);
                setTotalPages(data.totalPages || 0);
            } catch (error) {
                console.error('게시글 불러오기 실패:', error);
            }
        };

        fetchPosts();
    }, [page, baseUrl, sortOption]);

    useEffect(() => {
        if (!baseUrl) return;

        const fetchPopularPosts = async () => {
            try {
                const response = await fetch(`${baseUrl}/posts/popular/views?page=0&size=10`, {
                    credentials: 'include',
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setPopularPosts(data.content || []);
            } catch (error) {
                console.error('인기글 불러오기 실패:', error);
            }
        };

        fetchPopularPosts();
    }, [baseUrl]);

    // 첫번째 이미지 src 추출 함수
    function extractFirstImageSrc(html) {
        if (!html) return null;
        const div = document.createElement('div');
        div.innerHTML = html;
        const img = div.querySelector('img');
        return img ? img.src : null;
    }

    return (
        <div className="bg-white text-black min-h-screen max-w-[1100px] mx-auto px-6">
            <div className="max-w-[1100px] mx-auto pt-10 px-4">
                <div className="flex flex-col md:flex-row gap-8 overflow-hidden">
                    <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">best</h2>

                            <select
                                value={sortOption}
                                onChange={(e) => {
                                    setSortOption(e.target.value);
                                    setPage(0); // 정렬 기준 바뀌면 첫 페이지로
                                }}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                <option value="latest">최신순</option>
                                <option value="likes">좋아요순</option>
                                <option value="comments">댓글순</option>
                                <option value="views">조회수순</option>
                            </select>
                        </div>
                        <div className="divide-y divide-gray-200 mt-0">
                            {posts.map((post) => {
                                const thumbnail = extractFirstImageSrc(post.content);

                                // 본문에서 이미지 태그 제거하고 텍스트만 추출
                                const tempDiv = document.createElement('div');
                                tempDiv.innerHTML = post.content;
                                tempDiv.querySelectorAll('img').forEach(img => img.remove());
                                const textContent = tempDiv.textContent || tempDiv.innerText || '';

                                return (
                                    <div key={post.id} className="py-6">
                                        {/* 카테고리 */}
                                        <div className="text-sm text-gray-500 mb-1">{post.category}</div>

                                        {/* 썸네일 이미지 (카테고리 아래에) */}
                                        {thumbnail && (
                                            <img
                                                src={thumbnail}
                                                alt="썸네일 이미지"
                                                className="w-40 h-28 object-cover rounded mb-3"
                                            />
                                        )}

                                        {/* 제목 */}
                                        <Link href={`/community/detail/${post.id}`}>
                                            <div className="font-semibold text-lg mb-1 hover:underline cursor-pointer">
                                                {post.title}
                                            </div>
                                        </Link>

                                        {/* 본문 텍스트 (이미지 제거 후) */}
                                        <div className="text-gray-700 mb-3 text-sm line-clamp-2">
                                            {textContent}
                                        </div>

                                        {/* 기타 정보 */}
                                        <div className="flex items-center text-xs text-gray-500">
                                            <span>{post.authorName}</span>
                                            <span className="mx-2">·</span>
                                            <span>{formatDateRelative(post.createdAt)}</span>
                                            <span className="mx-2">·</span>
                                            <span>조회수 {post.viewCount}</span>
                                            {typeof post.commentCount === 'number' && (
                                                <>
                                                    <span className="mx-2">·</span>
                                                    <span>💬 {post.commentCount}</span>
                                                </>
                                            )}
                                            {typeof post.likeCount === 'number' && (
                                                <>
                                                    <span className="mx-2">·</span>
                                                    <span>❤️ {post.likeCount}</span>
                                                </>
                                            )}
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
                                aria-label="이전 페이지"
                            >
                                &lt;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i).map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    className={`px-3 py-1 rounded ${pageNumber === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
                                aria-label="다음 페이지"
                            >
                                &gt;
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function formatDateRelative(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();

    const diffInDays = Math.floor(
        (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
            new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())) /
        (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return '오늘';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
    return `${Math.floor(diffInDays / 30)}달 전`;
}
