"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/${userId}/profile`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch(
      `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/user/id/${userId}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => setPosts(data.content || []));
  }, [userId]);

  if (!user) return <div className="p-6">로딩 중...</div>;

  // 페이지네이션 계산
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-6 py-10">
      {/* 프로필 카드 */}
      <aside className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
        <div className="border border-gray-300 rounded-lg p-4 text-center shadow-sm">
          {user.imageUrl ? (
            <img
                src={
                (user.thumbnailUrl || user.imageUrl)?.startsWith("/images/profile/")
                  ? `${user.thumbnailUrl || user.imageUrl}?t=${Date.now()}`
                  : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${
                      user.thumbnailUrl || user.imageUrl
                    }?t=${Date.now()}`
                }
              alt="Profile"
              className="border-gray-300 w-24 h-24 rounded-full mx-auto object-cover border"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-3xl text-gray-400">
              🐾
            </div>
          )}
          <h2 className="text-lg font-semibold mt-4">
            {user.socialName || user.name}
          </h2>
          {/* <div className="text-sm text-gray-500">강아지 보호자</div> */}
          <div className="mt-2 text-sm">
            작성한 글 {posts.length}
          </div>

        </div>
      </aside>

      {/* 작성한 글 */}
      <section className="flex-1">
        <div className="flex gap-6 border-b mb-4 text-sm">
          <button className="border-b-2 border-blue-500 font-semibold pb-2">
            작성한 글
          </button>
        </div>

        <div className="space-y-6">
          {currentPosts.map((post) => {
            const formattedContent = post.content.replace(
              /<img([^>]*)>/g,
              '<img style="width:100px;height:100px;object-fit:cover;border-radius:8px;margin-right:8px;" $1>'
            );

            return (
              <div key={post.id} className="border-b pb-4">
                <div className="text-sm text-gray-500 mb-1">
                  {post.category}
                </div>

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

        {/* 페이지네이션 버튼 */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
