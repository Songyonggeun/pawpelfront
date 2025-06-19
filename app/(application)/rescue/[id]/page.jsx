'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AnimalDetailPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/animal/${id}`)
      .then(res => res.json())
      .then(data => {
        setAnimal(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ API 오류:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!animal) return;
    const rawUrl = animal.popfile || animal.popfile1 || animal.popfile2;
    if (!rawUrl) {
      setIsImageLoading(false);
      return;
    }

    if (imageUrl) return; // ✅ 이미지가 이미 설정되어 있으면 재요청 방지

    setIsImageLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/animal/image/download?url=${encodeURIComponent(rawUrl)}`)
      .then(res => res.json())
      .then(data => {
        setImageUrl(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${data.imageUrl}`);
      })
      .catch(() => {
        setImageUrl("");
      })
      .finally(() => {
        setIsImageLoading(false);
      });
  }, [animal]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-gray-600 text-sm">
        🔄 유기동물 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="text-center py-10 text-red-500">
        유기동물 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const sex = animal.sexCd === "M" ? "수컷" : animal.sexCd === "F" ? "암컷" : "미상";
  const neuter = animal.neuterYn === "Y" ? "예" : animal.neuterYn === "N" ? "아니오" : "미상";

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10 space-y-10 animate-fadein">
      {/* 이미지 */}
      <div className="flex justify-center items-center w-full h-[400px]">
        {isImageLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center text-gray-400 text-sm">
            Loading...
          </div>
        ) : !imageUrl ? (
          <div className="w-full h-[400px] flex items-center justify-center text-gray-400 text-sm">
            이미지 없음
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="동물 이미지"
            className="w-[400px] h-[400px] object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* 동물 정보 */}
      <AnimalInfoTable animal={animal} sex={sex} neuter={neuter} />
      <AnimalRescueTable animal={animal} />
      <AnimalCareTable animal={animal} />
    </div>
  );

}
function AnimalInfoTable({ animal, sex, neuter }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">🐾 동물의 정보</h2>
      <table className="w-full text-sm border border-gray-300">
        <tbody>
          <tr className="border-b border-gray-300">
            <th className="bg-gray-100 px-3 py-2 w-1/4 text-sm font-normal text-left">공고번호</th>
            <td className="px-3 py-2 w-1/4">{animal.noticeNo}</td>
            <th className="bg-gray-100 px-3 py-2 w-1/4 text-sm font-normal text-left">등록번호</th>
            <td className="px-3 py-2 w-1/4">{animal.desertionNo}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="bg-gray-100 px-3 py-2 text-sm font-normal text-left">동물종류</th>
            <td className="px-3 py-2">{animal.upKindNm}</td>
            <th className="bg-gray-100 px-3 py-2 text-sm font-normal text-left">품종</th>
            <td className="px-3 py-2">{animal.kindNm}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="bg-gray-100 px-3 py-2 text-sm font-normal text-left">털색</th>
            <td className="px-3 py-2">{animal.colorCd}</td>
            <th className="bg-gray-100 px-3 py-2 text-sm font-normal text-left">성별</th>
            <td className="px-3 py-2">{sex}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 px-3 py-2 text-sm font-normal text-left">중성화</th>
            <td className="px-3 py-2">{neuter}</td>
            <th className="bg-gray-100 px-3 py-2 text-sm font-normal text-left">특징</th>
            <td className="px-3 py-2">{animal.specialMark}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function AnimalRescueTable({ animal }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">📍 구조 정보</h2>
      <table className="w-full text-sm border border-gray-300">
        <tbody>
          <tr className="border-b border-gray-300">
            <th className="bg-gray-100 px-3 py-2 w-1/4 text-sm font-normal text-left">구조일</th>
            <td className="px-3 py-2 w-3/4">{formatDate(animal.happenDt)}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="bg-gray-100 px-3 py-2 text-sm font-normal text-left">구조사유</th>
            <td className="px-3 py-2">{animal.happenPlace?.includes("문 열림") ? "문 열림" : "기타"}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="bg-gray-100 px-3 py-2 text-sm font-normal text-left">구조장소</th>
            <td className="px-3 py-2">{animal.happenPlace}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 px-3 py-2 text-sm font-normal text-left">공고기간</th>
            <td className="px-3 py-2">
              {formatDate(animal.noticeSdt)} ~ {formatDate(animal.noticeEdt)}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function AnimalCareTable({ animal }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">🏠 동물보호센터 안내</h2>
      <table className="w-full text-sm border border-gray-300">
        <tbody>
          <tr className="border-b border-gray-300">
            <th className="bg-gray-100 px-3 py-2 w-1/4 text-sm font-normal text-left">보호센터명</th>
            <td className="px-3 py-2 w-3/4">{animal.careNm}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="bg-gray-100 px-3 py-2 w-1/4 text-sm font-normal text-left">대표자</th>
            <td className="px-3 py-2 w-3/4">{animal.careOwnerNm || "창원시장"}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="bg-gray-100 px-3 py-2 w-1/4 text-sm font-normal text-left">주소</th>
            <td className="px-3 py-2 w-3/4">{animal.careAddr}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 px-3 py-2 w-1/4 text-sm font-normal text-left">전화번호</th>
            <td className="px-3 py-2 w-3/4">{animal.careTel}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}


// 날짜 포맷 YYYYMMDD → YYYY-MM-DD
function formatDate(dateStr) {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}
