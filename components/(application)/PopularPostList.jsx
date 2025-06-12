"use client";

import Link from "next/link";

export default function PopularPostList({ popularPosts }) {
  return (
    <aside className="sticky top-[110px] h-fit">
      <h3 className="text-base font-semibold text-gray-800 mb-3">
        🔥 인기글
      </h3>
      <ol className="space-y-1 text-sm text-gray-800">
        {popularPosts.slice(0, 10).map((post) => (
          <li
            key={post.id}
            className="flex items-center justify-between hover:bg-gray-100 px-2 py-1 rounded"
          >
            <Link
              href={`/community/detail/${post.id}`}
              className="flex-1 truncate group"
            >
              <span className="text-gray-400 mr-1 text-xs">
                [{post.category || "기타"}]
              </span>
              <span className="group-hover:underline font-medium text-gray-900">
                {post.title}
              </span>
            </Link>
            {post.commentCount > 0 && (
              <span className="ml-2 text-red-500 text-xs font-semibold">
                ({post.commentCount})
              </span>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}
