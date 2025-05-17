import { useState } from "react";

const GenderInput = ({ gender, setGender }) => {
  const handleSpanClick = (value) => {
    // 선택된 값이 현재 값과 같으면 선택 해제, 아니면 새로운 값으로 설정
    setGender(gender === value ? "" : value);
  };

  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">성별</label>
      <div className="flex items-center justify-start gap-20">
        {/* 남성 선택 */}
        <div className="flex items-center gap-2">
          <span
            onClick={() => handleSpanClick("male")}
            className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all 
              ${gender === "male" ? "bg-blue-500" : "bg-white"} 
              ${gender === "male" ? "border-blue-500" : "border-gray-300"}`}
            style={{ outline: "none" }} // 포커스 스타일 제거
          >
            {gender === "male" && (
              <span className="w-3 h-3 rounded-full bg-white"></span>
            )}
          </span>
          <label className="cursor-pointer">남성</label>
        </div>

        {/* 여성 선택 */}
        <div className="flex items-center gap-1">
          <span
            onClick={() => handleSpanClick("female")}
            className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all 
              ${gender === "female" ? "bg-pink-500" : "bg-white"} 
              ${gender === "female" ? "border-pink-500" : "border-gray-300"}`}
            style={{ outline: "none" }}
          >
            {gender === "female" && (
              <span className="w-3 h-3 rounded-full bg-white"></span>
            )}
          </span>
          <label className="cursor-pointer">여성</label>
        </div>
      </div>
    </div>
  );
};

export default GenderInput;
