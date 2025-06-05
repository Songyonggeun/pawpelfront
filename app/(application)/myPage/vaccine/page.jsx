'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuComponents from '@/components/(application)/menu';

const VACCINE_STEPS = [
  "1차접종(종합백신+코로나 장염)",
  "2차접종(종합백신+코로나 장염)",
  "3차접종(종합백신+켄넬코프)",
  "4차접종(종합백신+켄넬코프)",
  "5차접종(종합백신+인플루엔자)",
  "6차접종(광견병+인플루엔자)",
  '종합백신'
];

export default function PetVaccineSection() {
  const [pets, setPets] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPetIds, setExpandedPetIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();

        const petsWithVaccines = await Promise.all(
          (data.pets || []).map(async (pet) => {
            const vaccineRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/vaccine/history?petId=${pet.id}`, {
              credentials: 'include',
            });
            const vaccineRecords = vaccineRes.ok ? await vaccineRes.json() : [];
            return { ...pet, vaccineRecords };
          })
        );

        setUserInfo(data);
        setPets(petsWithVaccines);
      } catch (err) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const calcNextDates = (firstDate) => {
    if (!firstDate) return [];
    const result = [];
    let baseDate = new Date(firstDate);
    for (let i = 1; i < VACCINE_STEPS.length; i++) {
      baseDate.setDate(baseDate.getDate() + 21);
      result.push(new Date(baseDate));
    }
    return result;
  };

  const getDday = (date) => {
    const today = new Date();
    const target = new Date(date);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D-${diff}` : '지남';
  };

  const menuItems = [
    { title: '회원 정보 수정', href: '/myPage/checkpw' },
    { title: '건강체크 기록', href: '/myPage/health' },
    { title: '백신접종 기록', href: '/myPage/vaccine' },
    { title: '작성 글', href: '/myPage/posts' },
  ];

  const toggleExpand = (petId) => {
    setExpandedPetIds((prev) =>
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  };

  if (loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row max-w-[1100px] mx-auto px-6 py-6 gap-10">
      <aside className="w-full md:w-60 flex-shrink-0 md:mr-10 order-2 md:order-1 mt-10 md:mt-0 bg-gray-50 min-h-[80vh]">
        <nav className="mt-[10px] px-[10px]">
          <ul className="space-y-3">
            <MenuComponents data={menuItems} />
          </ul>
        </nav>
      </aside>

      <main className="flex-1 order-1 md:order-2">
        <section>
          <h2 className="text-lg font-semibold mb-4">백신접종 내역</h2>

          <div className="flex flex-col gap-4">
            {pets.map((pet) => {
              const vaccineMap = Object.fromEntries(
                pet.vaccineRecords.map((r) => [r.vaccineName, r])
              );
              const firstVaccine = vaccineMap[VACCINE_STEPS[0]];
              const nextDates = firstVaccine ? calcNextDates(firstVaccine.vaccinatedAt) : [];

              return (
                <div key={pet.id} className="border border-gray-300 rounded-lg bg-white shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {pet.imageUrl ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${pet.thumbnailUrl || pet.imageUrl}`}
                          alt={pet.petName}
                          className="w-24 h-24 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full mr-4" />
                      )}
                      <div>
                        <div className="text-lg font-semibold">{pet.petName}</div>
                        <div className="text-sm text-gray-500">{new Date().getFullYear() - pet.petAge}세</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(pet.id)}
                      className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      백신기록 보기
                    </button>
                  </div>

                  {expandedPetIds.includes(pet.id) && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-xs table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-3 py-2 text-center whitespace-nowrap">백신 단계</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">접종일</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">다음 예정일</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">D-Day</th>
                          </tr>
                        </thead>
                        <tbody>
                          {VACCINE_STEPS.map((step, idx) => {
                            const record = vaccineMap[step];
                            const nextDate = firstVaccine && idx > 0 ? formatDate(nextDates[idx - 1]) : '-';
                            const dday = firstVaccine && idx > 0 ? getDday(nextDates[idx - 1]) : '-';

                            return (
                              <tr key={step} className="border-t border-gray-200">
                                <td className="px-3 py-2 text-center whitespace-nowrap">{step}</td>
                                <td className="px-3 py-2 text-center whitespace-nowrap">{record ? formatDate(record.vaccinatedAt) : '-'}</td>
                                <td className="px-3 py-2 text-center whitespace-nowrap">{nextDate}</td>
                                <td className={`px-3 py-2 text-center whitespace-nowrap ${record ? 'text-green-600 font-semibold' : ''}`}>
                                  {record ? (
                                    <>
                                      완료
                                      {idx > 0 && nextDates[idx - 1] && (() => {
                                        const expectedDate = new Date(nextDates[idx - 1]);
                                        const actualDate = new Date(record.vaccinatedAt);
                                        const diffDays = Math.floor((actualDate - expectedDate) / (1000 * 60 * 60 * 24));
                                        if (diffDays === 0) return null;
                                        const diffColor = diffDays < 0 ? 'text-blue-500' : 'text-red-500';
                                        return (
                                          <span className={`ml-1 ${diffColor}`}>
                                            ({diffDays < 0 ? `-${-diffDays}` : `+${diffDays}`}일)
                                          </span>
                                        );
                                      })()}
                                    </>
                                  ) : dday}
                                </td>

                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
