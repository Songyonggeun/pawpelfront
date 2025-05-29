"use client";

import React, { useState, useEffect } from "react";
import FemaleIcon from "../(icon)/female";
import MaleIcon from "../(icon)/male";
import DogFace from "../(icon)/dogs";
import CatFace from "../(icon)/cats";

const PetInputButton = ({ isEdit = false, pet = null, onClose = () => {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPetType, setSelectedPetType] = useState('dog');
  const [selectedGender, setSelectedGender] = useState('MALE');
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    petName: '',
    petBreed: '',
    petAge: '',
    weight: '',
  });

  useEffect(() => {
    if (isEdit && pet) {
      setSelectedPetType(pet.petType);
      setSelectedGender(pet.petGender);
      setFormData({
        petName: pet.petName || '',
        petBreed: pet.petBreed || '',
        petAge: pet.petAge || '',
        weight: pet.weight || '',
      });
      setIsModalOpen(true);
    }
  }, [isEdit, pet]);

  const handlePetTypeChange = (type) => setSelectedPetType(type);
  const handleGenderChange = (gender) => setSelectedGender(gender);
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const petPayload = {
      petType: selectedPetType,
      petGender: selectedGender,
      petName: formData.petName,
      petBreed: formData.petBreed,
      petAge: parseInt(formData.petAge, 10),
      weight: parseFloat(formData.weight),
    };

    const formDataObj = new FormData(); // ✅ 먼저 선언
    formDataObj.append('data', new Blob([JSON.stringify(petPayload)], { type: 'application/json' }));
    if (imageFile) {
      formDataObj.append('image', imageFile);
    }

    const url = isEdit
    ? `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/pet/update-with-image/${pet.id}`
    : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/pet/register-with-image`;


    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formDataObj,
      });

      if (response.ok) {
        alert(isEdit ? "수정 완료!" : "등록 완료!");
        closeModal();

        const verify = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include'
        });

        if (verify.ok) {
          // 인증 유지되면 페이지 다시 그림
          window.location.reload(); // 또는 router.refresh()
        } else {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.");
          router.replace("/login");
        }
      }
    } catch (error) {
      console.error("요청 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onClose(); // 외부 상태 초기화
  };

  return (
    <>
      {!isEdit && (
        <button onClick={() => setIsModalOpen(true)} className="text-blue-500 text-sm hover:underline">
          + 반려동물 등록
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{isEdit ? "반려동물 수정" : "반려동물 등록"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 종류 선택 */}
              <label className="block mb-1 text-gray-700 font-medium">동물 종류</label>
              <div className="flex justify-between space-x-4">
                <div
                  className={`flex items-center justify-center w-1/2 p-2 border-2 rounded ${selectedPetType === 'dog' ? 'border-gray-400' : 'border-transparent'}`}
                  onClick={() => handlePetTypeChange('dog')}
                >
                  <label htmlFor="dog">
                    <DogFace color={selectedPetType === 'dog' ? '#2563eb' : '#000'} />
                  </label>
                </div>
                <div
                  className={`flex items-center justify-center w-1/2 p-2 border-2 rounded ${selectedPetType === 'cat' ? 'border-gray-400' : 'border-transparent'}`}
                  onClick={() => handlePetTypeChange('cat')}
                >
                  <label htmlFor="cat">
                    <CatFace color={selectedPetType === 'cat' ? '#2563eb' : '#000'} />
                  </label>
                </div>
              </div>

              {/* 성별 선택 */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">성별</label>
                <div className="flex justify-between space-x-4">
                  <label htmlFor="male" className="w-1/2 flex justify-center">
                    <input type="radio" id="male" name="petGender" value="MALE"
                      checked={selectedGender === 'MALE'}
                      onChange={() => handleGenderChange('MALE')} className="hidden" />
                    <MaleIcon color={selectedGender === 'MALE' ? '#2563eb' : '#000'} />
                  </label>
                  <label htmlFor="female" className="w-1/2 flex justify-center">
                    <input type="radio" id="female" name="petGender" value="FEMALE"
                      checked={selectedGender === 'FEMALE'}
                      onChange={() => handleGenderChange('FEMALE')} className="hidden" />
                    <FemaleIcon color={selectedGender === 'FEMALE' ? 'pink' : '#000'} />
                  </label>
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">이미지</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>

              {/* 이름, 품종, 나이, 몸무게 */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">이름</label>
                <input
                  type="text"
                  name="petName"
                  value={formData.petName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium">견종</label>
                <input
                  type="text"
                  name="petBreed"
                  value={formData.petBreed}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium">몸무게 (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium">나이</label>
                <input
                  type="number"
                  name="petAge"
                  value={formData.petAge}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-500">
                  취소
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  {isEdit ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PetInputButton;
