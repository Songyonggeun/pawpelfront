'use client';

import React, { useState } from "react";
import FemaleIcon from "../(gender)/female";
import MaleIcon from "../(gender)/male";

const PetInputButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMale, setIsMale] = useState(true);

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
                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">성별</label>
                                <div className="flex justify-between space-x-4">
                                    <div className="flex items-center justify-center w-1/2">
                                        <input
                                            type="radio"
                                            id="male"
                                            name="petGender"
                                            value="MALE"
                                            className="mr-2 hidden"
                                            defaultChecked
                                            onChange={e=>setIsMale(true)}
                                        />
                                        <label htmlFor="male">
                                            <MaleIcon color={isMale ? '#2563eb' : '#000'}/>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-center w-1/2">
                                        <input
                                            type="radio"
                                            id="female"
                                            name="petGender"
                                            value="FEMALE"
                                            className="mr-2 hidden"
                                            onChange={e=>setIsMale(false)}
                                        />
                                        <label htmlFor="female">
                                            <FemaleIcon  color={isMale ? '#000' : '#FF1493'}/>
                                        </label>
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">동물 종류</label>
                                <input
                                    type="text"
                                    name="petType"
                                    placeholder="동물 종류"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
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
