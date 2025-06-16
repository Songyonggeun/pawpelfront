"use client";

import React, { useEffect, useState, useMemo } from "react";
import PetAdBanner from "@/components/(Inputs)/advertisement";
import AnimalPanel from "@/components/(Inputs)/AnimalPanel";
import Link from "next/link";

export default function LifetCommunityUI() {
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("popular");
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [originalProduct, setOriginalProduct] = useState(null);

       const fetchPosts = async (type) => {
        try {
            const url =
                type === "popular"
                    ? `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/popular/views?page=0&size=100`
                    : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts?page=0&size=100`;

            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to fetch posts");
            const data = await res.json();
            const publicPosts = (data.content || []).filter(post => post.isPublic !== false);
            setPosts(publicPosts);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoadingPosts(false);
        }
    };


    useEffect(() => {
        setLoadingPosts(true);
        fetchPosts(activeTab);
    }, [activeTab]);

    const extractAllImageSrcs = (html) => {
        if (!html) return [];
        const div = document.createElement("div");
        div.innerHTML = html;
        const imgs = div.querySelectorAll("img");
        return Array.from(imgs).map((img) => img.src);
    };

    const imageGallery = useMemo(() => {
        return posts
            .filter((post) => post.isPublic !== false && extractAllImageSrcs(post.content).length > 0)
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
            .slice(0, 6);
    }, [posts]);

    return (
        <div>
            <PetAdBanner />

            {/* 중앙 메뉴 */}
            <div className="flex justify-center my-6">
                <div className="w-full max-w-[1100px] mx-auto">
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 px-4">
                        {/* 중앙 아이콘 메뉴 6개 */}
                        <a
                            href="/health/guide"
                            className="cursor-pointer text-center min-w-[80px] transform transition-transform duration-300 hover:-translate-y-1">
                            <div
                                className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl font-bold 
                        hover:scale-90 hover:shadow-lg hover:text-green-900 transition-all duration-300">
                                📘
                            </div>
                            <div
                                className="mt-2 text-sm text-gray-800 font-medium 
                        hover:text-green-900 transition-colors duration-300">
                                건강체크 가이드
                            </div>
                        </a>

                        <a
                            href="/health/check/select"
                            className="cursor-pointer text-center min-w-[80px] transform transition-transform duration-300 hover:-translate-y-1">
                            <div
                                className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold 
                        hover:scale-90 hover:shadow-lg hover:text-indigo-900 transition-all duration-300">
                                ✓
                            </div>
                            <div
                                className="mt-2 text-sm text-gray-800 font-medium 
                        hover:text-indigo-900 transition-colors duration-300">
                                건강체크
                            </div>
                        </a>

                        <a
                            href="/health/vaccine/select"
                            className="cursor-pointer text-center min-w-[80px] transform transition-transform duration-300 hover:-translate-y-1">
                            <div
                                className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-pink-600 text-3xl font-bold 
                        hover:scale-90 hover:shadow-lg hover:text-pink-900 transition-all duration-300">
                                💉
                            </div>
                            <div
                                className="mt-2 text-sm text-gray-800 font-medium 
                        hover:text-pink-900 transition-colors duration-300">
                                접종체크
                            </div>
                        </a>

                        <a
                            href="/health/map"
                            className="cursor-pointer text-center min-w-[80px] transform transition-transform duration-300 hover:-translate-y-1">
                            <div
                                className="w-20 h-20 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-3xl font-bold 
                        hover:scale-90 hover:shadow-lg hover:text-pink-900 transition-all duration-300">
                                🗺️
                            </div>
                            <div
                                className="mt-2 text-sm text-gray-800 font-medium 
                        hover:text-pink-900 transition-colors duration-300">
                                지도
                            </div>
                        </a>

                        <a
                            href="/community/total"
                            className="cursor-pointer text-center min-w-[80px] transform transition-transform duration-300 hover:-translate-y-1">
                            <div
                                className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-pink-600 text-3xl font-bold 
                        hover:scale-90 hover:shadow-lg hover:text-pink-900 transition-all duration-300">
                                💬
                            </div>
                            <div
                                className="mt-2 text-sm text-gray-800 font-medium 
                        hover:text-pink-900 transition-colors duration-300">
                                커뮤니티
                            </div>
                        </a>

                        <a
                            href="/store"
                            className="cursor-pointer text-center min-w-[80px] transform transition-transform duration-300 hover:-translate-y-1">
                            <div
                                className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-orange-500 text-3xl font-bold 
                        hover:scale-90 hover:shadow-lg hover:text-orange-900 transition-all duration-300">
                                🛒
                            </div>
                            <div
                                className="mt-2 text-sm text-gray-800 font-medium 
                        hover:text-orange-900 transition-colors duration-300">
                                펫 스토어
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* 게시글 섹션 */}
            <section className="w-full border-gray-200 bg-white">
                <div className="max-w-[1100px] mx-auto px-6 py-2">
                    {/* 사진 갤러리 */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900">사진 갤러리</h3>
                            <Link href="/community/gallery" className="text-sm text-gray-500 hover:underline whitespace-nowrap">
                                더보기 &gt;
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
                            {loadingPosts
                                ? Array.from({ length: 6 }).map((_, i) => (
                                      <div key={i} className="w-full aspect-square bg-gray-200 animate-pulse rounded-lg" />
                                  ))
                                : imageGallery.map((item) => (
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
                                              <div className="text-sm font-semibold truncate max-w-[100px]">
                                                  {item.title}
                                              </div>
                                              <div className="text-xs text-gray-200">
                                                  💬 {item.commentCount ?? 0}
                                              </div>
                                          </div>
                                      </a>
                                  ))}
                        </div>
                    </div>

                    {/* 인기글/최신글 섹션 */}
                    <div className="flex justify-between items-center my-3">
                        <div className="flex gap-2">
                            <button onClick={() => setActiveTab("popular")} className={`px-4 py-1 text-sm rounded text-white ${activeTab === "popular" ? "bg-gray-700" : "bg-gray-400"} hover:bg-gray-600`}>
                                인기글
                            </button>
                            <button onClick={() => setActiveTab("latest")} className={`px-4 py-1 text-sm rounded text-white ${activeTab === "latest" ? "bg-gray-700" : "bg-gray-400"} hover:bg-gray-600`}>
                                최신글
                            </button>
                        </div>
                        <Link
                            href={activeTab === "popular" ? "/community/best" : "/community/total"}
                            className="text-sm text-gray-500 hover:underline whitespace-nowrap"
                        >
                            더보기 &gt;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                        {loadingPosts
                            ? Array.from({ length: 9 }).map((_, i) => (
                                  <div key={i} className="bg-gray-200 animate-pulse h-20 rounded-lg" />
                              ))
                            : posts.slice(0, 9).map((post, idx) => (
                                  <div
                                      key={post.id}
                                      className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-4 flex items-start gap-4 min-h-[64px] cursor-pointer"
                                      onClick={() => window.location.href = `/community/detail/${post.id}`}
                                  >
                                      {activeTab === "popular" && (
                                          <div className="text-blue-500 text-xl font-bold w-8 flex-none text-center">
                                              {idx + 1}
                                          </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                          <div className="font-semibold text-base truncate whitespace-nowrap">
                                              {post.title}
                                          </div>
                                          <div className="mt-1 text-sm text-gray-500">
                                              {new Date(post.createdAt).toLocaleDateString()} · 조회수 {post.viewCount ?? 0} · 💬 {post.commentCount ?? 0}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </section>

            <div className="max-w-[1100px] mx-auto px-6 pb-0 mb-20">
                <AnimalPanel />
            </div>
        </div>
    );
}