'use client';

import { useEffect, useState } from 'react';

export default function HealthResult() {
  const [result, setResult] = useState(null);

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

  if (!result) return <p className="text-center">결과 불러오는 중...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">결과 확인</h1>
      <p><strong>점수:</strong> {result.totalScore}</p>
      <p><strong>상태:</strong> {result.resultStatus}</p>
      <p><strong>검진 일자:</strong> {new Date(result.checkedAt).toLocaleString()}</p>
    </div>
  );
}
