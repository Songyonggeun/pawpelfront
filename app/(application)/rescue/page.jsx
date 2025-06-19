'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnimalPage() {
  const [animals, setAnimals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});
  const itemsPerPage = 8;

  const totalPages = Math.ceil(animals.length / itemsPerPage);

  const currentItems = animals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/animal/all`)
  .then((res) => res.json())
  .then((data) => console.log("총 동물 수:", data.animals.length));

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/animal/all`)
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error("JSON 아님: " + text);
        }
      })
      .then((data) => {
        setAnimals(data.animals || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API 호출 오류:", err.message);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (animals.length === 0) return;

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const isImageAccessible = async (url, retry = 3, delayMs = 300) => {
      for (let i = 0; i < retry; i++) {
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) return true;
        } catch {}
        await delay(delayMs);
      }
      return false;
    };

    const fetchImageUrls = async () => {
      const downloadImage = async (animal) => {
        const rawUrl = animal.popfile || animal.popfile1 || animal.popfile2;
        if (!rawUrl) return { [animal.desertionNo]: "" };

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/animal/image/download?url=${encodeURIComponent(rawUrl)}`,
            { credentials: "include" }
          );
          if (!res.ok) throw new Error("응답 실패");

          const data = await res.json();
          const imageUrl = `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${data.thumbnailUrl}`;

          const ok = await isImageAccessible(imageUrl, 3, 300);
          if (!ok) {
            console.warn("⚠️ 이미지 접근 최종 실패:", imageUrl);
            return { [animal.desertionNo]: "" };
          }

          return { [animal.desertionNo]: imageUrl };
        } catch (e) {
          return { [animal.desertionNo]: "" };
        }
      };

      // ✅ animals 전체를 8개씩 쪼개서 순차 병렬 다운로드
      const batchSize = 8;
      const delayMs = 500;

      for (let i = 0; i < animals.length; i += batchSize) {
        const batch = animals.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(downloadImage));
        const batchMap = Object.assign({}, ...results);
        setImageUrls((prev) => ({ ...prev, ...batchMap }));
        await delay(delayMs);
      }
    };

    fetchImageUrls();
  }, [animals]);


  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">구조 동물 목록</h1>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            최근 7일 이내 구조된 동물만 표시됩니다. (최대 50마리)
          </p>
          <a
            href="https://www.animal.go.kr/front/awtis/public/publicList.do?menuNo=1000000055#moveUrl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:underline whitespace-nowrap"
          >
            다른 동물 더보기 &gt;
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 animate-pulse rounded-xl h-[340px]"
              ></div>
            ))
          : currentItems.map((animal, index) => (
              <Link
                key={index}
                href={`/rescue/${animal.desertionNo}`}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition"
              >
              {
                imageUrls[animal.desertionNo] === undefined ? (
                  <div className="w-full h-[220px] bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                    Loading...
                  </div>
                ) : !imageUrls[animal.desertionNo] ? (
                  <div className="w-full h-[220px] bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                    이미지 없음
                  </div>
                ) : (
                  <img
                    src={imageUrls[animal.desertionNo]}
                    alt="동물 이미지"
                    className="w-full h-[220px] object-cover"
                    loading="lazy"
                  />
                )
              }
                <div className="p-4 flex flex-col flex-grow text-sm text-gray-700">
                  <div className="space-y-1 text-sm text-gray-700 pl-1">
                    <div className="flex">
                      <span className="text-gray-500 w-20 shrink-0">공고번호</span>
                      <span>{animal.noticeNo || "-"}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20 shrink-0">성별</span>
                      <span>
                        {animal.sexCd === "M"
                          ? "수컷"
                          : animal.sexCd === "F"
                          ? "암컷"
                          : animal.sexCd === "Q"
                          ? "미상"
                          : "-"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20 shrink-0">발견장소</span>
                      <span className="truncate">{animal.happenPlace || "-"}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20 shrink-0">특징</span>
                      <span className="truncate">{animal.specialMark || "-"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* 페이지네이션 */}
      {!loading && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === idx + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}