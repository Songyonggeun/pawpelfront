'use client';

import { useState, useEffect } from 'react';

const healthItems = [
  '피부에 발진이나 염증이 있다',
  '기침이나 재채기를 자주 한다',
  '눈에 분비물이 있다',
  '배변 습관이 평소와 다르다',
  '식욕이 없다',
  '특별히 없어요'
];

export default function HealthCheckPage() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // 백엔드에서 반려동물 리스트 가져오기
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/petinfo`)
      .then(res => res.json())
      .then(data => setPets(data));
  }, []);

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
    const hasNone = selectedItems.includes('특별히 없어요');
    const score = hasNone ? 100 : Math.max(0, 100 - selectedItems.length * 2);
    const level = score >= 80 ? '양호' : score >= 50 ? '경고' : '위험';
    const areas = selectedItems.filter(item => item !== '특별히 없어요');

    setResult({
      score,
      level,
      areas,
      petName: pets.find(p => p.id === parseInt(selectedPetId))?.name || ''
    });
  };

  const closeModal = () => setResult(null);

  return (
    <div className="p-4 max-w-xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">반려동물 건강 체크</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-2">반려동물을 선택하세요:</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedPetId}
          onChange={(e) => setSelectedPetId(e.target.value)}
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

      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!selectedPetId || selectedItems.length === 0}
      >
        결과 확인하기
      </button>

      {/* 결과 모달 */}
      {result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-xl relative">
            <h2 className="text-xl font-bold mb-2">{result.petName}의 건강 상태</h2>
            <p className="text-lg font-semibold text-gray-700 mb-1">점수: {result.score}점</p>
            <p className={`text-md font-bold mb-2 ${
              result.level === '양호' ? 'text-green-600' :
              result.level === '경고' ? 'text-yellow-500' :
              'text-red-600'
            }`}>상태: {result.level}</p>

            {result.areas.length > 0 && (
              <>
                <p className="font-semibold text-gray-800 mb-1">주의할 부위:</p>
                <ul className="text-sm text-gray-600 mb-4 list-disc list-inside">
                  {result.areas.map((area, idx) => <li key={idx}>{area}</li>)}
                </ul>
              </>
            )}

            <button
              className="bg-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-400"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
