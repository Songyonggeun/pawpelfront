import React from "react";

const PetInsuranceBanner = () => {
  return (
    <div className="w-full border-t border-gray-200 bg-white">
      <div className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="w-full rounded-xl overflow-hidden bg-gradient-to-r from-teal-400 to-indigo-500 shadow-md flex items-center justify-between px-8 py-5">
          <div>
            <div className="font-bold text-[1.1rem] text-white">
              반려동물 보험, 지금 가입하면 첫 달 50% 할인!
            </div>
            <div className="text-[0.95rem] mt-1 text-[#e0e7ef]">
              우리 아이 건강을 위한 필수 보험, 라이펫에서 준비하세요 🐾
            </div>
          </div>
          <img
            src="https://cdn.pixabay.com/photo/2016/02/19/10/00/pet-1209744_1280.jpg"
            alt="펫보험"
            className="w-[70px] h-[70px] rounded-full object-cover ml-4 border-2 border-white"
          />
        </div>
      </div>
    </div>
  );
};

export default PetInsuranceBanner;
