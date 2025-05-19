import { useEffect } from "react";

const EmailInput = ({
  emailUsername,
  setEmailUsername,
  emailDomain,
  setEmailDomain,
  customEmailDomain,
  setCustomEmailDomain,
}) => {
  // 초기 로드시 naver.com 고정 설정
  useEffect(() => {
    setEmailDomain("naver.com");
    setCustomEmailDomain("naver.com");
  }, [setEmailDomain, setCustomEmailDomain]);

  // 사용자 아이디 입력 처리
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setEmailUsername(newUsername);
  };

  // 도메인 선택 처리 → 입력창에도 반영
  const handleEmailDomainChange = (e) => {
    const selectedDomain = e.target.value;
    setEmailDomain(selectedDomain);
    setCustomEmailDomain(selectedDomain); // 입력 필드에 반영
  };

  // 도메인 입력 필드 직접 수정 시
  const handleCustomDomainChange = (e) => {
    const newDomain = e.target.value;
    setCustomEmailDomain(newDomain);
  };

  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">이메일</label>
      <div className="flex items-center gap-1">
        {/* 사용자 아이디 입력 필드 */}
        <input
          name="email1" // 사용자 아이디 부분
          type="text"
          value={emailUsername}
          onChange={handleUsernameChange}
          required
          className="w-2/5 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="아이디를 입력하세요"
        />
        <span>@</span>

        {/* 도메인 입력 필드 */}
        <input
          name="email2" // ✅ 도메인 부분 name 설정
          type="text"
          value={customEmailDomain}
          onChange={handleCustomDomainChange}
          className="w-1/3 px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="도메인 입력"
        />

        {/* 도메인 선택 드롭다운 */}
        <select
          value={emailDomain}
          onChange={handleEmailDomainChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/3"
        >
          <option value="naver.com">naver.com</option>
          <option value="daum.com">daum.com</option>
          <option value="google.com">google.com</option>
          <option value="">직접 입력</option>
        </select>
      </div>
    </div>
  );
};

export default EmailInput;
