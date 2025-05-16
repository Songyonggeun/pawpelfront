const EmailInput = ({
  email,
  setEmail,
  emailDomain,
  setEmailDomain,
  customEmailDomain,
  setCustomEmailDomain,
}) => {
  // 이메일 도메인 변경 처리
  const handleEmailDomainChange = (e) => {
    const newDomain = e.target.value;
    setEmailDomain(newDomain);

    // 'custom'이 아니면 customEmailDomain 리셋
    if (newDomain !== "custom") {
      setCustomEmailDomain("");
    }
  };

  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">이메일</label>
      <div className="flex items-center gap-1">
        {/* 이메일 아이디 입력 필드 */}
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-2/5 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="아이디를 입력하세요"
        />
        <span>@</span>

        {/* 'custom' 선택 시 도메인 입력 필드 보여주기 */}
        {emailDomain === "custom" && (
          <input
            type="text"
            value={customEmailDomain}
            onChange={(e) => setCustomEmailDomain(e.target.value)}
            className="w-1/3 px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="도메인 입력"
          />
        )}


        {/* select박스는 항상 보이도록 */}
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
