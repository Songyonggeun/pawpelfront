"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function GalleryPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const pageSize = 8; // 한 페이지에 보여줄 이미지 개수

  // 모든 게시글을 불러오는 대신, 페이지 별로 이미지를 자르기 위해 모든 게시글을 불러옴
  // 만약 서버에서 페이징된 데이터를 받고 싶으면 fetchPosts에 페이지 요청 후 바로 사용해야 함
  const fetchPosts = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts?page=0&size=100`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.content || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const extractAllImageSrcs = (html) => {
    if (!html) return [];
    const div = document.createElement("div");
    div.innerHTML = html;
    const imgs = div.querySelectorAll("img");
    return Array.from(imgs).map((img) => img.src);
  };

  // 이미지가 있는 게시글만 필터링
  const postsWithImages = posts.filter(
    (post) => extractAllImageSrcs(post.content).length > 0
  );

  // 이미지 + 게시글 정보 리스트로 변환
  const imagesWithPostInfo = postsWithImages.flatMap((post) => {
    const images = extractAllImageSrcs(post.content);
    return images.map((src, idx) => ({
      key: `${post.id}-${idx}`,
      postId: post.id,
      src,
      title: post.title,
      commentCount: post.commentCount ?? 0,
      createdAt: post.createdAt,
    }));
  });

  // 전체 이미지 수에 따라 총 페이지 수 계산
  const computedTotalPages = Math.ceil(imagesWithPostInfo.length / pageSize);

  // 현재 페이지에 해당하는 이미지들만 추출
  const currentPageImages = imagesWithPostInfo.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= computedTotalPages) return;
    setPage(newPage);
    // 필요시 fetchPosts(newPage) 호출 (서버 페이지네이션일 경우)
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <h1 className="text-[22px] font-bold mb-13">사진 갤러리</h1>
      <div className="border-b border-gray-300 my-4 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {currentPageImages.map(({ key, postId, src, title, commentCount, createdAt }) => (
          <Link
            key={key}
            href={`/community/detail/${postId}`}
            className="group relative block rounded-lg overflow-hidden bg-white cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-gray-300"
          >
            {createdAt && new Date(createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
              <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold rounded-sm px-2 py-0.5 animate-pulse z-10 shadow-md">
                NEW
              </span>
            )}

            {/* 이미지 영역 */}
            <div
              className="w-full"
              style={{ aspectRatio: "3 / 4", overflow: "hidden" }}
            >
              <img
                src={src}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            <div className="px-2 py-1">
              <h3
                className="font-semibold truncate text-[16px] mb-2 group-hover:text-[17px] group-hover:font-semibold transition-all duration-200"
                title={title}
              >
                {title}
              </h3>
              <p className="text-[14px] text-gray-500">💬 {commentCount}</p>
            </div>

            {/* 그림자 강조 박스 */}
            <div
              className="pointer-events-none absolute bottom-0 right-0 w-12 h-12 rounded-lg"
              style={{
                boxShadow: "12px 12px 20px rgba(0, 0, 0, 0.2)",
                zIndex: 0,
                transform: "translate(30%, 30%)",
              }}
            />
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 mb-6 flex justify-center gap-2 items-center text-sm">
        <button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          &lt;
        </button>
        {Array.from({ length: computedTotalPages }, (_, i) => i).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-3 py-1 rounded transition-colors ${pageNumber === page
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, computedTotalPages - 1))}
          disabled={page === computedTotalPages - 1}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
