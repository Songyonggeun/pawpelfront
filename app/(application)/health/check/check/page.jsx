'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { healthCheckList } from '../healthCheckList';

export default function HealthCheck() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [petId, setPetId] = useState(null);

  const category = healthCheckList[step];

  useEffect(() => {
    const storedPetId = localStorage.getItem('selectedPetId');
    const savedAnswers = localStorage.getItem('healthAnswers');

    if (!storedPetId) {
      alert('검진할 반려동물을 먼저 선택해주세요.');
      router.push('/health/check/select');
    } else {
      setPetId(parseInt(storedPetId));
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    }
  }, []);

const toggleAnswer = (option) => {
  const selected = new Set(answers[category.category] || []);

  if (option === '없어요') {
    if (selected.has('없어요')) {
      // 이미 선택된 경우 해제
      selected.delete('없어요');
    } else {
      // 없어요만 선택
      selected.clear();
      selected.add('없어요');
    }
  } else {
    // 일반 항목 선택 시 '없어요' 제거
    selected.delete('없어요');
    if (selected.has(option)) {
      selected.delete(option);
    } else {
      selected.add(option);
    }
  }

  const updated = {
    ...answers,
    [category.category]: Array.from(selected),
  };

  setAnswers(updated);
  localStorage.setItem('healthAnswers', JSON.stringify(updated));
};


  const handleNext = () => {
    if (step < healthCheckList.length - 1) {
      const updated = { ...answers };
      if (!updated[category.category] || updated[category.category].length === 0) {
        updated[category.category] = ['없어요'];
        setAnswers(updated);
        localStorage.setItem('healthAnswers', JSON.stringify(updated));
      }
      setStep(step + 1);
    } else {
      const finalAnswers = { ...answers };
      if (!finalAnswers[category.category] || finalAnswers[category.category].length === 0) {
        finalAnswers[category.category] = ['없어요'];
      }

      const payload = {
        petId,
        selectedOptions: finalAnswers,
      };

      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/health/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ 응답 오류:', errorText);
            if (res.status === 401) {
              alert('로그인이 필요합니다. 다시 로그인해주세요.');
              window.location.href = '/login';
            } else {
              throw new Error('제출 실패');
            }
          }
          return res.json();
        })
        .then(() => {
          localStorage.removeItem('healthAnswers');
          router.push('/health/check/result');
        })
        .catch((err) => {
          alert('제출 중 오류가 발생했습니다.');
          console.error(err);
        });
    }
  };

  if (!category) return null;

  const selected = answers[category.category] || [];
  const isNoneSelected = selected.includes('없어요');

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {category.category}
      </h2>
      <p className="text-center mb-6 text-gray-600">
        자주 나타나는 행동이나 습관을 <span className="text-blue-500 font-bold">모두</span> 선택해주세요.
      </p>

      <div className="space-y-3 mb-8">
        {category.options.map((option, idx) => {
          const isSelected = selected.includes(option);
          const isDisabled = isNoneSelected && option !== '없어요';

          return (
            <button
              key={idx}
              onClick={() => toggleAnswer(option)}
              className={`w-full py-3 px-4 rounded-lg border text-center transition 
                ${
                  isSelected
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={isDisabled}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded disabled:opacity-50"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {step < healthCheckList.length - 1 ? '다음' : '제출'}
        </button>
      </div>
    </div>
  );
}
