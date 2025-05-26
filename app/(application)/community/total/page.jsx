'use client';

import React, { useEffect, useState } from 'react';

export default function TotalPage() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('latest');

  // 게시글 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/posts?page=0&size=10&sort=${sortBy}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.content || []);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    fetchPosts();
  }, [sortBy]);

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-6xl mx-auto flex pt-10">
        {/* 왼쪽: 전체글 리스트 */}
        <main className="flex-1 pr-8">
          <h2 className="text-2xl font-bold mb-6">전체글</h2>

          <div className="flex gap-2 mb-6">
            <select
              className="bg-white text-black border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>

          <div className="divide-y divide-gray-200 mt-0">
            {posts.map((post) => (
              <div key={post.id} className="py-6">
                <div className={`text-sm text-gray-500 mb-1`}>{post.category}</div>
                <div className="font-semibold text-lg mb-1">{post.title}</div>
                <div
                  className="text-gray-700 mb-3 text-sm line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="flex items-center text-xs text-gray-500">
                  <span>{post.authorName}</span>
                  <span className="mx-2">·</span>
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                  <span className="mx-2">·</span>
                  <span>조회수 {post.viewCount}</span>
                  <span className="ml-auto flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <HeartIcon />
                      {post.likeCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <CommentIcon />
                      {post.commentCount || 0}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* 오른쪽: 인기글 */}
        <aside className="w-80 border-l border-gray-200 pl-8">
          <h3 className="text-lg font-bold mb-4">인기글</h3>
          <ol className="space-y-2 text-sm">
            {posts
              .slice(0, 10)
              .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
              .map((post, index) => (
                <li key={post.id} className="flex items-center gap-2">
                  <span className="text-pink-500 font-bold">{index + 1}</span>
                  <span className="truncate">{post.title}</span>
                </li>
              ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M17 8h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2" />
      <polyline points="15 3 12 0 9 3" />
    </svg>
  );
}
