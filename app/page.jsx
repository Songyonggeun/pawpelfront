"use client";

import React, { useEffect, useState } from "react";
import PetAdBanner from "@/components/(Inputs)/advertisement";
import Link from "next/link";

export default function LifetCommunityUI() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("popular");

const fetchPosts = async (type) => {
  try {
    const url =
      type === "popular"
        ? `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/popular/views?page=0&size=100`
        : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts?page=0&size=100`;


      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.content || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts(activeTab);
  }, [activeTab]);

  

  const extractAllImageSrcs = (html) => {
  if (!html) return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const imgs = div.querySelectorAll("img");
  return Array.from(imgs).map((img) => img.src);
};

  return (
    <div>
      <PetAdBanner />

      {/* 중앙 메뉴 */}
      <div className="flex justify-center my-6">
        <div className="overflow-x-auto px-4 max-w-[1000px] mx-auto">
          <div className="flex gap-15 min-w-max">
            {/* 중앙 아이콘 메뉴 6개 */}
            <a href="/health/guide" className="cursor-pointer text-center min-w-[80px]">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl font-bold">📘</div>
              <div className="mt-2 text-sm text-gray-800 font-medium">건강체크 가이드</div>
            </a>
            <a href="/health/check/select" className="cursor-pointer text-center min-w-[80px]">
              <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">✓</div>
              <div className="mt-2 text-sm text-gray-800 font-medium">건강체크</div>
            </a>
            <a href="/health/vaccine/select" className="cursor-pointer text-center min-w-[80px]">
              <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-pink-600 text-3xl font-bold">💉</div>
              <div className="mt-2 text-sm text-gray-800 font-medium">접종체크</div>
            </a>
            <a href="/community/map" className="cursor-pointer text-center min-w-[80px]">
              <div className="w-20 h-20 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-3xl font-bold">🗺️</div>
              <div className="mt-2 text-sm text-gray-800 font-medium">지도</div>
            </a>
            <a href="/community/total" className="cursor-pointer text-center min-w-[80px]">
              <div className="w-20 h-20 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-3xl font-bold">💬</div>
              <div className="mt-2 text-sm text-gray-800 font-medium">커뮤니티</div>
            </a>
            <a href="/store" className="cursor-pointer text-center min-w-[80px]">
              <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-3xl font-bold">🛒</div>
              <div className="mt-2 text-sm text-gray-800 font-medium">펫 스토어</div>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1050px] border-t border-gray-200 bg-white"></div>

      {/* 인기글 섹션 */}
      <section className="w-full border-gray-200 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 py-6">

 {/* 📸 사진 갤러리 */}
<div className="mb-6">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-lg font-bold text-gray-900">사진 갤러리</h3>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {posts
      .filter((post) => extractAllImageSrcs(post.content).length > 0) // 이미지 있는 글만
      .flatMap((post) => {
        const images = extractAllImageSrcs(post.content);
        return images.map((img, i) => ({
          id: `${post.id}-${i}`,
          postId: post.id,
          title: post.title,
          commentCount: post.commentCount,
          src: img,
        }));
      })
      .map((item) => (
        <a
          key={item.id}
          href={`/community/detail/${item.postId}`}
          className="relative group block w-full aspect-square rounded-lg overflow-hidden bg-gray-100"
        >
          <img
            src={item.src}
            alt="게시글 이미지"
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-2 left-2 text-white z-10">
            <div className="text-sm font-semibold truncate max-w-[100px]">{item.title}</div>
            <div className="text-xs text-gray-200">💬 {item.commentCount ?? 0}</div>
          </div>
        </a>
      ))}
  </div>
</div>



          {/* 🔥 인기 급상승 섹션 */}
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
            인기 급상승 🔥
          </h2>

          {/* 탭 버튼 */}
          <div className="flex gap-2 my-3">
            <button
              onClick={() => setActiveTab("popular")}
              className={`px-4 py-1 text-sm rounded text-white ${activeTab === "popular" ? "bg-gray-700" : "bg-gray-400"} hover:bg-gray-600`}
            >
              인기글
            </button>
            <button
              onClick={() => setActiveTab("latest")}
              className={`px-4 py-1 text-sm rounded text-white ${activeTab === "latest" ? "bg-gray-700" : "bg-gray-400"} hover:bg-gray-600`}
            >
              최신글
            </button>
          </div>

          {/* 게시글 리스트 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-50">
            {Array.from({ length: 9 }).map((_, idx) => {
              const post = posts[idx];
              return (
                <div
                  key={idx}
                  className="bg-gray-100 hover:bg-gray-200 transition-colors duration-150 rounded-lg p-4 text-gray-900 flex items-start gap-4 min-h-[64px] cursor-pointer"
                  onClick={() => {
                    if (post?.id) {
                      window.location.href = `/community/detail/${post.id}`;
                    }
                  }}
                >
                  {/* 순위 */}
                  {activeTab === "popular" && (
                    <div className="text-blue-500 text-xl font-bold w-8 flex-none text-center">
                      {idx + 1}
                    </div>
                  )}
                  {/* 내용 */}
                  {post && post.id ? (
                    <div className={`flex-1 min-w-0 ${activeTab !== "popular" ? "pl-1" : ""}`}>
                      <div className="font-semibold text-base truncate whitespace-nowrap overflow-hidden">
                        {post.title}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()} · 조회수{" "}
                        {post.viewCount ?? 0} · 💬 {post.commentCount ?? 0}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
