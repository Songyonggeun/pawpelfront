import { useState, useEffect } from "react";

const PhoneInput = ({ phone, setPhone }) => {
  // 전화번호를 3개의 부분으로 나누어 상태로 관리
  const [secondPart, setSecondPart] = useState("");  // 두 번째 부분
  const [thirdPart, setThirdPart] = useState("");   // 세 번째 부분

  // 전화번호의 각 부분을 합쳐서 하나의 값으로 만들기
  useEffect(() => {
    // 세 부분을 합쳐서 전체 전화번호를 만들고, 상태에 저장
    if (secondPart && thirdPart) {
      setPhone(`010-${secondPart}-${thirdPart}`);  // 첫 번째 부분은 고정된 010
    }
  }, [secondPart, thirdPart, setPhone]);

  const handleInputChange = (e, part) => {
    const value = e.target.value;

    // 숫자만 입력받도록 제한
    if (/^\d*$/.test(value)) {
      if (part === "second") {
        setSecondPart(value);
      } else if (part === "third") {
        setThirdPart(value);
      }
    }
  };

  // 전체 전화번호 형식이 맞는지 확인
  const isPhoneValid = /^(\d{3})-(\d{4})-(\d{4})$/.test(phone);

  return (
    <div>
      <label className="block mb-1 text-sm text-gray-700 font-medium">전화번호</label>
      <div className="flex gap-4"> 
        {/* 첫 번째 입력 필드는 고정된 값 010 */}
        <input
          type="text"
          value="010"
          className="text-sm w-1/4 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
          disabled
        />

        {/* 하이픈 자동 추가 */}
        <span className="self-center">-</span>

        {/* 두 번째 입력 필드 */}
        <input
          type="text"
          value={secondPart}
          name="phoneNumber2"
          onChange={(e) => handleInputChange(e, "second")}
          maxLength={4}
          className="w-1/3 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center placeholder:text-sm"
          placeholder="1234"
        />

        {/* 하이픈 자동 추가 */}
        <span className="self-center">-</span>

        {/* 세 번째 입력 필드 */}
        <input
          type="text"
          name="phoneNumber3"
          value={thirdPart}
          onChange={(e) => handleInputChange(e, "third")}
          maxLength={4}
          className="w-1/3 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
          placeholder="5678"
        />
      </div>

      {/* 유효성 검사 */}
      {!isPhoneValid && phone && (
        <p className="text-sm text-red-600 mt-2">전화번호 형식이 올바르지 않습니다.</p>
      )}
    </div>
  );
};

export default PhoneInput;
