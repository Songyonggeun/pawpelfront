const PasswordInput = ({ password, setPassword, confirmPassword, setConfirmPassword, passwordError }) => {
  return (
    <div>
      {/* 비밀번호 입력 필드 */}
      <label className="block mb-1 text-gray-700 font-medium">비밀번호</label>
      <input
        type="password"
        name="password1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="비밀번호를 입력하세요"
      />
      
      {/* 비밀번호 확인 입력 필드 */}
      <label className="block mt-4 mb-1 text-gray-700 font-medium">비밀번호 확인</label>
      <input
        type="password"
        name = "password2"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${passwordError
          ? "border-red-500 focus:ring-red-300"
          : "focus:ring-blue-400"
          }`}
        placeholder="비밀번호를 다시 입력하세요"
      />
      
      {/* 비밀번호 확인 오류 메시지 */}
      {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
    </div>
  );
};

export default PasswordInput;
