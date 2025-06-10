'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelectPetPage() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const router = useRouter();

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
        router.replace('/login');
      }
    };
    fetchPets();
  }, []);

  const handleSubmit = () => {
    if (!selectedPetId) {
      alert('반려동물을 선택해주세요.');
      return;
    }
    localStorage.setItem('selectedPetId', selectedPetId);
    localStorage.setItem('checkDate', date);
    router.push('/health/check/check');
  };

  return (
    <div className="max-w-7x3 mx-auto p-6">
      <h1 className="text-xl font-semibold mb-6 text-center">건강체크 대상 선택</h1>

      {/* <div className="flex justify-center mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
      </div> */}

      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {pets.map((pet) => (
          <div
            key={pet.id}
            onClick={() => setSelectedPetId(pet.id)}
            className={`w-60 h-60 border border-gray-300 rounded-lg flex flex-col items-center justify-center shadow-sm cursor-pointer
              ${selectedPetId === pet.id ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-100'}`}
          >
            <div className="w-28 h-28 bg-gray-200 rounded-full mb-2" />
            <div className="text-m font-medium">{pet.petName}</div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          다음 단계로 →
        </button>
        <div className="mx-auto mt-6 w-[200px] h-[500px] bg-transparent" />

      </div>
    </div>
  );
}
