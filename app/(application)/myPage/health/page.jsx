'use client';

import React, { useEffect, useState } from 'react';

export default function PetHealthSection() {
  const [pets, setPets] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setPets(data.pets || []);
      } catch (err) {
        console.error('Error fetching pets:', err);
      }
    };
    fetchPets();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">건강검진 내역</h2>
      <div className="flex gap-4 flex-wrap">
        {pets.map((pet) => (
          <div key={pet.id} className="w-40 p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
            <div className="text-center font-semibold mb-2">{pet.petName}</div>
            {pet.healthRecords && pet.healthRecords.length > 0 ? (
              pet.healthRecords.map((record, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRecord(record)}
                  className="text-sm text-gray-700 hover:underline cursor-pointer"
                >
                  {formatDate(record.checkedAt)}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 text-center">검진 내역 없음</div>
            )}
          </div>
        ))}
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">건강검진 결과</h3>
            <p><strong>총점:</strong> {selectedRecord.totalScore}</p>
            <p><strong>결과:</strong> {selectedRecord.resultStatus}</p>
            <p><strong>검진일:</strong> {formatDate(selectedRecord.checkedAt)}</p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
