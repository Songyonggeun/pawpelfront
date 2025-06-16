'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VaccineResult() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const petId = localStorage.getItem('vaccinePetId');
    if (!petId) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/vaccine/history?petId=${petId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data]
          .sort((a, b) => {
            if (a.step !== b.step) return a.step - b.step;
            if (a.step === 7) {
              return new Date(a.vaccinatedAt) - new Date(b.vaccinatedAt);
            }
            return 0;
          });

        setHistory(sorted);
      })
      .catch((err) => {
        console.error('이력 불러오기 실패:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (str) => {
    const date = new Date(str);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6 text-center">예방접종 이력</h1>

      {loading ? (
        <p className="text-center text-gray-500">불러오는 중입니다...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-500">등록된 예방접종 이력이 없습니다.</p>
      ) : (
        <table className="w-full text-sm border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 py-2 px-3 text-left">백신 단계</th>
              <th className="border border-gray-300 py-2 px-3 text-left">접종일</th>
              <th className="border border-gray-300 py-2 px-3 text-left">다음 예정일</th>
              <th className="border border-gray-300 py-2 px-3 text-left">D-Day</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx} className="text-gray-800">
                <td className="border border-gray-200 px-3 py-2">{item.vaccineName}</td>
                <td className="border border-gray-200 px-3 py-2">{formatDate(item.vaccinatedAt)}</td>
                <td className="border border-gray-200 px-3 py-2">{formatDate(item.nextVaccinationDate)}</td>
                <td className="border border-gray-200 px-3 py-2">{item.dday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => router.push('/health/vaccine/select')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          추가 등록하기
        </button>
        <button
          onClick={() => router.push('/myPage/vaccine')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          전체 기록 보기
        </button>
      </div>
    </div>
  );
}
