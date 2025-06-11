'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CommunityMenu() {
  const pathname = usePathname();

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="w-4/5 mx-auto flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 text-sm text-gray-600 p-4">
      <ul className="flex flex-col md:flex-row gap-8">
        <li>
          <Link
            href="/community/total"
            className={`hover:underline block ${isActive('/community/total') ? 'text-black font-bold' : ''
              }`}
          >
            전체글
          </Link>
        </li>
        <li>
          <Link
            href="/community/topic"
            className={`hover:underline block ${isActive('/community/topic') ? 'text-black font-bold' : ''
              }`}
          >
            건강토픽
          </Link>
        </li>
        <li>
          <Link
            href="/community/best"
            className={`hover:underline block ${isActive('/community/best') ? 'text-black font-bold' : ''
              }`}
          >
            BEST
          </Link>
        </li>
        <li>
          <Link
            href="/community/qa"
            className={`hover:underline block ${isActive('/community/qa') ? 'text-black font-bold' : ''
              }`}
          >
            질문과답
          </Link>
        </li>
        <li>
          <Link
            href="/community/daily"
            className={`hover:underline block ${isActive('/community/daily') ? 'text-black font-bold' : ''
              }`}
          >
            건강일상
          </Link>
        </li>
      </ul>

      <div className="w-full md:w-auto ml-auto">
        <Link
          href="/community/write"
          className="block text-center w-auto px-4 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-500 hover:text-white text-xs  border-gray-800 font-semibold shadow-md hover:shadow-lg"
        >
          글쓰기
        </Link>
      </div>
    </div>
  );
}
