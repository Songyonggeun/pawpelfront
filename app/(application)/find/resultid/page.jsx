'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function ResultIdPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('page');
  const router = useRouter();

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl text-center">
        <h1 className="text-2xl font-semibold mb-6">아이디 찾기 결과</h1>
        {userId ? (
          <>
            <p className="text-lg mb-6">
              회원님의 아이디는 <strong className="text-blue-600">{userId}</strong> 입니다.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/login')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                로그인 하기
              </button>
              <button
                onClick={() => router.push(`/find/resetpw?userId=${userId}`)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                비밀번호 재설정
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-500">아이디 정보를 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  );
}
