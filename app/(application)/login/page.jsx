'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('_ka_au_fo_th_='));
    if (jwtCookie) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "true") {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-10 sm:pt-20">
      <form
        action={process.env.NEXT_PUBLIC_SPRING_SERVER_URL + '/permit/signin'}
        method='post'
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">로그인</h2>

        <input
          name="userId"
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <div className="flex justify-center gap-x-5 text-sm text-blue-600 mb-4">
          <Link href="/signup/Step1" className="hover:underline">회원가입</Link>
          <Link href="/find/findid" className="hover:underline">아이디 찾기</Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          로그인
        </button>

        <div className="my-6 border-t relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-400">
            또는 소셜 로그인
          </span>
        </div>

        {/* 소셜 로그인 버튼들 */}
        {/* <div className="flex flex-col gap-3">
          <a
            href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/google`}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-center"
          >
            Google 로그인
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/naver`}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition text-center"
          >
            Naver 로그인
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/kakao`}
            className="w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500 transition text-center"
          >
            Kakao 로그인
          </a>
        </div> */}
        
        <div className="flex justify-center gap-6 mt-4">
          {/* Google 로그인 */}
          <a
            href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/google`}
            className="hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M23.04 12.2614C23.04 11.4459 22.9668 10.6618 22.8309 9.90912H12V14.3575H18.1891C17.9225 15.795 17.1123 17.013 15.8943 17.8284V20.7139H19.6109C21.7855 18.7118 23.04 15.7637 23.04 12.2614Z" fill="#4285F4"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 23.4998C15.105 23.4998 17.7081 22.47 19.6109 20.7137L15.8943 17.8282C14.8645 18.5182 13.5472 18.9259 12 18.9259C9.00474 18.9259 6.46951 16.903 5.56519 14.1848H1.72314V17.1644C3.61542 20.9228 7.50451 23.4998 12 23.4998Z" fill="#34A853"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M5.56523 14.1851C5.33523 13.4951 5.20455 12.758 5.20455 12.0001C5.20455 11.2421 5.33523 10.5051 5.56523 9.81506V6.83551H1.72318C0.944318 8.38801 0.5 10.1444 0.5 12.0001C0.5 13.8557 0.944318 15.6121 1.72318 17.1646L5.56523 14.1851Z" fill="#FBBC05"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 5.07386C13.6884 5.07386 15.2043 5.65409 16.3961 6.79364L19.6945 3.49523C17.7029 1.63955 15.0997 0.5 12 0.5C7.50451 0.5 3.61542 3.07705 1.72314 6.83545L5.56519 9.815C6.46951 7.09682 9.00474 5.07386 12 5.07386Z" fill="#EA4335"/>
            </svg>
          </a>

          {/* Naver 로그인 */}
          <a
            href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/naver`}
            className="hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_403_243)">
                <path d="M18 20H2C0.9 20 0 19.1 0 18V2C0 0.9 0.9 0 2 0H18C19.1 0 20 0.9 20 2V18C20 19.1 19.1 20 18 20Z" fill="#03C75A"/>
                <path d="M11.35 10.25L8.50002 6.19995H6.15002V13.8H8.65002V9.74995L11.5 13.8H13.85V6.19995H11.35V10.25Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_403_243">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </a>

          {/* Kakao 로그인 */}
          <a
            href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/kakao`}
            className="hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 256 256">
              <path fill="#FFE812" d="M256 236c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0h216c11.046 0 20 8.954 20 20v216z"/>
              <path d="M128 36C70.562 36 24 72.713 24 118c0 29.279 19.466 54.97 48.748 69.477-1.593 5.494-10.237 35.344-10.581 37.689 0 0-.207 1.762.934 2.434s2.483.15 2.483.15c3.272-.457 37.943-24.811 43.944-29.04 5.995.849 12.168 1.29 18.472 1.29 57.438 0 104-36.712 104-82 0-45.287-46.562-82-104-82z"/>
              <path fill="#FFE812" d="M70.5 146.625c-3.309 0-6-2.57-6-5.73V105.25h-9.362c-3.247 0-5.888-2.636-5.888-5.875s2.642-5.875 5.888-5.875h30.724c3.247 0 5.888 2.636 5.888 5.875s-2.642 5.875-5.888 5.875H76.5v35.645c0 3.16-2.691 5.73-6 5.73zM123.112 146.547c-2.502 0-4.416-1.016-4.993-2.65l-2.971-7.778-18.296-.001-2.973 7.783c-.575 1.631-2.488 2.646-4.99 2.646a9.155 9.155 0 0 1-3.814-.828c-1.654-.763-3.244-2.861-1.422-8.52l14.352-37.776c1.011-2.873 4.082-5.833 7.99-5.922 3.919.088 6.99 3.049 8.003 5.928l14.346 37.759c1.826 5.672.236 7.771-1.418 8.532a9.176 9.176 0 0 1-3.814.827zm-11.119-21.056L106 108.466l-5.993 17.025h11.986zM138 145.75c-3.171 0-5.75-2.468-5.75-5.5V99.5c0-3.309 2.748-6 6.125-6s6.125 2.691 6.125 6v35.25h12.75c3.171 0 5.75 2.468 5.75 5.5s-2.579 5.5-5.75 5.5H138zM171.334 146.547c-3.309 0-6-2.691-6-6V99.5c0-3.309 2.691-6 6-6s6 2.691 6 6v12.896l16.74-16.74c.861-.861 2.044-1.335 3.328-1.335 1.498 0 3.002.646 4.129 1.772 1.051 1.05 1.678 2.401 1.764 3.804.087 1.415-.384 2.712-1.324 3.653l-13.673 13.671 14.769 19.566a5.951 5.951 0 0 1 1.152 4.445 5.956 5.956 0 0 1-2.328 3.957 5.94 5.94 0 0 1-3.609 1.211 5.953 5.953 0 0 1-4.793-2.385l-14.071-18.644-2.082 2.082v13.091a6.01 6.01 0 0 1-6.002 6.003z"/>
            </svg>
          </a>
        </div>
      </form>
    </div>
  );
}
