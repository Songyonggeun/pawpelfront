'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AnimalPanel() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage) return null;

  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/animal`)
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
        console.log("🐾 응답 확인:", data.animals); // 확인용 로그
        setAnimals(data.animals || []);
      })
      .catch((err) => {
        console.error("API 호출 오류:", err.message);
      });
  }, []);

  // 🐶 강아지 / 🐱 고양이 분리 및 3개씩 추출
  const dogs = animals.filter((a) => a.upkind === 417000).slice(0, 3);
  const cats = animals.filter((a) => a.upkind === 422400).slice(0, 3);

  // 🔁 교차 배치: 강-고-강-고-강-고
  const interleaved = [];
  for (let i = 0; i < 3; i++) {
    if (dogs[i]) interleaved.push(dogs[i]);
    if (cats[i]) interleaved.push(cats[i]);
  }

  return (
    <div>
      <h2 className="text-left text-lg font-semibold mb-4">최근 구조된 동물</h2>
      <div className="grid grid-cols-6 gap-4">
        {interleaved.map((animal, index) => (
          <div key={index} className="bg-white rounded-lg p-2 shadow-sm">
            <img
              src={animal.popfile || animal.popfile1 || animal.popfile2}
              alt="동물"
              className="w-full h-[130px] object-cover rounded mb-1"
            />
            <div className="text-center text-sm font-medium">
              {animal.kindNm || animal.kindCd}
            </div>
            <div className="text-center text-xs text-gray-500">
              {animal.age}
            </div>

              {animal.desertionNo && (
                <div className="text-center mt-1">
                  <a
                    href="https://www.animal.go.kr/front/awtis/public/publicList.do?menuNo=1000000055"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs underline hover:text-blue-800"
                  >
                    상세정보 보러가기 
                  </a>
                  <div className="text-[10px] text-gray-400">(공고번호: {animal.noticeNo})</div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
