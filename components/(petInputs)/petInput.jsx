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
  const [imagePreview, setImagePreview] = useState(null);
  const [birthYearError, setBirthYearError] = useState('');
  const [isImageDeleted, setIsImageDeleted] = useState(false);


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
      if (pet.thumbnailUrl || pet.imageUrl) {
        setImagePreview(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${pet.thumbnailUrl || pet.imageUrl}`);
      }
      setIsModalOpen(true);
    }
  }, [isEdit, pet]);

  const handlePetTypeChange = (type) => setSelectedPetType(type);
  const handleGenderChange = (gender) => setSelectedGender(gender);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'petAge') {
      setBirthYearError('');
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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

    const formDataObj = new FormData();
    formDataObj.append('data', new Blob([JSON.stringify(petPayload)], { type: 'application/json' }));
    if (imageFile) {
      formDataObj.append('image', imageFile);
    }
    if (isEdit && isImageDeleted) {
      await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/pet/delete-image/${pet.id}`, {
        method: 'PUT',
        credentials: 'include',
      });
    }

    if (!/^\d{4}$/.test(formData.petAge)) {
      setBirthYearError('정확한 출생년도를 입력하세요 (예: 2020)');
      return;
    }

    const url = isEdit
    ? `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/pet/update/${pet.id}`
    : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/pet/register`;

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
    onClose(); 
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
                    <input type="radio" id="male" name="petGender" value="male"
                      checked={selectedGender === 'male'}
                      onChange={() => handleGenderChange('male')} className="hidden" />
                    <MaleIcon color={selectedGender === 'male' ? '#2563eb' : '#000'} />
                  </label>
                  <label htmlFor="female" className="w-1/2 flex justify-center">
                    <input type="radio" id="female" name="petGender" value="female"
                      checked={selectedGender === 'female'}
                      onChange={() => handleGenderChange('female')} className="hidden" />
                    <FemaleIcon color={selectedGender === 'female' ? 'pink' : '#000'} />
                  </label>
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">이미지</label>
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24">
                      <label
                        htmlFor="petImage"
                        className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 overflow-hidden"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="미리보기"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-2xl text-gray-500">+</span>
                        )}
                        <input
                          type="file"
                          id="petImage"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>

                      {imagePreview && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview(null);
                            if (isEdit) setIsImageDeleted(true); // 서버에서 기존 이미지 삭제하도록 플래그
                          }}
                          className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                          title="이미지 삭제"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
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
                <label className="block mb-1 text-gray-700 font-medium">품종</label>
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
                <label className="block mb-1 text-gray-700 font-medium">출생년도</label>
                <input
                  type="text"
                  name="petAge"
                  value={formData.petAge}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md ${birthYearError ? 'border-red-500' : ''}`}
                  placeholder="예: 2020"
                />
                {birthYearError && (
                  <p className="text-red-500 text-sm mt-1">{birthYearError}</p>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex justify-between items-center">
                {isEdit && (
                  <button
                    type="button"
                    onClick={async () => {
                      const confirmDelete = confirm("정말로 이 반려동물을 삭제하시겠습니까?");
                      if (!confirmDelete) return;

                      try {
                        const response = await fetch(
                          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/pet/delete/${pet.id}`,
                          {
                            method: 'DELETE',
                            credentials: 'include',
                          }
                        );
                        if (response.ok) {
                          alert("반려동물이 삭제되었습니다.");
                          closeModal();
                          window.location.reload(); // 혹은 router.refresh()
                        } else {
                          const data = await response.json();
                          alert(`삭제 실패: ${data.message || '서버 오류'}`);
                        }
                      } catch (error) {
                        console.error("삭제 오류:", error);
                        alert("서버 오류가 발생했습니다.");
                      }
                    }}
                    className="px-3 py-2 text-sm text-red-500 hover:underline"
                  >
                    {/* 삭제 */}
                  </button>
                )}
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {isEdit ? '수정' : '등록'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-500"
                  >
                    취소
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PetInputButton;
