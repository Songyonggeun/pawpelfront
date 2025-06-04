'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HealthBanner({ isLoggedIn }) {
  const [healthResults, setHealthResults] = useState([]);
  const containerRef = useRef(null);
  const currentIndex = useRef(0);

  const ITEM_HEIGHT = 36;
  const INTERVAL_MS = 5000;

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUserPets = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        const data = await res.json();
        const pets = data.pets || [];

        const latestResults = pets.map((pet) => {
          const records = pet.healthRecords || [];
          if (records.length === 0) return null;
          const latest = records.slice().sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))[0];
          return {
            petName: pet.petName,
            score: latest.totalScore,
            status: latest.resultStatus,
          };
        }).filter(Boolean);

        setHealthResults([...latestResults, ...latestResults]);
      } catch (err) {
        console.error('건강 데이터 로딩 실패', err);
      }
    };

    fetchUserPets();
  }, [isLoggedIn]);

  useEffect(() => {
    if (healthResults.length === 0) return;

    const interval = setInterval(() => {
      currentIndex.current += 1;

      const container = containerRef.current;
      if (!container) return;

      container.style.transition = 'transform 0.4s ease-in-out';
      container.style.transform = `translateY(-${ITEM_HEIGHT * currentIndex.current}px)`;

      if (currentIndex.current >= healthResults.length / 2) {
        setTimeout(() => {
          container.style.transition = 'none';
          container.style.transform = 'translateY(0)';
          currentIndex.current = 0;
        }, 400); 
      }
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [healthResults]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-[600px] bg-gray-100 text-gray-500 py-2 px-4 text-xs font-bold text-center rounded">
        로그인해서 반려동물 건강체크를 해보세요!
      </div>
    );
  }

  if (healthResults.length === 0) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '양호': return 'bg-emerald-400';
      case '경고': return 'bg-yellow-300';
      case '위험': return 'bg-rose-400';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Link href="/myPage/health" className="block">
      <div className="overflow-hidden h-[36px] bg-white rounded-lg px-4 cursor-pointer hover:opacity-90">
        <div ref={containerRef} className="flex flex-col">
          {healthResults.map((pet, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded shadow-sm"
              style={{ height: `${ITEM_HEIGHT}px` }}
            >
              <span className="font-bold text-sm">{pet.petName}</span>
              <span className="font-extrabold text-sm">{pet.score}점</span>
              <span className={`text-white text-xs rounded-full px-2 py-0.5 ${getStatusBadgeClass(pet.status)}`}>
                {pet.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
