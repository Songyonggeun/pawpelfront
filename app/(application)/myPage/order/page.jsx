'use client';

import { useEffect, useState } from 'react';

export default function OrderListPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('유저 정보 요청 실패');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchOrdersWithProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order?userId=${user.id}`, {
          credentials: 'include',
        });
        const rawOrders = await res.json();

        // 각 주문의 각 상품을 fetch해서 추가 정보 붙이기
        const enhancedOrders = await Promise.all(
          rawOrders.map(async (order) => {
            const itemsWithProduct = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const productRes = await fetch(
                    `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products/${item.productId}`,
                    { credentials: 'include' }
                  );
                  const product = await productRes.json();
                  return { ...item, product };
                } catch (e) {
                  console.error('❗ 상품 정보 불러오기 실패:', item.productId);
                  return { ...item, product: null };
                }
              })
            );

            return { ...order, items: itemsWithProduct };
          })
        );

        setOrders(enhancedOrders);
      } catch (err) {
        console.error('❗ 주문 불러오기 실패:', err);
      }
    };

    fetchOrdersWithProducts();
  }, [user]);

  if (!user) return <div className="p-6 text-center">로그인 정보를 확인 중입니다...</div>;
  if (!orders.length) return <div className="p-6 text-center">주문 내역이 없습니다.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧾 내 주문 내역</h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="border px-2 py-2">주문번호</th>
            <th className="border px-2 py-2">상품 이미지</th>
            <th className="border px-2 py-2">상품명</th>
            <th className="border px-2 py-2">수량</th>
            <th className="border px-2 py-2">상품 총액</th>
            <th className="border px-2 py-2">총 결제 금액</th>
            <th className="border px-2 py-2">결제 상태</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, orderIdx) =>
            order.items.map((item, itemIdx) => {
              const product = item.product;
              const imageUrl =
                product?.image?.startsWith('/images/')
                  ? product.image
                  : product?.image
                  ? `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.image}`
                  : '/images/product/default-product.png';

              return (
                <tr key={`${orderIdx}-${itemIdx}`} className="text-center">
                  {itemIdx === 0 && (
                    <td rowSpan={order.items.length} className="border px-2 py-2 font-medium bg-gray-50">
                      {order.orderId || `#${orderIdx + 1}`}
                    </td>
                  )}
                  <td className="border px-2 py-2">
                    <img
                      src={imageUrl}
                      alt={product?.name || '상품'}
                      className="w-16 h-16 object-cover mx-auto rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/product/default-product.png';
                      }}
                    />
                  </td>
                  <td className="border px-2 py-2">{product?.name || item.productName}</td>
                  <td className="border px-2 py-2">{item.quantity}</td>
                  <td className="border px-2 py-2">
                    {(item.quantity * (product?.price || item.price)).toLocaleString()}원
                  </td>
                  {itemIdx === 0 && (
                    <>
                      <td rowSpan={order.items.length} className="border px-2 py-2 font-bold text-black bg-gray-50">
                        {order.totalAmount.toLocaleString()}원
                      </td>
                      <td rowSpan={order.items.length} className="border px-2 py-2 text-gray-600 bg-gray-50">
                        {order.status}
                      </td>
                    </>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
