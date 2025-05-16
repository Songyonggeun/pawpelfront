"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Step1 = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const agreementStatus = localStorage.getItem("isAgreed");
    if (agreementStatus === "true") {
      setIsAgreed(true);
    }
  }, []);

  const handleAgreeChange = () => {
    setIsAgreed((prev) => !prev);
  };

  const handleNext = () => {
    if (isAgreed) {
      localStorage.setItem("isAgreed", "true");
      router.push("/signup/Step2");
    } else {
      alert("약관에 동의해야 합니다.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">약관 동의</h1>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={handleAgreeChange}
            className="mr-2"
            id="agreeCheckbox"
          />
          <label htmlFor="agreeCheckbox" className="text-gray-700 cursor-pointer">
            약관에 동의합니다.
          </label>
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Step1;
