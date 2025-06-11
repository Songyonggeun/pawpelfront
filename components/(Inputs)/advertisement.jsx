import React from "react";

const PetHealthBanner = () => {
  return (
    <div className="w-full border-gray-200 bg-white">
      <div className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="w-full rounded-xl overflow-hidden bg-gradient-to-r from-blue-200 to-green-200 shadow-md flex items-center justify-between px-8 py-5">
          <div>
            <div className="font-bold text-[1.1rem] text-gray-800">
              반려동물 건강 체크, 지금 바로 시작하세요!
            </div>
            <div className="text-[0.95rem] mt-1 text-gray-700">
              정기적인 건강 체크로 우리 아이를 아프기 전에 지켜주세요 🐶🐱
            </div>
          </div>
          {/* 이미지 생략 */}
        </div>
      </div>
    </div>
  );
};

export default PetHealthBanner;
