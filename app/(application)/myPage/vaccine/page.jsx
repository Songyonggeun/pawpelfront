'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuComponents from '@/components/(application)/menu';

export default function PetVaccineSection() {
  const [pets, setPets] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const menuItems = [
    { title: '회원 정보 수정', href: '/myPage/checkpw' },
    { title: '건강체크 기록', href: '/myPage/health' },
    { title: '백신접종 기록', href: '/myPage/vaccine' },
    { title: '작성 글', href: '/myPage/posts' },
  ];

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
            {pets.map((pet) => (
              <div key={pet.id} className="flex border border-gray-300 rounded-lg bg-white shadow-sm p-4">
                <div className="flex flex-col items-center justify-center w-32 mr-6">
                  {pet.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${pet.thumbnailUrl || pet.imageUrl}`}
                      alt={pet.petName}
                      className="w-24 h-24 rounded-full object-cover mb-2"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full mb-2" />
                  )}
                  <div className="text-center font-semibold">{pet.petName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date().getFullYear() - pet.petAge}세
                  </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                  {pet.vaccineRecords && pet.vaccineRecords.length > 0 ? (
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
                        {pet.vaccineRecords.map((record, idx) => (
                          <tr key={idx} className="border-t border-gray-200">
                            <td className="px-3 py-2 text-center whitespace-nowrap">{record.vaccineName}</td>
                            <td className="px-3 py-2 text-center whitespace-nowrap">{formatDate(record.vaccinatedAt)}</td>
                            <td className="px-3 py-2 text-center whitespace-nowrap">{formatDate(record.nextVaccinationDate)}</td>
                            <td className="px-3 py-2 text-center whitespace-nowrap">
                              {(() => {
                                const currentName = record.vaccineName;
                                const vaccineNames = pet.vaccineRecords.map(r => r.vaccineName);

                                // 백신 단계 추출 (1차 ~ 6차 or 종합)
                                const match = currentName.match(/^(\d)차접종/);
                                const isComprehensive = currentName.includes('종합백신');

                                let isCompleted = false;

                                if (match) {
                                  const currentStep = parseInt(match[1]);
                                  const nextStep = currentStep + 1;

                                  if (nextStep <= 6) {
                                    isCompleted = vaccineNames.some(name => name.startsWith(`${nextStep}차접종`));
                                  } else {
                                    isCompleted = vaccineNames.some(name => name.includes('종합백신'));
                                  }
                                } else if (isComprehensive) {
                                  const currentDate = new Date(record.vaccinatedAt);
                                  isCompleted = pet.vaccineRecords.some(other =>
                                    other.vaccineName.includes('종합백신') &&
                                    new Date(other.vaccinatedAt) > currentDate
                                  );
                                }

                                return isCompleted ? (
                                  <span className="text-green-600 font-semibold">완료</span>
                                ) : (
                                  record.dday
                                );
                              })()}
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-sm text-center text-gray-400">접종 내역 없음</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
