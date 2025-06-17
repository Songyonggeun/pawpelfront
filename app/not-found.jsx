"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">페이지를 찾을 수 없습니다.</h2>
      <p className="mb-6 text-gray-700">요청하신 페이지가 존재하지 않습니다.</p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
