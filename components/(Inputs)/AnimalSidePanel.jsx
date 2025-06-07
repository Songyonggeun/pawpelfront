'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AnimalSidePanel() {
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
        const oneDog = data.dog; // 단일 객체
        const oneCat = data.cat; // 단일 객체

        const validAnimals = [oneDog, oneCat].filter(Boolean); // null 검사

        setAnimals(validAnimals);
      })
      .catch((err) => {
        console.error("API 호출 오류:", err.message);
      });
  }, []);

  return (
    <aside className="hidden lg:block w-[200px] shrink-0">
      <div className="bg-amber-50 rounded-lg p-4 shadow-none">
        <h2 className="text-m font-semibold mb-2">최근 구조된 동물</h2>
        {animals.map((animal, index) => (
          <div key={index} className="mb-3 pb-2">
            <img
              src={animal.popfile || animal.popfile1 || animal.popfile2}
              alt="동물"
              className="w-full h-[130px] object-cover rounded mb-1"
            />
            <div className="text-xs font-medium">{animal.kindNm || animal.kindCd}</div>
            <div className="text-xs text-gray-500">{animal.age}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
