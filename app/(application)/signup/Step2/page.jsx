"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Step2 = () => {
  const router = useRouter();

  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true); // 검사 중 상태

  const [username, setUsername] = useState("");
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const isAgreed = localStorage.getItem("isAgreed");
    if (isAgreed === "true") {
      setIsAllowed(true);
    } else {
      router.replace("/home");
    }
    setLoading(false); // 검사 끝났으니 로딩 끝
  }, [router]);

  // 검사 완료 전이나 동의 안 하면 아무것도 렌더링하지 않음
  if (loading) return null;
  if (!isAllowed) return null;

  const handleUsernameCheck = () => {
    if (username.trim() === "") {
      alert("아이디를 입력해주세요.");
      return;
    }
    // API 콜 대체 부분
    alert("사용 가능한 아이디입니다.");
    setIsUsernameChecked(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !username ||
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !birthDate ||
      !gender ||
      !address
    ) {
      alert("모든 필드를 작성해주세요.");
      return;
    }

    if (!isUsernameChecked) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, name, email, password, phone, birthDate, gender, address }),
    });

    if (response.ok) {
      alert("회원가입이 완료되었습니다.");
      router.push("/signup/Welcome");
    } else {
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    // 기존 렌더링 코드 동일
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-16">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 아이디 + 중복 확인 */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">아이디</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsUsernameChecked(false);
                }}
                required
                className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="아이디를 입력하세요"
              />
              <button
                type="button"
                onClick={handleUsernameCheck}
                className="whitespace-nowrap w-full sm:w-auto bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 sm:text-base rounded-md hover:bg-blue-600 transition"
              >
                중복 확인
              </button>
            </div>
          </div>

          {/* 이메일 */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="이메일을 입력하세요"
            />
          </div>

          {/* 이름 */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">전화번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="전화번호를 입력하세요"
            />
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">성별</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">성별 선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>

          {/* 주소 */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">주소</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="주소를 입력하세요"
            />
          </div>

          {/* 가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step2;
  