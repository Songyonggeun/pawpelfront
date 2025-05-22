'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
  const router = useRouter(); // 로그인 후 리다이렉션을 위한 useRouter

  // 로그인 상태 체크 (로그인된 경우 페이지 접근 차단)
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('_ka_au_fo_th_=')); // ✅ 사용 중인 쿠키 이름으로 수정

    if (jwtCookie) {
      router.push('/home'); // ✅ 로그인한 상태라면 home으로 이동
    }
  }, [router]);

  // 로그인 실패 시 알림
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "true") {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");

      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // 기본 form 제출을 막음

  //   const loginData = {
  //     userId: userId,  // userId는 입력받은 아이디
  //     password: password,  // password는 입력받은 비밀번호
  //   };

  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/permit/auth/signin`, {
  //       method: "POST",  // HTTP POST 방식
  //       headers: {
  //         "Content-Type": "application/json",  // JSON 형식으로 데이터 전송
  //       },
  //       body: JSON.stringify(loginData),  // 데이터를 JSON 문자열로 변환
  //     });

  //     if (response.ok) {
  //       // 서버에서 JSON 응답이 정상적으로 왔다면
  //       const data = await response.json();

  //       if (data.error) {
  //         // 에러 메시지 처리
  //         setErrorMessage(data.error);
  //       } else if (data.redirect) {
  //         // 로그인 성공 시 쿠키에 JWT 토큰 저장
  //         const token = data.token; // 서버에서 받은 JWT 토큰
  //         const expires = new Date(new Date().getTime() + 60 * 60 * 1000); // 쿠키 만료 시간 1시간 후
  //         document.cookie = `jwt=${token}; path=/; expires=${expires.toUTCString()}; secure; SameSite=Strict`;

  //         // 리다이렉션 URL 처리
  //         window.location.href = data.redirect;  // 리다이렉션 처리
  //       }
  //     } else {
  //       setErrorMessage("서버 오류");
  //     }
  //   } catch (error) {
  //     console.error("Network error:", error);
  //     setErrorMessage("서버와의 연결에 실패했습니다.");
  //   }
  // };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-10 sm:pt-20">
      <form
        // onSubmit={handleSubmit} // 기본 form 제출 대신 handleSubmit 호출
        action={process.env.NEXT_PUBLIC_SPRING_SERVER_URL + '/permit/signin'}
        method='post'
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">로그인</h2>

        {/* 아이디 입력 */}
        <input
          name="userId"
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 비밀번호 입력 */}
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 에러 메시지 출력 */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        {/* 추가 링크 */}
        <div className="flex justify-center gap-x-5 text-sm text-blue-600 mb-6">
          <Link href="/signup/Step1" className="hover:underline">회원가입</Link>
          <Link href="/find-id" className="hover:underline">아이디 찾기</Link>
          <Link href="/find-password" className="hover:underline">비밀번호 찾기</Link>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          로그인
        </button>

        {/* 소셜 로그인 구분선 */}
        {/* <div className="my-6 border-t relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-400">
            또는 소셜 로그인
          </span>
        </div> */}

        {/* 소셜 로그인 버튼들 */}
        {/* <div className="flex flex-col gap-3">
          <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
            Google 로그인
          </button>
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
            Naver 로그인
          </button>
          <button className="w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500 transition">
            Kakao 로그인
          </button>
        </div> */}
      </form>
    </div>
  );
}
