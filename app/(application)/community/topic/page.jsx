'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const subCategories = [
    "홈케어",
    "식이관리",
    "병원",
    "영양제",
    "행동",
    "질병"
];

export default function TopicPage() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedSubCategory, setSelectedSubCategory] = useState(''); // 1. 서브카테고리 선택 상태

    const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

    useEffect(() => {
        if (!baseUrl) return;

        const fetchPosts = async () => {
            try {
                const category = encodeURIComponent("토픽");
                let url = '';

                // 4. 서브카테고리가 선택됐으면 해당 API 호출, 아니면 기본 카테고리만 호출
                if (selectedSubCategory) {
                    url = `${baseUrl}/posts/category/${category}/sub/${encodeURIComponent(selectedSubCategory)}?page=${page}&size=10`;
                } else {
                    url = `${baseUrl}/posts/category/${category}?page=${page}&size=10`;
                }

                const response = await fetch(url, { credentials: 'include' });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setPosts(data.content || []);
                setTotalPages(data.totalPages || 0);
            } catch (error) {
                console.error('토픽 게시글 불러오기 실패:', error);
            }
        };

        fetchPosts();
    }, [page, baseUrl, selectedSubCategory]); // 3. 의존성 배열에 selectedSubCategory 추가

    const handleSubCategoryClick = (subCat) => {
        setSelectedSubCategory(subCat);
        setPage(0); // 서브카테고리 변경시 페이지 초기화
    };

    function formatDateRelative(dateString) {
        const createdDate = new Date(dateString);
        const now = new Date();

        const diffInDays = Math.floor(
            (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
                new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())
            ) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays === 0) return '오늘';
        if (diffInDays < 7) return `${diffInDays}일 전`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
        return `${Math.floor(diffInDays / 30)}달 전`;
    }
    return (
        <div className="bg-white text-black min-h-screen max-w-[1100px] mx-auto px-6 py-10">
            <h2 className="text-2xl font-bold mb-6">건강토픽 게시글</h2>

            {/* 2. 서브카테고리 클릭 이벤트, 선택 시 UI 강조 */}
            <div className="flex flex-wrap gap-3 mb-6">
                {subCategories.map((subCat) => (
                    <div
                        key={subCat}
                        onClick={() => handleSubCategoryClick(subCat)}
                        className={`px-4 py-2 rounded cursor-pointer transition 
              ${selectedSubCategory === subCat ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-400 hover:text-white'}`}
                    >
                        {subCat}
                    </div>
                ))}
                {/* 전체보기 버튼 */}
                {selectedSubCategory && (
                    <div
                        onClick={() => {
                            setSelectedSubCategory('');
                            setPage(0);
                        }}
                        className={`px-4 py-2 rounded cursor-pointer transition
      bg-gray-200 hover:bg-blue-400 hover:text-white`}
                    >
                        전체보기
                    </div>
                )}
            </div>

            <div className="divide-y divide-gray-200">
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">게시글이 없습니다.</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="py-6">
                            <div className="text-sm text-gray-500 mb-1">{post.subCategory || post.category}</div>
                            <Link href={`/community/detail/${post.id}`}>
                                <div className="font-semibold text-lg mb-1 hover:underline cursor-pointer">
                                    {post.title}
                                </div>
                            </Link>
                            <div
                                className="text-gray-700 mb-3 text-sm line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                            <div className="flex items-center text-xs text-gray-500">
                                <span>{post.authorName}</span>
                                <span className="mx-2">·</span>
                                <span>{formatDateRelative(post.createdAt)}</span>
                                <span className="mx-2">·</span>
                                <span>조회수 {post.viewCount}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 flex justify-center gap-2 items-center text-sm">
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
                        className={`px-3 py-1 rounded ${pageNumber === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
        </div>
    );
}
