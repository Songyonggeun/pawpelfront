"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AnimalPanel() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage) return null;

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (animal) => {
    const rawUrl = animal.popfile || animal.popfile1 || animal.popfile2 || "";
    if (!rawUrl) return "/images/no-image.png";
    return `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/animal/image?url=${encodeURIComponent(rawUrl)}`;
  };

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
        setAnimals(data.animals || []);
      })
      .catch((err) => {
        console.error("API 호출 오류:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const dogs = animals.filter((a) => a.upkind === 417000).slice(0, 3);
  const cats = animals.filter((a) => a.upkind === 422400).slice(0, 3);

  const interleaved = [];
  for (let i = 0; i < 3; i++) {
    if (dogs[i]) interleaved.push(dogs[i]);
    if (cats[i]) interleaved.push(cats[i]);
  }
return (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">최근 구조된 동물</h2>
      <Link
        href="/rescue"
        className="text-sm text-gray-500 hover:underline whitespace-nowrap"
      >
        더보기 &gt;
      </Link>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse rounded-lg p-2 shadow-sm"
            >
              <div className="w-full h-[130px] bg-gray-300 rounded mb-2" />
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          ))
        : interleaved.map((animal, index) => (
            <Link
              key={index}
              href={`/rescue/${animal.desertionNo}`}
              className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition duration-200"
            >
              <img
                src={getImageUrl(animal)}
                alt="동물"
                className="w-full h-[130px] object-cover rounded mb-1"
              />
              <div className="text-center text-sm font-medium">
                {animal.kindNm || animal.kindCd}
              </div>
              <div className="text-center text-xs text-gray-500">
                {animal.age}
              </div>
            </Link>
          ))}
    </div>
  </div>
);

}
