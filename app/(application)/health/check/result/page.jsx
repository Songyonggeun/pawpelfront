'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HealthResult() {
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const petId = localStorage.getItem('selectedPetId');
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/health/pet/${petId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const latest = data.sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))[0];
        setResult(latest);
      });
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  if (!result) {
    return <p className="text-center py-10 text-gray-500">결과 불러오는 중...</p>;
  }

  // "없어요"가 아닌 항목만 필터링
  const filteredWarnings = result.warnings?.filter(item => item !== '없어요') || [];

  return (
    <div className="mt-10 max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold text-blue-600 mb-6 text-center">건강검진 결과</h2>

      <div className="space-y-3 text-sm text-gray-800">
        <div className="flex justify-between">
          <span className="font-semibold">검진일자:</span>
          <span>{formatDate(result.checkedAt)}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">점수:</span>
          <span>{result.totalScore}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">검진결과:</span>
          <span>{result.resultStatus}</span>
        </div>

        <div>
          <p className="font-semibold mb-1">주의 항목:</p>
          {filteredWarnings.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {filteredWarnings.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">없음</p>
          )}
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => router.push('/myPage/health')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          전체 기록 보기
        </button>
      </div>
    </div>
  );
}
