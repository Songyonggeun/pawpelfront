"use client";

const UsernameInput = ({ username, setUsername, isChecked, setIsChecked }) => {
  const handleCheck = async () => {
    if (!username.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/permit/auth/check-id?username=${username}`
      );
      const data = await res.json();

      if (data.exists) {
        alert("이미 사용 중인 아이디입니다.");
        setIsChecked(false);
      } else {
        alert("사용 가능한 아이디입니다.");
        setIsChecked(true);
      }
    } catch (error) {
      console.error("중복 확인 오류:", error);
      alert("중복 확인 중 오류가 발생했습니다.");
      setIsChecked(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9]*$/; // 영문+숫자만 허용
    if (regex.test(value)) {
      setUsername(value);
      setIsChecked(false);
    }
  };

  return (
    <div>
      <label className="block mb-1 text-sm text-gray-700 font-medium">아이디</label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          type="text"
          name="id"
          value={username}
          onChange={handleChange}
          required
          className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-sm"
          placeholder="아이디는 영문 + 숫자 조합만 가능합니다"
        />
        <button
          type="button"
          onClick={handleCheck}
          className="whitespace-nowrap w-full sm:w-auto bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
        >
          중복 확인
        </button>
      </div>
    </div>
  );
};

export default UsernameInput;
