'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HealthHome() {
  const [pet, setPet] = useState(null);
  const [dDay, setDDay] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // API 호출
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/pet`)
      .then((res) => res.json())
      .then((data) => {
        setPet(data);
        const dDayValue = calculateDDay(data.age, data.lastCheckupDate);
        setDDay(dDayValue); 
      });
  }, []);

  const calculateDDay = (age, lastCheckupDate) => {
    // 권장 검진 주기 (예: 0-3세: 1년, 4-7세: 6개월, 8세 이상: 3개월)
    const months =
      age <= 3 ? 12 : age <= 7 ? 6 : 3;

    const lastDate = new Date(lastCheckupDate);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + months);

    const today = new Date();
    const diffTime = nextDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const getBadgeColor = () => {
    if (dDay <= 0) return 'bg-red-500';
    if (dDay <= 7) return 'bg-yellow-400';
    return 'bg-blue-400';
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* 상단 프로필 박스 */}
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div>
            <div className="font-bold text-lg">{pet?.name || '이름 없음'}</div>
            <div className="text-gray-600 text-sm">{pet?.type} · {pet?.age}살</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-600">검진 권장 시기</div>
          {dDay !== null && (
            <div className={`inline-block mt-1 px-3 py-1 text-white text-sm rounded-full ${getBadgeColor()}`}>
              D{dDay > 0 ? '-' + dDay : 'day'}
            </div>
          )}
        </div>
      </div>

      {/* 아이콘 3개 */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div onClick={() => router.push('/check')} className="cursor-pointer">
          <div className="w-14 h-14 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">✓</div>
          <div className="mt-2 text-sm text-gray-800 font-medium">건강체크</div>
        </div>
        <div onClick={() => router.push('/consult')} className="cursor-pointer">
          <div className="w-14 h-14 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-2xl font-bold">💬</div>
          <div className="mt-2 text-sm text-gray-800 font-medium">수의사 상담</div>
        </div>
        <div onClick={() => router.push('/guide')} className="cursor-pointer">
          <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">📘</div>
          <div className="mt-2 text-sm text-gray-800 font-medium">건강체크 가이드</div>
        </div>
      </div>
    </div>
  );
}
