'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CommunityMenu() {
  const pathname = usePathname();
  
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');
  
  return (
    <div className="max-w-5xl mx-auto text-sm text-gray-600 p-6 relative">
      <ul className="flex flex-col md:flex-row gap-8">
        <li>
          <Link
            href="/community/total"
            className={`block hover:underline ${
              isActive('/community/total') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            전체글
          </Link>
        </li>
        <li>
          <Link
            href="/community/topic"
            className={`block hover:underline ${
              isActive('/community/topic') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            건강토픽
          </Link>
        </li>
        <li>
          <Link
            href="/community/best"
            className={`block hover:underline ${
              isActive('/community/best') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            BEST
          </Link>
        </li>
        <li>
          <Link
            href="/community/qa"
            className={`block hover:underline ${
              isActive('/community/qa') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            질문과답
          </Link>
        </li>
        <li>
          <Link
            href="/community/daily"
            className={`block hover:underline ${
              isActive('/community/daily') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            건강일상
          </Link>
        </li>
        <li>
          <Link
            href="/community/gallery"
            className={`block hover:underline ${
              isActive('/community/gallery') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            갤러리
          </Link>
        </li>
        <li>
          <Link
            href="/community/map"
            className={`block hover:underline ${
              isActive('/community/map') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            반려동물 동반카페
          </Link>
        </li>
        <li>
          <Link
            href="/rescue"
            className={`block hover:underline ${
              isActive('/rescue') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            유기동물
          </Link>
        </li>
      </ul>
      
     {/* PC에서는 absolute, 모바일에서는 아래쪽에 고정된 글쓰기 버튼 */}
  <div className="absolute top-3 right-6 hidden md:block">
    <Link
      href="/community/write"
      className="inline-block text-center px-4 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-500 hover:text-white text-xs border-gray-800 font-semibold shadow-md hover:shadow-lg"
    >
      글쓰기
    </Link>
  </div>

  {/* 모바일에서는 메뉴 아래에 글쓰기 버튼 표시 */}
  <div className="mt-6 md:hidden flex justify-center">
    <Link
      href="/community/write"
      className="inline-block bg-blue-500 text-white rounded px-6 py-3 shadow-md hover:bg-blue-600 text-sm font-semibold"
    >
      글쓰기
    </Link>
  </div>
</div>
  );
}