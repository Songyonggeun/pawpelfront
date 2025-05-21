'use client';

import React, { useState } from "react";
import FemaleIcon from "../(icon)/female";
import MaleIcon from "../(icon)/male";
import DogFace from "../(icon)/dogs";
import CatFace from "../(icon)/cats"; 

const PetInputButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPetType, setSelectedPetType] = useState('dog'); // 선택된 동물
    const [selectedGender, setSelectedGender] = useState('MALE'); // 선택된 성별

    const handlePetTypeChange = (type) => {
        setSelectedPetType(type);
    };

    const handleGenderChange = (gender) => {
        setSelectedGender(gender);
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-blue-500 text-sm hover:underline"
            >
                + 반려동물 등록
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">반려동물 등록</h2>

                        <form
                            method="POST"
                            action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/pet/register`}
                            className="space-y-4"
                        >
                            <label className="block mb-1 text-gray-700 font-medium">동물 종류</label>
                            <div className="flex justify-between space-x-4">
                                <div
                                    className={`flex items-center justify-center w-1/2 p-2 border-2 rounded ${selectedPetType === 'dog' ? 'border-gray-400' : 'border-transparent'}`}
                                    onClick={() => handlePetTypeChange('dog')}
                                >
                                    <input
                                        type="radio"
                                        id="dog"
                                        name="petType"
                                        value="dog"
                                        checked={selectedPetType === 'dog'}
                                        className="mr-2 hidden"
                                    />
                                    <label htmlFor="dog">
                                        <DogFace color={selectedPetType === 'dog' ? '#2563eb' : '#000'} />
                                    </label>
                                </div>
                                <div
                                    className={`flex items-center justify-center w-1/2 p-2 border-2 rounded ${selectedPetType === 'cat' ? 'border-gray-400' : 'border-transparent'}`}
                                    onClick={() => handlePetTypeChange('cat')}
                                >
                                    <input
                                        type="radio"
                                        id="cat"
                                        name="petType"
                                        value="cat"
                                        checked={selectedPetType === 'cat'}
                                        className="mr-2 hidden"
                                    />
                                    <label htmlFor="cat">
                                        <CatFace color={selectedPetType === 'cat' ? '#fink' : '#000'} />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">성별</label>
                                <div className="flex justify-between space-x-4">
                                    <div className="flex items-center justify-center w-1/2">
                                        <input
                                            type="radio"
                                            id="male"
                                            name="petGender"
                                            value="MALE"
                                            checked={selectedGender === 'MALE'}
                                            onChange={() => handleGenderChange('MALE')}
                                            className="mr-2 hidden"
                                        />
                                        <label htmlFor="male">
                                            <MaleIcon color={selectedGender === 'MALE' ? '#2563eb' : '#000'} />
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-center w-1/2">
                                        <input
                                            type="radio"
                                            id="female"
                                            name="petGender"
                                            value="FEMALE"
                                            checked={selectedGender === 'FEMALE'}
                                            onChange={() => handleGenderChange('FEMALE')}
                                            className="mr-2 hidden"
                                        />
                                        <label htmlFor="female">
                                            <FemaleIcon color={selectedGender === 'FEMALE' ? 'pink' : '#000'} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">몸무게 (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    step="0.01"
                                    placeholder="몸무게 (kg)"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">이름</label>
                                <input
                                    type="text"
                                    name="petName"
                                    placeholder="이름"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">나이</label>
                                <input
                                    type="number"
                                    name="petAge"
                                    placeholder="나이"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-500"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    등록
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
