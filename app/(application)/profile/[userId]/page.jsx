"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/${userId}/profile`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch(
      `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/user/id/${userId}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => setPosts(data.content || []));
  }, [userId]);

  if (!user) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-6 py-10">
      {/* 프로필 카드 */}
      <aside className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
        <div className="border rounded-lg p-4 text-center shadow-sm">
          {user.thumbnailUrl ? (
            <img
              src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${user.thumbnailUrl}`}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto object-cover border"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-3xl text-gray-400">
              🐾
            </div>
          )}
          <h2 className="text-lg font-semibold mt-4">
            {user.socialName || user.name}
          </h2>
          <div className="text-sm text-gray-500">강아지 보호자</div>
          <div className="mt-2 text-sm">
            작성한 글 {posts.length} | 댓글단 글 0
          </div>
          <div className="mt-4 text-sm text-left font-semibold">건강토픽</div>
          <div className="mt-1 text-xs text-blue-500 font-medium">영양제</div>
        </div>
      </aside>

      {/* 작성한 글 */}
      <section className="flex-1">
        <div className="flex gap-6 border-b mb-4 text-sm">
          <button className="border-b-2 border-blue-500 font-semibold pb-2">
            작성한 글
          </button>
          <button className="text-gray-400 pb-2">댓글단 글</button>
        </div>
        <div className="space-y-6">
          {posts.map((post) => {
            const formattedContent = post.content.replace(
              /<img([^>]*)>/g,
              '<img style="width:100px;height:100px;object-fit:cover;border-radius:8px;margin-right:8px;" $1>'
            );

            return (
              <div key={post.id} className="border-b pb-4">
                <div className="text-sm text-gray-500 mb-1">
                  {post.category}
                </div>

                {/* 게시글 제목 + 요약을 링크로 감싸기 */}
                <Link
                  href={`/community/detail/${post.id}`}
                  className="block hover:underline"
                >
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <div
                    className="text-sm text-gray-600 mt-1 line-clamp-2 content-html"
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                  ></div>
                </Link>

                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>
                    {post.authorName} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString()} · 조회수{" "}
                    {post.viewCount || 0}
                  </span>
                  <span className="flex items-center gap-2">
                    <span>❤️ {post.likeCount || 0}</span>
                    <span>💬 {post.commentCount || 0}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
