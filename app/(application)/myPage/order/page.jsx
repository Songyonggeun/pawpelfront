'use client';

import { useEffect, useState } from 'react';
import MenuComponents from '@/components/(application)/menu';

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

  const menuItems = [
    { title: '회원 정보 수정', href: '/myPage/checkpw' },
    { title: '주문내역', href: '/myPage/order' },
    { title: '건강체크 기록', href: '/myPage/health' },
    { title: '백신접종 기록', href: '/myPage/vaccine' },
    { title: '상담 글', href: '/myPage/consult' },
    { title: '작성 글', href: '/myPage/posts' },
  ];

  if (!user) return <div className="p-6 text-center">로그인 정보를 확인 중입니다...</div>;

  return (
    <div className="flex flex-col md:flex-row max-w-[1100px] mx-auto px-6 py-6 gap-10">
      {/* 왼쪽 메뉴바 */}
      <aside className="w-full md:w-60 flex-shrink-0 md:mr-10 order-2 md:order-1 mt-10 md:mt-0 bg-gray-50 min-h-[80vh]">
        <nav className="mt-[10px] px-[10px]">
          <ul className="space-y-3">
            <MenuComponents data={menuItems} />
          </ul>
        </nav>
      </aside>

      {/* 주문내역 테이블 */}
      <main className="flex-1 order-1 md:order-2 ml-0 md:-ml-6">
        <h1 className="text-2xl font-bold mb-6 text-center">🧾 내 주문 내역</h1>

        {orders.length === 0 ? (
          <div className="p-6 text-center">주문 내역이 없습니다.</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-300 px-2 py-2">주문번호</th>
                <th className="border border-gray-300 px-2 py-2">상품 이미지</th>
                <th className="border border-gray-300 px-2 py-2">상품명</th>
                <th className="border border-gray-300 px-2 py-2">수량</th>
                <th className="border border-gray-300 px-2 py-2">상품 총액</th>
                <th className="border border-gray-300 px-2 py-2">총 결제 금액</th>
                <th className="border border-gray-300 px-2 py-2">결제 상태</th>
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
                        <td rowSpan={order.items.length} className="border border-gray-300 px-2 py-2 font-medium bg-gray-50">
                          {order.orderId || `#${orderIdx + 1}`}
                        </td>
                      )}
                      <td className="border border-gray-300 px-2 py-2">
                        <img
                          src={imageUrl}
                          alt={product?.name || '상품'}
                          className="w-16 h-16 object-cover mx-auto rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/images/product/default-product.png';
                          }}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">{product?.name || item.productName}</td>
                      <td className="border border-gray-300 px-2 py-2">{item.quantity}</td>
                      <td className="border border-gray-300 px-2 py-2">
                        {(item.quantity * (product?.price || item.price)).toLocaleString()}원
                      </td>
                      {itemIdx === 0 && (
                        <>
                          <td rowSpan={order.items.length} className="border border-gray-300 px-2 py-2 font-bold text-black">
                            {order.totalAmount.toLocaleString()}원
                          </td>
                          <td rowSpan={order.items.length} className="border border-gray-300 px-2 py-2 text-gray-600">
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
        )}
      </main>
    </div>
  );
}
