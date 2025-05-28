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
      const updated = { ...answers, [category.category]: ['없어요'] };
      setAnswers(updated);
      localStorage.setItem('healthAnswers', JSON.stringify(updated));
    } else {
      selected.delete('없어요');
      selected.has(option) ? selected.delete(option) : selected.add(option);
      const updated = {
        ...answers,
        [category.category]: Array.from(selected),
      };
      setAnswers(updated);
      localStorage.setItem('healthAnswers', JSON.stringify(updated));
    }
  };

  const handleNext = () => {
    if (!answers[category.category] || answers[category.category].length === 0) {
      const updated = { ...answers, [category.category]: ['없어요'] };
      setAnswers(updated);
      localStorage.setItem('healthAnswers', JSON.stringify(updated));
    }

    if (step < healthCheckList.length - 1) {
      setStep(step + 1);
    } else {
      const payload = {
        petId,
        selectedOptions: answers,
      };

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/health/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();  // JSON이 아닐 수 있으므로 text()로 먼저 확인
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
      .catch(err => {
        alert('제출 중 오류가 발생했습니다.');
        console.error(err);
      });
    }
  };

  if (!category) return null;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Step {step + 1} / {healthCheckList.length} : {category.category}
      </h2>
      <div className="space-y-3 mb-6">
        {category.options.map((option, idx) => (
          <label key={idx} className="block cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={answers[category.category]?.includes(option) || false}
              onChange={() => toggleAnswer(option)}
            />
            {option}
          </label>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        {step < healthCheckList.length - 1 ? '다음' : '제출'}
      </button>
    </div>
  );
}
