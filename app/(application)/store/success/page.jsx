'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function TossSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const confirmPayment = async () => {
      const orderId = searchParams.get('orderId');
      const amount = Number(searchParams.get('amount'));

      const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
      if (!pendingOrder) {
        alert('결제 정보가 유실되었습니다.');
        router.replace('/store');
        return;
      }

      pendingOrder.status = '결제완료';
      pendingOrder.totalAmount = amount;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(pendingOrder),
        });

        if (!response.ok) throw new Error('주문 저장 실패');

        // ✅ 장바구니 결제인 경우 장바구니 비우기
        if (pendingOrder.items.length > 1) {
          await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products/cart/clear`, {
            method: 'DELETE',
            credentials: 'include',
          });
        }

        localStorage.removeItem('pendingOrder');
        router.replace(`/myPage/order`);
      } catch (err) {
        console.error('❗ 주문 저장 오류:', err);
        alert('결제는 완료되었으나 주문 정보 저장에 실패했습니다.');
      }
    };

    confirmPayment();
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">결제 확인 중입니다...</h1>
    </div>
  );
}
