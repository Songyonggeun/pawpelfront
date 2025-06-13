'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AnimalDetailPage() {
  const { id } = useParams(); // desertionNo
  console.log("🐶 desertionNo 값 확인:", id);
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    setAnimal(null);
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/animal/${id}`)
        .then(res => {
            console.log("📡 응답 상태:", res.status);
            return res.json();
        })
        .then(data => {
            console.log("✅ 응답 데이터:", data);
            setAnimal(data);
        })
        .catch(err => console.error("❌ API 오류:", err));
  }, [id]);
  
  if (!animal) return <div className="text-center py-10">불러오는 중...</div>;

  const sex = animal.sexCd === "M" ? "수컷" : animal.sexCd === "F" ? "암컷" : "미상";
  const neuter = animal.neuterYn === "Y" ? "예" : animal.neuterYn === "N" ? "아니오" : "미상";

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10 space-y-10">
      {/* 이미지 */}
      <div className="w-full overflow-hidden rounded-lg shadow">
        <img
          src={animal.popfile1 || animal.popfile2}
          alt="동물 이미지"
          className="w-full max-h-[400px] object-cover"
        />
      </div>

      {/* 동물의 정보 */}
      <section>
        <h2 className="text-xl font-bold mb-3">🐾 동물의 정보</h2>
        <table className="w-full text-sm border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300">
              <th className="bg-gray-100 px-3 py-2 w-1/4">공고번호</th>
              <td className="px-3 py-2 w-1/4">{animal.noticeNo}</td>
              <th className="bg-gray-100 px-3 py-2 w-1/4">동물등록번호</th>
              <td className="px-3 py-2 w-1/4">{animal.desertionNo}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="bg-gray-100 px-3 py-2">동물종류</th>
              <td className="px-3 py-2">{animal.upKindNm}</td>
              <th className="bg-gray-100 px-3 py-2">품종</th>
              <td className="px-3 py-2">{animal.kindNm}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="bg-gray-100 px-3 py-2">털색</th>
              <td className="px-3 py-2">{animal.colorCd}</td>
              <th className="bg-gray-100 px-3 py-2">성별</th>
              <td className="px-3 py-2">{sex}</td>
            </tr>
            <tr>
              <th className="bg-gray-100 px-3 py-2">중성화 여부</th>
              <td className="px-3 py-2">{neuter}</td>
              <th className="bg-gray-100 px-3 py-2">특징</th>
              <td className="px-3 py-2">{animal.specialMark}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 구조 정보 */}
      <section>
        <h2 className="text-xl font-bold mb-3">📍 구조 정보</h2>
        <table className="w-full text-sm border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300">
              <th className="bg-gray-100 px-3 py-2 w-1/4">구조일</th>
              <td className="px-3 py-2 w-3/4">{formatDate(animal.happenDt)}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="bg-gray-100 px-3 py-2">구조사유</th>
              <td className="px-3 py-2">{animal.happenPlace?.includes("문 열림") ? "문 열림" : "기타"}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="bg-gray-100 px-3 py-2">구조장소</th>
              <td className="px-3 py-2">{animal.happenPlace}</td>
            </tr>
            <tr>
              <th className="bg-gray-100 px-3 py-2">공고기간</th>
              <td className="px-3 py-2">{formatDate(animal.noticeSdt)} ~ {formatDate(animal.noticeEdt)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 보호센터 정보 */}
      <section>
        <h2 className="text-xl font-bold mb-3">🏠 동물보호센터 안내</h2>
        <table className="w-full text-sm border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300">
              <th className="bg-gray-100 px-3 py-2 w-1/4">관할 보호센터명</th>
              <td className="px-3 py-2 w-3/4">{animal.careNm}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="bg-gray-100 px-3 py-2">대표자</th>
              <td className="px-3 py-2">{animal.careOwnerNm || "창원시장"}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="bg-gray-100 px-3 py-2">주소</th>
              <td className="px-3 py-2">{animal.careAddr}</td>
            </tr>
            <tr>
              <th className="bg-gray-100 px-3 py-2">전화번호</th>
              <td className="px-3 py-2">{animal.careTel}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

// 날짜 포맷 YYYYMMDD → YYYY-MM-DD
function formatDate(dateStr) {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}
