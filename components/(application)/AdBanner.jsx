'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdBanner() {
  const [clicked, setClicked] = useState(false);
  const [revenue, setRevenue] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

  // ✅ 페이지 진입 시 수익 불러오기
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch(`${baseUrl}/ads/revenue`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('수익 불러오기 실패');
        const total = await res.json();
        setRevenue(total);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRevenue();
  }, [baseUrl]);

  // ✅ 클릭 시 수익 증가
  const handleClick = async () => {
    if (clicked) return;
    setClicked(true);

    try {
      await fetch(`${baseUrl}/ads/click`, {
        method: 'POST',
        credentials: 'include',
      });
      setRevenue((prev) => prev + 1000);
    } catch (err) {
      console.error('광고 클릭 처리 실패', err);
    } finally {
      setTimeout(() => setClicked(false), 1000);
    }
  };

  return (
    <div className="w-full mb-6 flex flex-col items-center space-y-2">
      <div
        className="w-[930px] h-[200px] relative rounded shadow-md overflow-hidden cursor-pointer border border-gray-300"
        onClick={handleClick}
      >
        <Image
          src="/ad-banner.gif"
          alt="광고 배너"
          fill
          className="object-cover"
          priority
        />
      </div>
      <p className="text-sm text-gray-600 font-medium">
        현재 광고 수익: <span className="text-black font-bold">{revenue.toLocaleString()}원</span>
        
      </p>
    </div>
  );
}
