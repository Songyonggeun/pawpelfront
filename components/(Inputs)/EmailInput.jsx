import { useEffect } from "react";

const EmailInput = ({
  emailUsername,
  setEmailUsername,
  emailDomain,
  setEmailDomain,
  customEmailDomain,
  setCustomEmailDomain,
}) => {
  // ✅ 초기값 설정: 첫 렌더링 시 naver.com 고정
  useEffect(() => {
    if (!emailDomain) {
      setEmailDomain("naver.com");
      setCustomEmailDomain("naver.com");
    }
  }, [emailDomain, setEmailDomain, setCustomEmailDomain]);

  const handleUsernameChange = (e) => {
    setEmailUsername(e.target.value);
  };

  const handleEmailDomainChange = (e) => {
    const selectedDomain = e.target.value;
    setEmailDomain(selectedDomain);

    if (selectedDomain !== "custom") {
      setCustomEmailDomain(selectedDomain); // 선택된 도메인으로 고정
    } else {
      setCustomEmailDomain(""); // 직접입력 초기화
    }
  };

  const handleCustomDomainChange = (e) => {
    setCustomEmailDomain(e.target.value);
  };

  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">이메일</label>
      <div className="flex items-center gap-1">
        {/* 아이디 입력 */}
        <input
          name="email1"
          type="text"
          value={emailUsername}
          onChange={handleUsernameChange}
          required
          className="w-2/5 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="아이디 입력"
        />
        <span>@</span>

        {/* 도메인 입력 (직접입력일 때만 활성화) */}
<input
  name="email2"
  type="text"
  value={customEmailDomain}
  onChange={handleCustomDomainChange}
  disabled={emailDomain !== "custom"}
  placeholder={emailDomain === "custom" ? "도메인 입력" : emailDomain}
  className={`w-1/3 px-2 py-2 border rounded-md focus:outline-none focus:ring-2 ${
    emailDomain === "custom" ? "focus:ring-blue-400 bg-white" : "bg-gray-100 text-gray-500"
  }`}
/>

        {/* 도메인 선택 */}
        <select
          value={emailDomain}
          onChange={handleEmailDomainChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/3"
        >
          <option value="naver.com">naver.com</option>
          <option value="daum.net">daum.net</option>
          <option value="gmail.com">gmail.com</option>
          <option value="custom">직접 입력</option>
        </select>
      </div>
    </div>
  );
};

export default EmailInput;
