'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 3000); // 3초 후 이동

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">🎉 가입을 축하드립니다!</h1>
      <p className="text-lg text-gray-700">이제 서비스를 자유롭게 이용하실 수 있습니다.</p>
    </div>
  );
}
