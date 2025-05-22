import Link from 'next/link'; // Link 추가

export default function CommunityMenu() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 text-sm text-gray-600 p-4 max-w-7xl mx-auto">
      <ul className="flex flex-col md:flex-row gap-4">
        <li><Link href="/community/home" className="hover:underline block">홈</Link></li>
        <li><Link href="/community/total" className="hover:underline block">전체글</Link></li>
        <li><a href="/community/topic" className="hover:underline block">건강토픽</a></li>
        <li><a href="/community/best" className="hover:underline block">BEST</a></li>
        <li><a href="/community/qa" className="hover:underline block">질문과답</a></li>
        <li><a href="/community/daily" className="hover:underline block">건강일상</a></li>
        <li><a href="/community/knowhow" className="hover:underline block">노하우</a></li>
        <li><a href="/community/psychology" className="hover:underline block">심리케어</a></li>
        <li><a href="/community/wiki" className="hover:underline block">라이펫 위키</a></li>
      </ul>
    </div>
  );
}
