'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PetSelectCard({ onSelect, selectedPetId }) {
  const [pets, setPets] = useState([]);
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

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {pets.map((pet) => (
        <div
          key={pet.id}
          onClick={() => onSelect(pet.id)}
          className={`w-32 h-48 border rounded-lg flex flex-col items-center justify-center shadow-sm cursor-pointer
            ${selectedPetId === pet.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
          <div className="text-sm font-medium">{pet.petName}</div>
        </div>
      ))}
    </div>
  );
}
