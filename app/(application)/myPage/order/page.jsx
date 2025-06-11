'use client';

import { useEffect, useState } from 'react';

export default function OrderListPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // 로그인 유저 불러오기
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/me`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP 상태 코드: ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('❗ 유저 요청 실패:', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order?userId=${user.id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('❗ 주문 불러오기 실패:', err);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return <div className="p-6">로그인 정보를 확인 중입니다...</div>;
  if (!orders.length) return <div className="p-6">주문 내역이 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧾 내 주문 내역</h1>
      <ul className="space-y-6">
        {orders.map((order, idx) => (
          <li key={idx} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">주문번호: {idx + 1}</span>
              <span className="text-sm text-gray-500">{order.status}</span>
            </div>
            <p className="mb-2 text-sm text-gray-600">
              총 결제 금액: <strong>{order.totalAmount.toLocaleString()}원</strong>
            </p>
            <ul className="pl-4 text-sm text-gray-700 list-disc">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.productName} - {item.quantity}개 ({item.price.toLocaleString()}원)
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
