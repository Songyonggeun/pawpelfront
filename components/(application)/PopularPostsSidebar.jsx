'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PopularPostsSidebar() {
  const [popularPosts, setPopularPosts] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  useEffect(() => {
    if (!baseUrl) return;

    const fetchPopular = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/posts/popular/views?page=0&size=15`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPopularPosts(data.content || []);
      } catch {
        setPopularPosts([]);
      }
    };

    fetchPopular();
  }, [baseUrl]);

  return (
    <aside className="fixed top-[160px] right-[15vw] w-[260px] bg-white/90 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-800">🔥 인기글</h3>
        <Link
          href="/community/best"
          className="text-xs text-black hover:underline"
        >
          더보기
        </Link>
      </div>
      <ol className="space-y-1 text-sm text-gray-800">
        {popularPosts.slice(0, 15).map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between px-2 py-1 hover:bg-gray-100"
          >
            <Link
              href={`/community/detail/${p.id}`}
              className="flex-1 truncate"
            >
              <span className="text-gray-400 mr-1 text-xs">
                [{p.category || '기타'}]
              </span>
              <span className="hover:underline font-medium text-gray-900">
                {p.title}
              </span>
            </Link>
            {p.commentCount > 0 && (
              <span className="ml-2 text-red-500 text-xs font-semibold">
                ({p.commentCount})
              </span>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}
