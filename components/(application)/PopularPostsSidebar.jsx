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
          `${baseUrl}/posts/popular/views?page=0&size=10`,
          { credentials: 'include' },
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
    <aside className="sticky top-[110px] h-fit">
      <h3 className="text-base font-semibold text-gray-800 mb-3">🔥 인기글</h3>
      <ol className="space-y-1 text-sm text-gray-800">
        {popularPosts.slice(0, 10).map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between hover:bg-gray-100 px-2 py-1 rounded"
          >
            <Link
              href={`/community/detail/${p.id}`}
              className="flex-1 truncate group"
            >
              <span className="text-gray-400 mr-1 text-xs">
                [{p.category || '기타'}]
              </span>
              <span className="group-hover:underline font-medium text-gray-900">
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
