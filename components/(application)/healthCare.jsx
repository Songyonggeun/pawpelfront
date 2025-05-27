export default function HealthCareMenu() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 text-sm text-gray-600 p-4 max-w-7xl mx-auto">
      <ul className="flex flex-col md:flex-row gap-4">
        <li><a href="/health/home" className="hover:underline block">건강홈</a></li>
        <li><a href="/health/check" className="hover:underline block">건강체크</a></li>
        <li><a href="/health/consult" className="hover:underline block">수의사상담</a></li>
        <li><a href="/health/guide" className="hover:underline block">애완동물 건강체크 가이드</a></li>
      </ul>
    </div>
  );
}
