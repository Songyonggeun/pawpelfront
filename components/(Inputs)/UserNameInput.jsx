"use client";

const UsernameInput = ({ username, setUsername, isChecked, setIsChecked }) => {
  const handleCheck = () => {
    if (!username.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    // 중복 확인 API 자리
    alert("사용 가능한 아이디입니다.");
    setIsChecked(true);
  };

  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">아이디</label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setIsChecked(false); // 입력 변경 시 확인 상태 초기화
          }}
          required
          className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="아이디를 입력하세요"
        />
        <button
          type="button"
          onClick={handleCheck}
          className="whitespace-nowrap w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          중복 확인
        </button>
      </div>
    </div>
  );
};

export default UsernameInput;
