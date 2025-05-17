const EmailInput = ({
  email,
  setEmail,
  emailUsername,
  setEmailUsername,
  emailDomain,
  setEmailDomain,
  customEmailDomain,
  setCustomEmailDomain,
}) => {
  // 이메일 전체 주소 갱신 함수
  const updateEmail = (username, domain) => {
    if (username && domain) {
      setEmail(`${username}@${domain}`);
    } else {
      setEmail("");
    }
  };

  // 사용자 아이디 입력 처리
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setEmailUsername(newUsername);

    const domain = emailDomain === "custom" ? customEmailDomain : emailDomain;
    updateEmail(newUsername, domain);
  };

  // 도메인 선택 처리
  const handleEmailDomainChange = (e) => {
    const newDomain = e.target.value;
    setEmailDomain(newDomain);

    if (newDomain !== "custom") {
      setCustomEmailDomain(""); // 커스텀 초기화
      updateEmail(emailUsername, newDomain);
    } else {
      updateEmail(emailUsername, customEmailDomain);
    }
  };

  // 커스텀 도메인 입력 처리
  const handleCustomDomainChange = (e) => {
    const newCustomDomain = e.target.value;
    setCustomEmailDomain(newCustomDomain);
    updateEmail(emailUsername, newCustomDomain);
  };

  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">이메일</label>
      <div className="flex items-center gap-1">
        {/* 사용자 아이디 입력 필드 */}
        <input
          type="text"
          value={emailUsername}
          onChange={handleUsernameChange}
          required
          className="w-2/5 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="아이디를 입력하세요"
        />
        <span>@</span>

        {/* 커스텀 도메인 입력 필드 (선택 시에만 표시) */}
        {emailDomain === "custom" && (
          <input
            type="text"
            value={customEmailDomain}
            onChange={handleCustomDomainChange}
            className="w-1/3 px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="도메인 입력"
          />
        )}

        {/* 도메인 선택 드롭다운 */}
        <select
          value={emailDomain}
          onChange={handleEmailDomainChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/3"
        >
          <option value="naver.com">naver.com</option>
          <option value="daum.com">daum.com</option>
          <option value="google.com">google.com</option>
          <option value="custom">직접 입력</option>
        </select>
      </div>
    </div>
  );
};

export default EmailInput;
