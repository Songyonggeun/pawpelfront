'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HealthBanner({ isLoggedIn }) {
  const [healthResults, setHealthResults] = useState([]);
  const [vaccineResults, setVaccineResults] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const [petsExist, setPetsExist] = useState(false);
  const containerRef = useRef(null);
  const currentIndex = useRef(0);

  const ITEM_HEIGHT = 36;
  const INTERVAL_MS = 5000;

  const VACCINE_SEQUENCE = [
    '1차접종', '2차접종', '3차접종',
    '4차접종', '5차접종', '6차접종', '종합백신'
  ];

  useEffect(() => {
    const checkWidth = () => {
      setShowBanner(window.innerWidth > 1250);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !showBanner) return;

    const fetchUserPets = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        const data = await res.json();
        const pets = data.pets || [];
        setPetsExist(pets.length > 0);

        const healthList = [];
        const vaccineList = [];

        for (const pet of pets) {
          // 건강체크
          const records = pet.healthRecords || [];
          if (records.length > 0) {
            const latest = records.slice().sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))[0];
            healthList.push({
              type: 'health',
              petName: pet.petName,
              score: latest.totalScore,
              status: latest.resultStatus,
            });
          }

          // 백신기록
          const vaccineRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/vaccine/history?petId=${pet.id}`, {
            credentials: 'include',
          });
          const vaccineRecords = vaccineRes.ok ? await vaccineRes.json() : [];

          const validRecords = vaccineRecords.filter(r =>
            !isNaN(new Date(r.vaccinatedAt).getTime())
          );

          if (validRecords.length > 0) {
            const latest = validRecords.reduce((acc, curr) =>
              new Date(curr.vaccinatedAt) > new Date(acc.vaccinatedAt) ? curr : acc
            );

            const simplifyVaccineName = (fullName) => {
              for (let name of VACCINE_SEQUENCE) {
                if (fullName.startsWith(name)) return name;
              }
              return '백신';
            };

            const currentName = simplifyVaccineName(latest.vaccineName);
            const currentIndex = VACCINE_SEQUENCE.indexOf(currentName);
            let nextVaccineName = currentName;

            if (currentIndex >= 0 && currentIndex < VACCINE_SEQUENCE.length - 1) {
              nextVaccineName = VACCINE_SEQUENCE[currentIndex + 1];
            } else if (currentName === '종합백신') {
              nextVaccineName = '종합백신';
            }

            const vaccinationDate = new Date(latest.vaccinatedAt);
            const intervalDays = currentName === '종합백신' ? 365 : 21;
            const nextDate = new Date(vaccinationDate);
            nextDate.setDate(nextDate.getDate() + intervalDays);

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dday = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

            vaccineList.push({
              type: 'vaccine',
              petName: pet.petName,
              vaccineName: nextVaccineName,
              dday,
            });
          }
        }

        setHealthResults(healthList);
        setVaccineResults(vaccineList);
      } catch (err) {
        console.error('건강 및 접종 데이터 로딩 실패', err);
      }
    };

    fetchUserPets();
  }, [isLoggedIn, showBanner]);

  useEffect(() => {
    const combinedSlides = [...healthResults, ...vaccineResults];
    if (combinedSlides.length <= 1) return;

    const interval = setInterval(() => {
      currentIndex.current += 1;

      const container = containerRef.current;
      if (!container) return;

      container.style.transition = 'transform 0.4s ease-in-out';
      container.style.transform = `translateY(-${ITEM_HEIGHT * currentIndex.current}px)`;

      if (currentIndex.current >= combinedSlides.length) {
        setTimeout(() => {
          container.style.transition = 'none';
          container.style.transform = 'translateY(0)';
          currentIndex.current = 0;
        }, 400);
      }
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [healthResults, vaccineResults]);

  if (!showBanner) return null;

  if (!isLoggedIn) {
    return (
      <Link href="/login" className="block">
        <div className="max-w-[600px] bg-gray-100 text-gray-500 py-2 px-4 text-xs font-bold text-center rounded-2xl hover:bg-gray-200 cursor-pointer">
          로그인하고 반려동물의 건강 상태를 확인해보세요!
        </div>
      </Link>
    );
  }

  if (!petsExist) {
    return (
      <Link href="/myPage" className="block">
        <div className="max-w-[600px] bg-gray-100 text-gray-500 py-2 px-4 text-xs font-bold text-center rounded-2xl hover:bg-gray-200 cursor-pointer">
          반려동물을 등록해보세요!
        </div>
      </Link>
    );
  }

  const combinedSlides = [...healthResults, ...vaccineResults];

  if (petsExist && combinedSlides.length === 0) {
    return (
      <Link href="/myPage" className="block">
        <div className="max-w-[600px] bg-gray-100 text-gray-500 py-2 px-4 text-xs font-bold text-center rounded-2xl hover:bg-gray-200 cursor-pointer">
          반려동물의 건강 상태를 확인해보세요!
        </div>
      </Link>
    );
  }

  // if (combinedSlides.length === 0) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '양호': return 'bg-green-700';
      case '경고': return 'bg-orange-600';
      case '위험': return 'bg-red-700';
      default: return 'bg-gray-300';
    }
  };

  const getDdayClass = (dday) => {
    return dday >= 0 ? 'text-green-600' : 'text-red-500';
  };

  return (
    <div className="overflow-hidden h-[36px] bg-white rounded-2xl px-4 cursor-pointer hover:opacity-90">
      <div ref={containerRef} className="flex flex-col">
        {combinedSlides.map((item, index) => (
          <Link
            key={index}
            href={item.type === 'health' ? '/myPage/health' : '/myPage/vaccine'}
            className="block"
          >
            {/* <div
              className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-xl shadow-sm"
              style={{ height: `${ITEM_HEIGHT}px` }}
            > */}
            <div
              className="flex items-center justify-center gap-x-2 px-4 py-2 bg-gray-100 rounded-xl shadow-sm"
              style={{ height: `${ITEM_HEIGHT}px` }}
            >
              <span className="font-bold text-sm whitespace-nowrap min-w-0 truncate">{item.petName}</span>
              {item.type === 'health' ? (
                <>
                  <span className="font-extrabold text-sm whitespace-nowrap min-w-0 truncate">{item.score}점</span>
                  <span className={`text-white text-xs rounded-full px-2 py-0.5 ${getStatusBadgeClass(item.status)} whitespace-nowrap min-w-0 truncate`}>
                    {item.status}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600 whitespace-nowrap min-w-0 truncate">{item.vaccineName}</span>
                  <span className={`text-sm font-bold whitespace-nowrap min-w-0 truncate ${getDdayClass(item.dday)}`}>
                    D{item.dday >= 0 ? '-' : '+'}{Math.abs(item.dday)}
                  </span>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>

  );
}
