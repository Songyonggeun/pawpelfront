export default function CommunityMenu() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 text-sm text-gray-600 p-4 max-w-7xl mx-auto lg:ml-34">
      {/* 메뉴 항목 */}
      <ul className="flex flex-col md:flex-row gap-4">
        <li><a href="/community/home" className="hover:underline block">홈</a></li>
        <li><a href="/community/all" className="hover:underline block">전체글</a></li>
        <li><a href="/community/topic" className="hover:underline block">건강토픽</a></li>
        <li><a href="/community/best" className="hover:underline block">BEST</a></li>
        <li><a href="/community/qa" className="hover:underline block">질문과답</a></li>
        <li><a href="/community/daily" className="hover:underline block">건강일상</a></li>
        <li><a href="/community/knowhow" className="hover:underline block">노하우</a></li>
        <li><a href="/community/psychology" className="hover:underline block">심리케어</a></li>
        <li><a href="/community/wiki" className="hover:underline block">라이펫 위키</a></li>
      </ul>

      {/* 글쓰기 버튼 */}
      <div className="self-start md:self-auto">
        <a
          href="/community/write"
          className="block px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition"
        >
          글쓰기
        </a>
      </div>
    </div>
  );
}
