'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TossSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/toss/confirm?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.text()) // ✅ 중요: text로 출력
  .then((data) => {
    console.log("✅ 결제 승인 응답:", data);
  })
  .catch((err) => {
    console.error("❌ 결제 승인 실패:", err);
  });
    //   .then((res) => {
    //     if (!res.ok) throw new Error('결제 승인 실패');
    //     return res.json();
    //   })
    //   .then((data) => {
    //     console.log('✅ 결제 승인 성공:', data);
    //     router.replace('/store/order'); // ✅ 주문 완료 페이지로 이동
    //   })
    //   .catch((err) => {
    //     console.error('❌ 결제 승인 오류:', err);
    //     alert('결제 승인에 실패했습니다.');
    //   });
  }, [paymentKey, orderId, amount]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600">✅ 결제 완료</h1>
      <p className="mt-2 text-gray-600">주문을 처리 중입니다. 잠시만 기다려 주세요...</p>
    </div>
  );
}
