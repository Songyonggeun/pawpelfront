'use client';

import MenuComponents from '@/components/(application)/menu';

export default function MyPageLayout({ children }) {
  const menuItems = [
    { title: '회원 정보 수정', href: '/myPage/checkpw' },
    { title: '주문 내역', href: '/myPage/order' },
    { title: '건강체크 기록', href: '/myPage/health' },
    { title: '백신접종 기록', href: '/myPage/vaccine' },
    { title: '상담 글', href: '/myPage/consult' },
    { title: '작성 글', href: '/myPage/posts' },
    { title: '포인트', href: '/myPage/point' },
  ];

  return (
    <div className="flex flex-col md:flex-row max-w-[1200px] mx-auto px-6 py-6 gap-10">
      {/* 왼쪽 메뉴 고정 */}
      <aside className="w-full md:w-60 flex-shrink-0 md:mr-10 order-2 md:order-1 mt-10 md:mt-0 bg-gray-50 min-h-[80vh]">
        <nav className="mt-[10px] px-[10px]">
          <ul className="space-y-3">
            <MenuComponents data={menuItems} />
          </ul>
        </nav>
      </aside>

      {/* 개별 페이지 렌더링 */}
      <main className="flex-1 order-1 md:order-2">
        {children}
      </main>
    </div>
  );
}
