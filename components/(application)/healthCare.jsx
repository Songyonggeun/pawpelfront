export default function HealthCareMenu() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 text-sm text-gray-600 p-4 max-w-[1100px] mx-auto ">
      <ul className="flex flex-col md:flex-row gap-4">
        <li><a href="/health/home" className="hover:underline block">건강홈</a></li>
        <li><a href="/health/guide" className="hover:underline block">건강검진 가이드</a></li>
        <li><a href="/health/check/select" className="hover:underline block">건강체크</a></li>
        <li><a href="/health/vaccine/select" className="hover:underline block">접종체크</a></li>
        <li><a href="/health/consult" className="hover:underline block">수의사상담</a></li>
      </ul>
    </div>
  );
}
