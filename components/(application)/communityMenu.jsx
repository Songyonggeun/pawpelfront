import Link from 'next/link';

export default function CommunityMenu() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 text-sm text-gray-600 p-4 max-w-[1100px] mx-auto">
      <ul className="flex flex-col md:flex-row gap-4">
        {/* <li><Link href="/community/home" className="hover:underline block">홈</Link></li> */}
        <li><Link href="/community/total" className="hover:underline block">전체글</Link></li>
        <li><Link href="/community/topic" className="hover:underline block">건강토픽</Link></li>
        <li><Link href="/community/best" className="hover:underline block">BEST</Link></li>
        <li><Link href="/community/qa" className="hover:underline block">질문과답</Link></li>
        <li><Link href="/community/daily" className="hover:underline block">건강일상</Link></li>
        {/* <li><Link href="/community/knowhow" className="hover:underline block">노하우</Link></li> */}
        {/* <li><Link href="/community/psychology" className="hover:underline block">심리케어</Link></li> */}
        {/* <li><Link href="/community/wiki" className="hover:underline block">라이펫 위키</Link></li> */}
      </ul>

      {/* ✅ 글쓰기 버튼*/}
      <div className="w-full md:w-auto">
        <Link
          href="/community/write"
          className="block text-center w-auto px-2 py-0.2 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm"
        >
          글쓰기
        </Link>
      </div>
    </div>
  );
}
