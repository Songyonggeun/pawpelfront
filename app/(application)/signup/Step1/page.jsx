"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Step1 = () => {
  const [isTermsAgreed, setIsTermsAgreed] = useState(false); // 이용약관 동의 여부
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false); // 개인정보 처리방침 동의 여부
  const [isAgreed, setIsAgreed] = useState(false); // 두 동의가 모두 되어있는지 여부
  const [showTermsModal, setShowTermsModal] = useState(false); // 이용약관 모달 상태
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); // 개인정보처리방침 모달 상태
  const router = useRouter();

  useEffect(() => {
    const agreementStatus = localStorage.getItem("isAgreed");
    if (agreementStatus === "true") {
      setIsAgreed(true);
    }
  }, []);

  const handleTermsChange = () => {
    setIsTermsAgreed((prev) => !prev);
  };

  const handlePrivacyChange = () => {
    setIsPrivacyAgreed((prev) => !prev);
  };

  // 두 조건이 모두 만족하면 isAgreed가 true
  useEffect(() => {
    if (isTermsAgreed && isPrivacyAgreed) {
      setIsAgreed(true);
    } else {
      setIsAgreed(false);
    }
  }, [isTermsAgreed, isPrivacyAgreed]);

  const handleNext = () => {
    if (isAgreed) {
      localStorage.setItem("isAgreed", "true");
      router.push("/signup/Step2");
    } else {
      alert("이용약관과 개인정보처리 방침에 동의해야 합니다.");
    }
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-gray-100 py-30">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">약관 동의</h1>

        {/* 이용약관 동의 */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isTermsAgreed}
            onChange={handleTermsChange}
            className="mr-2"
            id="termsCheckbox"
          />
          <label htmlFor="termsCheckbox" className="text-gray-700 cursor-pointer">
            이용약관에 동의합니다.
          </label>
          <button
            onClick={() => setShowTermsModal(true)}
            className="ml-2 text-blue-500 text-sm underline"
          >
            이용약관 보기
          </button>
        </div>

        {/* 개인정보 처리방침 동의 */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isPrivacyAgreed}
            onChange={handlePrivacyChange}
            className="mr-2"
            id="privacyCheckbox"
          />
          <label htmlFor="privacyCheckbox" className="text-gray-700 cursor-pointer">
            개인정보 처리방침에 동의합니다.
          </label>
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="ml-2 text-blue-500 text-sm underline"
          >
            개인정보 처리방침 보기
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={!isAgreed}
          className={`w-full py-2 rounded-lg transition ${isAgreed ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          다음
        </button>
      </div>

      {/* 이용약관 모달 */}
      {showTermsModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">이용약관</h2>
            <p className="text-sm mb-4">
              이용약관 내용이 여기에 들어갑니다. <br />
              여기에 법적 동의가 필요한 조항을 추가해주세요. <br />
              예: 사용자가 서비스를 이용하면서 발생하는 책임, 금지된 행동, 저작권 등의 조항
            </p>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 개인정보처리방침 모달 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">개인정보 처리방침</h2>
            <p className="text-sm mb-4">
              개인정보 처리방침 내용이 여기에 들어갑니다. <br />
              여기에 개인정보 수집, 이용, 제공 등에 관한 정책을 추가해주세요. <br />
              예: 수집하는 개인정보 항목, 이용 목적, 보유 기간 등
            </p>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1;
