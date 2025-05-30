"use client";

import React, { useEffect, useState } from "react";
import PetInsuranceBanner from "@/components/(Inputs)/advertisement";

export default function LifetCommunityUI() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/popular/views?page=0&size=9`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPosts(data.content || []); // Page<PostDto> 구조일 경우 content 필드에 실제 데이터
      } catch (err) {
        console.error("Error fetching popular posts:", err);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <div>
      <PetInsuranceBanner />

      {/* 상단 메뉴 */}
      <div className="flex justify-center my-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          <a href="/health/check/select" className="cursor-pointer">
            <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">✓</div>
            <div className="mt-2 text-sm text-gray-800 font-medium">건강체크</div>
          </a>
          <a href="/community/total" className="cursor-pointer">
            <div className="w-20 h-20 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-2xl font-bold">💬</div>
            <div className="mt-2 text-sm text-gray-800 font-medium">커뮤니티</div>
          </a>
          <a href="/health/guide" className="cursor-pointer">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">📘</div>
            <div className="mt-2 text-sm text-gray-800 font-medium">건강체크 가이드</div>
          </a>
        </div>
      </div>

      {/* 인기글 섹션 */}
      <section className="w-full border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
            인기 급상승 🔥
          </h2>

          <div className="flex gap-2 my-3">
            <button className="px-4 py-1 border border-white text-white text-sm rounded bg-gray-700 hover:bg-gray-600">
              인기글
            </button>
            <button className="px-4 py-1 text-white text-sm rounded bg-gray-700 hover:bg-gray-600">
              최신글
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, idx) => {
              const post = posts[idx];
              return (
                <div key={idx} className="bg-gray-100 rounded-lg p-4 text-gray-900 flex items-start gap-4 min-h-[64px]">
                  {/* 순위 영역 - 고정 폭, 줄어들지 않도록 */}
                  <div className="text-blue-500 text-xl font-bold w-8 flex-none text-center">
                    {idx + 1}
                  </div>

                  {/* 게시글 정보 or 공백 */}
                  {post ? (
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base truncate whitespace-nowrap overflow-hidden">
                        {post.title}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()} · 조회수 {post.viewCount ?? 0} · 💬 {post.commentCount ?? 0}
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
