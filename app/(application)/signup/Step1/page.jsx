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
     {/* 이용약관 모달 */}
{showTermsModal && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">이용약관</h2>
      <div className="text-sm space-y-3 text-gray-700 leading-relaxed">
        <p>
          본 약관은 Pawpel(이하 "회사")이 제공하는 반려동물 커뮤니티, 건강관리 정보, 온라인 쇼핑몰 서비스를 회원이 이용함에 있어 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>

        <h3 className="font-semibold mt-4">제1조 (회원가입 및 이용계약 체결)</h3>
        <p>
          회원은 회사가 정한 가입 양식에 따라 개인정보를 제공하고 본 약관에 동의함으로써 회원가입을 신청하며, 회사가 이를 승낙함으로써 이용계약이 체결됩니다. 만 14세 미만은 가입이 불가합니다.
        </p>

        <h3 className="font-semibold mt-4">제2조 (서비스의 내용)</h3>
        <p>
          Pawpel은 다음의 서비스를 제공합니다:
          <br />① 반려동물 관련 커뮤니티 및 게시판 제공 <br />② 반려동물 건강정보 및 콘텐츠 제공
          <br />③ 반려동물 관련 상품의 온라인 판매 및 구매 기능 <br />④ 기타 회사가 정하는 부가 서비스
        </p>

        <h3 className="font-semibold mt-4">제3조 (회원의 의무)</h3>
        <p>
          회원은 다음 각 호의 행위를 해서는 안 됩니다:
          <br />① 허위 정보 제공 <br />② 타인의 개인정보 도용 <br />③ 욕설, 비방, 음란물 등 부적절한 게시물 작성
          <br />④ 건강 정보의 오남용 또는 자가 진단 유도 <br />⑤ 회사의 운영을 방해하는 행위
        </p>

        <h3 className="font-semibold mt-4">제4조 (커뮤니티 이용)</h3>
        <p>
          회원은 커뮤니티에 게시물을 자유롭게 작성할 수 있으나, 게시물의 저작권은 회원에게 있으며 회사는 해당 게시물을 서비스 홍보, 운영 목적상 활용할 수 있습니다. 타인의 권리를 침해하는 게시물은 삭제될 수 있습니다.
        </p>

        <h3 className="font-semibold mt-4">제5조 (건강 정보 관련 책임)</h3>
        <p>
          회사는 건강 관련 콘텐츠를 정보 제공 목적으로만 제공하며, 이는 수의사의 진단을 대체하지 않습니다. 회원은 제공된 정보를 자의적으로 해석하거나 치료 목적으로 사용해서는 안 됩니다.
        </p>

        <h3 className="font-semibold mt-4">제6조 (스토어 이용 및 결제)</h3>
        <p>
          회원은 회사의 스토어에서 상품을 구매할 수 있으며, 결제 및 배송, 교환/환불은 회사의 전자상거래 운영 정책 및 관계 법령을 따릅니다. 단순 변심에 의한 환불은 상품의 특성에 따라 제한될 수 있습니다.
        </p>

        <h3 className="font-semibold mt-4">제7조 (서비스의 중단)</h3>
        <p>
          회사는 시스템 점검, 기술적 문제 또는 기타 불가피한 사유로 일시적으로 서비스를 중단할 수 있으며, 이로 인한 손해에 대해 법적 책임을 지지 않습니다. 단, 사전 공지에 최선을 다합니다.
        </p>

        <h3 className="font-semibold mt-4">제8조 (개인정보 보호)</h3>
        <p>
          회사는 회원의 개인정보를 보호하며, 관련 법령 및 개인정보처리방침에 따라 안전하게 처리합니다. 회원은 자신의 개인정보를 수시로 열람 및 수정할 수 있습니다.
        </p>

        <h3 className="font-semibold mt-4">제9조 (지적재산권)</h3>
        <p>
          회사가 제작한 콘텐츠, 서비스 로고, 디자인 등은 회사에 저작권이 있으며, 무단 복제, 배포를 금합니다. 회원이 작성한 게시물의 저작권은 작성자에게 있으나, 서비스 운영을 위한 사용권을 회사에 부여합니다.
        </p>

        <h3 className="font-semibold mt-4">제10조 (책임 제한)</h3>
        <p>
          회사는 회원의 부주의, 제3자의 불법행위, 천재지변 등으로 인해 발생한 손해에 대해 책임지지 않으며, 커뮤니티 내의 게시물에 대한 검증 책임을 지지 않습니다.
        </p>

        <h3 className="font-semibold mt-4">제11조 (약관의 변경)</h3>
        <p>
          본 약관은 회사의 정책 변경, 법령 개정 등에 따라 사전 고지 후 변경될 수 있으며, 변경된 약관은 공지 후 즉시 효력을 가집니다. 회원은 변경된 약관에 동의하지 않을 경우 회원탈퇴를 요청할 수 있습니다.
        </p>

        <h3 className="font-semibold mt-4">제12조 (준거법 및 관할)</h3>
        <p>
          본 약관은 대한민국 법령에 따라 해석되며, 서비스와 관련하여 분쟁이 발생할 경우 서울중앙지방법원을 전속 관할 법원으로 합니다.
        </p>
      </div>

      <button
        onClick={() => setShowTermsModal(false)}
        className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
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
