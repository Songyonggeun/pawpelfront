'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnimalPage() {
  const [animals, setAnimals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

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

  const totalPages = Math.ceil(animals.length / itemsPerPage);
  const currentItems = animals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">구조 동물 목록</h1>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            최근 7일 이내 구조된 동물만 표시됩니다.
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
                <img
                  src={animal.popfile || animal.popfile1 || animal.popfile2}
                  alt="동물"
                  className="w-full h-[220px] object-cover"
                />
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