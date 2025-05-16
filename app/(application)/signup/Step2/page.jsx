"use client";

import { useState } from "react";
import { useRouter } from "next/router";

const Step2 = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step1에서 'isAgreed' 값을 로컬 스토리지에서 확인
  const [isAgreed, setIsAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("모든 필드를 작성해주세요.");
      return;
    }

    // 서버에 개인정보 전달 (SSR 방식)
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      localStorage.removeItem("isAgreed"); // 회원가입 완료 후 스토리지에서 동의 상태 제거
      alert("회원가입이 완료되었습니다.");
      router.push("/login"); // 로그인 페이지로 리디렉션
    } else {
      alert("회원가입에 실패했습니다.");
    }
  };

  // Step1에서 넘어왔을 때 로컬 스토리지에서 동의 상태 확인
  useEffect(() => {
    const agreementStatus = localStorage.getItem("isAgreed");
    if (agreementStatus !== "true") {
      router.push("/signup/step1"); // 동의하지 않으면 step1로 돌아감
    }
  }, []);

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default Step2;
