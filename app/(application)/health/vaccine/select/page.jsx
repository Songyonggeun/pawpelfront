'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VaccineForm() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [vaccineRecords, setVaccineRecords] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('unauthorized');
        const data = await res.json();
        setUserInfo(data);
        setPets(data.pets || []);
        setIsAuthChecked(true);
      } catch (err) {
        router.replace('/login');
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (!selectedPetId) return;

    const fetchVaccineHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/vaccine/history?petId=${selectedPetId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('백신 기록 불러오기 실패');
        const data = await res.json();
        setVaccineRecords(data);
      } catch (err) {
        console.error(err);
        setVaccineRecords([]);
      }
    };

    fetchVaccineHistory();
  }, [selectedPetId]);

  if (!isAuthChecked) return null;

  const handleSubmit = async () => {
    if (!selectedPetId) {
      alert('반려동물을 선택해주세요.');
      return;
    }

    const selectedPet = pets.find((p) => p.id === selectedPetId);
    const selectedDateObj = new Date(date);
    console.log('selectedPet:', selectedPet);
console.log('healthRecords:', selectedPet.healthRecords);
console.log('selectedPet keys:', Object.keys(selectedPet));

    const firstDose = vaccineRecords.find((r) => r.step === 1);
    if (firstDose && step > 1) {
      const firstDate = new Date(firstDose.vaccinatedAt);
      if (selectedDateObj <= firstDate) {
        alert(`${step}차 접종일은 반드시 1차 접종일(${firstDate.toLocaleDateString('ko-KR')}) 이후여야 합니다.`);
        return;
      }
    }

    if (step > 1 && step <= 6) {
      for (let prev = 1; prev < step; prev++) {
        const exists = vaccineRecords.some((r) => r.step === prev);
        if (!exists) {
          const confirm = window.confirm(`${prev}차 접종 기록이 없습니다. 계속 진행할까요?`);
          if (!confirm) return;
          break;
        }
      }
    }

    if (step === 7) {
      const last6 = vaccineRecords.find((r) => r.step === 6);
      if (last6 && selectedDateObj <= new Date(last6.vaccinatedAt)) {
        alert(`종합백신은 6차 접종일 이후여야 합니다.`);
        return;
      }
      if (firstDose && selectedDateObj <= new Date(firstDose.vaccinatedAt)) {
        alert(`종합백신은 반드시 1차 접종일 이후여야 합니다.`);
        return;
      }
      const previousAnnual = vaccineRecords.filter((r) => r.step === 7).sort((a, b) => new Date(b.vaccinatedAt) - new Date(a.vaccinatedAt))[0];
      if (previousAnnual) {
        if (selectedDateObj <= new Date(previousAnnual.vaccinatedAt)) {
          alert(`이번 종합백신은 이전 접종일보다 뒤여야 합니다.`);
          return;
        }
        const diffDays = Math.floor((new Date() - new Date(previousAnnual.vaccinatedAt)) / (1000 * 60 * 60 * 24));
        if (diffDays < 365) {
          const confirm = window.confirm(`이 반려동물은 종합백신을 최근에 접종했습니다. 계속 등록할까요?`);
          if (!confirm) return;
        }
      }
    }

    if (step !== 7) {
      const alreadyExists = vaccineRecords.some((record) => record.step === step);
      if (alreadyExists) {
        alert(`이미 ${step}차 접종이 저장되어 있습니다.`);
        return;
      }
    }

    setLoading(true);
    const formData = new URLSearchParams();
    formData.append('petId', selectedPetId);
    formData.append('step', step);
    formData.append('selectedDate', date);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/vaccine/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('백엔드 오류');

      const data = await res.json();
      localStorage.setItem('vaccineResult', JSON.stringify(data));
      localStorage.setItem('vaccinePetId', selectedPetId);
      router.push('/health/vaccine/result');
    } catch (err) {
      console.error('백신 저장 실패:', err);
      alert('예방접종 정보 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const vaccineSteps = [
    { step: 1, label: '1차접종 (종합백신 + 코로나 장염)' },
    { step: 2, label: '2차접종 (종합백신 + 코로나 장염)' },
    { step: 3, label: '3차접종 (종합백신 + 켄넬코프)' },
    { step: 4, label: '4차접종 (종합백신 + 켄넬코프)' },
    { step: 5, label: '5차접종 (종합백신 + 인플루엔자)' },
    { step: 6, label: '6차접종 (광견병 + 인플루엔자)' },
    { step: 7, label: '종합백신' },
  ];

  const guideData = [
    ['1차접종 (종합백신+코로나 장염)', '생후 6~8주'],
    ['2차접종 (종합백신+코로나 장염)', '생후 8~10주'],
    ['3차접종 (종합백신+켄넬코프)', '생후 10~12주'],
    ['4차접종 (종합백신+켄넬코프)', '생후 12~14주'],
    ['5차접종 (종합백신+인플루엔자)', '생후 14~16주'],
    ['6차접종 (광견병+인플루엔자)', '생후 16~18주'],
    ['1년차 이후 종합백신', '1년 주기'],
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">예방접종 기록 입력</h1>

      {/* 날짜 선택 */}
      <div className="flex justify-center mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-44 border border-gray-300 rounded px-3 py-2 text-xs"
        />
      </div>

      {/* 반려동물 선택 */}
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {pets.map((pet) => {
            const species = pet.petType?.toLowerCase() || '';
            const isCat = species.includes('cat') || species.includes('고양이') || species.includes('냥');
            const defaultImage = isCat ? '/images/profile/default_cat.jpeg' : '/images/profile/default_dog.jpeg';
            const isDefaultImage = !pet.imageUrl;

            return (
              <div
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className={`w-60 h-60 border border-gray-300 rounded-lg flex flex-col items-center justify-center shadow-sm cursor-pointer
                  ${selectedPetId === pet.id ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-100'}`}
              >
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-white flex items-center justify-center mb-5">
                    <img
                      src={
                        pet.thumbnailUrl || pet.imageUrl
                          ? (pet.thumbnailUrl || pet.imageUrl).startsWith("/images/profile/")
                              ? pet.thumbnailUrl || pet.imageUrl
                              : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${pet.thumbnailUrl || pet.imageUrl}`
                          : defaultImage
                      }
                      alt={pet.petName}
                      className={`w-full h-full ${
                        isDefaultImage
                          ? isCat
                            ? 'object-contain p-[10px] filter grayscale brightness-110 opacity-60'
                            : 'object-contain p-1 filter grayscale brightness-110 opacity-60'
                          : 'object-cover'
                      }`}
                    />
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                  {pet.petType === 'cat' ? '고양이' : pet.petType === 'dog' ? '강아지' : '기타'} / {pet.petAge}년생
                </div>
                <div className="text-m font-medium">{pet.petName}</div>
          </div>
            )
        })}
      </div>

      {/* 백신 단계 선택 + 안내 버튼 */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <label className="block text-xs font-medium text-gray-700 text-center">
            백신 단계 선택
          </label>

          {/* 안내 버튼 */}
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            안내
          </button>

          {/* 이전기록보기 버튼 */}
          <button
            type="button"
            onClick={() => router.push('/myPage/vaccine')}
            className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            이전기록보기
          </button>
        </div>

        <div className="flex justify-center">
          <select
            value={step}
            onChange={(e) => setStep(parseInt(e.target.value))}
            className="w-60 border border-gray-300 rounded text-xs px-3 py-2 pr-10 appearance-none 
                       bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22gray%22%20viewBox=%220%200%2020%2020%22%3E%3Cpath%20fillRule=%22evenodd%22%20d=%22M5.23%207.21a.75.75%200%20011.06.02L10%2010.94l3.71-3.71a.75.75%200%20011.08%201.04l-4.25%204.25a.75.75%200%2001-1.08%200L5.21%208.27a.75.75%200%2001.02-1.06z%22%20clipRule=%22evenodd%22/%3E%3C/svg%3E')] 
                       bg-no-repeat bg-[right_1rem_center] bg-[length:1rem_1rem]"
          >
            {vaccineSteps.map((v) => (
              <option key={v.step} value={v.step}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {loading ? '저장 중...' : '저장하기'}
        </button>
      </div>
      <div className="mx-auto mt-6 w-[200px] h-[150px] bg-transparent" />

      {/* 모달 */}
      {showGuide && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 border border-gray-300">
            <h3 className="text-sm font-semibold mb-4">백신 접종 가이드</h3>
            <table className="w-full text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border border-gray-300 py-2 px-2 text-left">백신 단계</th>
                  <th className="border border-gray-300 py-2 px-2 text-left">접종 주기</th>
                </tr>
              </thead>
              <tbody>
                {guideData.map(([label, cycle], idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-200 px-2 py-2">{label}</td>
                    <td className="border border-gray-200 px-2 py-2">{cycle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4">
              <button
                onClick={() => setShowGuide(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
