'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const healthItems = [
'피부에 발진이나 염증이 있다',
'기침이나 재채기를 자주 한다',
'눈에 분비물이 있다',
'배변 습관이 평소와 다르다',
'식욕이 없다',
'특별히 없어요'
];

export default function HealthCheckPage() {
const router = useRouter();
const [pets, setPets] = useState([]);
const [selectedPetId, setSelectedPetId] = useState(null);
const [selectedItems, setSelectedItems] = useState([]);
const [result, setResult] = useState(null);
const [showModal, setShowModal] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(true);

useEffect(() => {
    // 로그인 확인
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
    credentials: 'include',
    })
    .then(res => {
        if (res.status === 200) return res.json();
        throw new Error('Not logged in');
    })
    .then(data => {
        setIsLoggedIn(true);
        fetchPets();
    })
    .catch(() => {
        setIsLoggedIn(false);
    });
}, []);

const fetchPets = () => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/petinfo`, {
    credentials: 'include',
    })
    .then(res => res.json())
    .then(data => setPets(data));
};

const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
    setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
    if (item === '특별히 없어요') {
        setSelectedItems(['특별히 없어요']);
    } else {
        setSelectedItems([...selectedItems.filter(i => i !== '특별히 없어요'), item]);
    }
    }
};

const handleSubmit = () => {
    const body = {
    petId: selectedPetId,
    selectedOptions: {
        general: selectedItems,
    },
    };

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/health/submit`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
    })
    .then(res => res.json())
    .then(data => {
        setResult(data);
        setShowModal(true);
    });
};

const viewHistory = () => {
    router.push(`/records?petId=${selectedPetId}`);
};

if (!isLoggedIn) {
    return <div className="text-center mt-10 text-gray-700">로그인이 필요합니다.</div>;
}

return (
    <div className="p-4 max-w-xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">반려동물 건강 체크</h1>

    <div className="mb-4">
        <label className="block font-semibold mb-2">반려동물을 선택하세요:</label>
        <select
        className="border p-2 rounded w-full"
        value={selectedPetId || ''}
        onChange={(e) => setSelectedPetId(Number(e.target.value))}
        >
        <option value="" disabled>선택하세요</option>
        {pets.map(pet => (
            <option key={pet.id} value={pet.id}>{pet.name}</option>
        ))}
        </select>
    </div>

    <div className="mb-4">
        <label className="block font-semibold mb-2">건강 이상 징후를 모두 선택해주세요:</label>
        <ul className="space-y-2">
        {healthItems.map(item => (
            <li key={item}>
            <label className="flex items-center">
                <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => toggleItem(item)}
                />
                {item}
            </label>
            </li>
        ))}
        </ul>
    </div>

    <div className="flex gap-2">
        <button
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!selectedPetId || selectedItems.length === 0}
        >
        결과 확인하기
        </button>
        <button
        onClick={viewHistory}
        className="text-sm text-indigo-700 underline"
        disabled={!selectedPetId}
        >
        건강 기록 보기
        </button>
    </div>

      {/* 결과 모달 */}
    {showModal && result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-2">검진 결과</h2>
            <p><strong>점수:</strong> {result.score}</p>
            <p><strong>상태:</strong> {result.status}</p>
            <p className="mt-2 font-semibold">주의가 필요한 항목:</p>
            <ul className="list-disc ml-5 text-sm">
            {result.warnings.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
            </ul>
            <button
            onClick={() => setShowModal(false)}
            className="mt-4 bg-indigo-600 text-white px-4 py-1 rounded"
            >
            닫기
            </button>
        </div>
        </div>
    )}
    </div>
);
}
