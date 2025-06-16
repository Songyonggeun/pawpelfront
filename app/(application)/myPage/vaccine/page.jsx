'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const VACCINE_STEPS = [
  "1차접종(종합백신+코로나 장염)",
  "2차접종(종합백신+코로나 장염)",
  "3차접종(종합백신+켄넬코프)",
  "4차접종(종합백신+켄넬코프)",
  "5차접종(종합백신+인플루엔자)",
  "6차접종(광견병+인플루엔자)",
  "종합백신(1년 주기)",
];

export default function PetVaccineSection() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPetIds, setExpandedPetIds] = useState([]);
  const [editModal, setEditModal] = useState({ open: false, petId: null, step: null, oldDate: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, petId: null, vaccinatedAt: null });
  const [newDate, setNewDate] = useState('');
  const router = useRouter();

// 모달 공통: ESC 닫기 이벤트 처리
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setEditModal({ open: false, petId: null, step: null, oldDate: null });
      setDeleteModal({ open: false, petId: null, vaccinatedAt: null });
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);


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

        setPets(petsWithVaccines);
        setExpandedPetIds(petsWithVaccines.map((pet) => pet.id));
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

  const getDday = (date) => {
    const today = new Date();
    const target = new Date(date);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  const calcVaccineSchedule = (vaccineMap) => {
    const schedule = [];
    let lastDate = null;
    let lastStep = 0;

    for (let i = 0; i < VACCINE_STEPS.length; i++) {
      const step = i + 1;
      const record = vaccineMap[step];
      const label = VACCINE_STEPS[i];

      if (record?.vaccinatedAt) {
        lastDate = new Date(record.vaccinatedAt);
        lastStep = step;
        schedule.push({ step, label, record, nextDate: null, dday: '완료', status: 'done' });
      } else {
        const interval = step <= 6 ? 14 : 365;
        if (lastDate) {
          lastDate = new Date(lastDate);
          lastDate.setDate(lastDate.getDate() + interval);
          const now = new Date();
          const diff = Math.ceil((lastDate - now) / (1000 * 60 * 60 * 24));
          let status = 'future';
          if (step === lastStep + 1) {
            status = diff >= 0 ? 'next-upcoming' : 'next-overdue';
          }
          schedule.push({ step, label, record: null, nextDate: new Date(lastDate), dday: getDday(lastDate), status });
        } else {
          schedule.push({ step, label, record: null, nextDate: null, dday: '-', status: 'unknown' });
        }
      }
    }

    return schedule.sort((a, b) => {
      // 1차~6차: 고정 순서 유지
      if (a.step <= 6 && b.step <= 6) return a.step - b.step;

      // 종합백신: 날짜 순 정렬
      if (a.step > 6 && b.step > 6) {
        const aDate = new Date(a.record?.vaccinatedAt || a.nextDate);
        const bDate = new Date(b.record?.vaccinatedAt || b.nextDate);
        return aDate - bDate;
      }

      // 1~6차는 종합백신보다 앞에 위치
      return a.step - b.step;
    });
  };

  const toggleExpand = (petId) => {
    setExpandedPetIds((prev) =>
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  };
  
  const handleUpdate = (petId, step, vaccinatedAt) => {
    setEditModal({ open: true, petId, step, oldDate: vaccinatedAt });
    setNewDate(vaccinatedAt); // 기존 날짜를 기본값으로
  };

  const handleDelete = (petId, vaccinatedAt) => {
    setDeleteModal({ open: true, petId, vaccinatedAt });
  };

  if (loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  return (
    <>

      {/* ✅ 수정 모달 */}
      {editModal.open && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
    onClick={() => setEditModal({ open: false, petId: null, step: null, oldDate: null })}
  >
    <div
      className="bg-white p-6 rounded shadow-md w-[300px]"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold mb-4">접종일 수정</h3>
      <input
        type="date"
        className="w-full border p-2 mb-4"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setEditModal({ open: false, petId: null, step: null, oldDate: null })}
        >
          취소
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={async () => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/vaccine/update?petId=${editModal.petId}&vaccinatedAt=${editModal.oldDate}&step=${editModal.step}&selectedDate=${newDate}`,
              {
                method: 'PUT',
                credentials: 'include',
              }
            );
            if (res.ok) {
              alert('수정 완료');
              location.reload();
            } else {
              alert('수정 실패');
            }
          }}
          disabled={!newDate}
        >
          확인
        </button>
      </div>
    </div>
  </div>
)}


      {/* 삭제 모달 */}
      {deleteModal.open && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm"
    onClick={() => setDeleteModal({ open: false, petId: null, vaccinatedAt: null })}
  >
    <div
      className="bg-white p-6 rounded shadow-md w-[300px]"
      onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
    >
      <h3 className="text-lg font-semibold mb-4">정말 삭제하시겠습니까?</h3>
      <div className="flex justify-end space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setDeleteModal({ open: false, petId: null, vaccinatedAt: null })}
        >
          취소
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={async () => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/vaccine/vaccine/delete?petId=${deleteModal.petId}&vaccinatedAt=${deleteModal.vaccinatedAt}`,
              {
                method: 'DELETE',
                credentials: 'include',
              }
            );
            if (res.ok) {
              alert('삭제 완료');
              location.reload();
            } else {
              alert('삭제 실패');
            }
          }}
        >
          확인
        </button>
      </div>
    </div>
  </div>
)}


      <main className="flex-1 order-1 md:order-2">
        <section>
          <h2 className="text-lg font-semibold mb-4">백신접종 내역</h2>

          <div className="flex flex-col gap-4">
            {pets.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <p className="mb-4">등록된 반려동물이 없습니다.<br />펫을 등록해주세요.</p>
                <button
                  onClick={() => router.push('/myPage')}
                  className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  등록하러 가기
                </button>
              </div>
            ) : (
              pets.map((pet) => {
                const vaccineMap = Object.fromEntries(
                  pet.vaccineRecords.map((r) => [r.step, r])
                );

                const schedule = calcVaccineSchedule(vaccineMap);

                return (
                  <div key={pet.id} className="border border-gray-300 rounded-lg bg-white shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {pet.imageUrl ? (
                          <img
                            src={
                              pet.thumbnailUrl || pet.imageUrl
                                ? (pet.thumbnailUrl || pet.imageUrl).startsWith("/images/profile/")
                                    ? pet.thumbnailUrl || pet.imageUrl
                                    : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${pet.thumbnailUrl || pet.imageUrl}`
                                : defaultImage
                            }
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
                        {expandedPetIds.includes(pet.id) ? '백신기록 숨기기' : '백신기록 보기'}
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
                              <th className="px-3 py-2 text-center whitespace-nowrap">관리</th>
                            </tr>
                          </thead>
                          <tbody>
                            {schedule.map((item) => (
                              <tr key={item.step} className="border-t border-gray-200">
                                <td className="px-3 py-2 text-center whitespace-nowrap">{item.label}</td>
                                <td className="px-3 py-2 text-center whitespace-nowrap">
                                  {item.record ? formatDate(item.record.vaccinatedAt) : '-'}
                                </td>
                                <td className={`px-3 py-2 text-center whitespace-nowrap ${
                                  item.status === 'done' ? 'text-gray-400' : item.status === 'future' ? 'text-gray-400' : ''
                                }`}>
                                  {item.nextDate && item.status !== 'done' ? formatDate(item.nextDate) : '-'}
                                </td>
                                <td className={`px-3 py-2 text-center whitespace-nowrap ${
                                  item.status === 'done'
                                    ? 'text-green-600 font-semibold'
                                    : item.status === 'next-upcoming'
                                    ? 'text-green-600 font-semibold'
                                    : item.status === 'next-overdue'
                                    ? 'text-red-500 font-semibold'
                                    : item.status === 'future'
                                    ? 'text-gray-400'
                                    : ''
                                }`}>
                                  {item.status === 'done' ? '완료' : item.dday}
                                </td>
                                <td className="px-3 py-2 text-center whitespace-nowrap text-blue-600 space-x-2">
                                  {item.status === 'done' && item.record ? (
                                    <>
                                      <span
                                        onClick={() => handleUpdate(pet.id, item.step, item.record.vaccinatedAt)}
                                        className="cursor-pointer hover:underline"
                                      >
                                        수정
                                      </span>
                                      <span
                                        onClick={() => handleDelete(pet.id, item.record.vaccinatedAt)}
                                        className="cursor-pointer hover:underline text-red-500"
                                      >
                                        삭제
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </>
  );
}
