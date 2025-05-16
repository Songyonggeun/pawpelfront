'use client';

import { useState } from "react";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", userId, password);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-40 ">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">로그인</h2>

        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="w-full px-2 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 회원가입 / 아이디 찾기 / 비밀번호 찾기 */}
        <div className="flex justify-center gap-x-5 text-sm text-blue-600 mb-6">
          <a href="/signup/step1" className="hover:underline">회원가입</a>
          <a href="#" className="hover:underline">아이디 찾기</a>
          <a href="#" className="hover:underline">비밀번호 찾기</a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          로그인
        </button>

        {/* 소셜 로그인 구분선 */}
        <div className="my-6 border-t relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-400">
            또는 소셜 로그인
          </span>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="flex flex-col gap-3">
          <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
            Google 로그인
          </button>
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
            Naver 로그인
          </button>
          <button className="w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500 transition">
            Kakao 로그인
          </button>
        </div>
      </form>
    </div>
  );
}
