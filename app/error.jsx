"use client";

import React from "react";

export default function Error({ error, reset }) {
  // error: 실제 에러 객체
  // reset: 에러 복구 함수, 호출 시 에러 boundary를 리셋함

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">500</h1>
      <h2 className="text-2xl font-semibold mb-2">서버 오류가 발생했습니다.</h2>
      <p className="mb-6 text-gray-700">잠시 후 다시 시도해 주세요.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        다시 시도하기
      </button> 
    </div>
  );
}
