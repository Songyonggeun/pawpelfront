'use client';

import { useEffect, useState } from 'react';

export default function OrderListPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);


  // 날짜 포맷 함수
  const formatOrderDate = (datetimeStr) => {
    if (!datetimeStr) return '날짜 없음\n--:--';

    try {
      // "25/06/12 00:53:51.158567000"
      const [datePart, timePartWithMs] = datetimeStr.trim().split(' ');
      const [yy, mm, dd] = datePart.split('/');
      const fullYear = Number(yy) < 50 ? '20' + yy : '19' + yy;

      const [hh, mi] = timePartWithMs.split(':');

      return `${fullYear}.${mm}.${dd}\n${hh}:${mi}`;
    } catch (e) {
      return '파싱 실패\n--:--';
    }
  };


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

        setOrders(
          enhancedOrders.sort((a, b) => {
            const parse = (str) => {
              if (!str) return 0;
              const [datePart, timePartWithMs] = str.trim().split(' ');
              const [yy, mm, dd] = datePart.split('/');
              const fullYear = Number(yy) < 50 ? '20' + yy : '19' + yy;
              const timePart = timePartWithMs.split('.')[0]; // 밀리초 제거
              return new Date(`${fullYear}-${mm}-${dd}T${timePart}`);
            };

            return parse(b.orderDate) - parse(a.orderDate); // 최신 순
          })
        );
      } catch (err) {
        console.error('❗ 주문 불러오기 실패:', err);
      }
    };

    fetchOrdersWithProducts();
  }, [user]);


  if (!user) return <div className="p-6 text-center">로그인 정보를 확인 중입니다...</div>;

  return (
    <>

      {/* 주문내역 테이블 */}
      <main className="flex-1 order-1 md:order-2 ml-0 md:-ml-6">
        <h1 className="text-2xl font-bold mb-6 text-center">🧾 주문 내역</h1>

        {orders.length === 0 ? (
          <div className="p-6 text-center">주문 내역이 없습니다.</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-300 px-2 py-2">날짜</th>
                {/* <th className="border border-gray-300 px-2 py-2">주문번호</th> */}
                <th className="border border-gray-300 px-2 py-2">상품 이미지</th>
                <th className="border border-gray-300 px-2 py-2">상품명</th>
                <th className="border border-gray-300 px-2 py-2">수량</th>
                <th className="border border-gray-300 px-2 py-2">상품 총액</th>
                <th className="border border-gray-300 px-2 py-2">총 결제 금액</th>
                <th className="border border-gray-300 px-2 py-2">상태</th>
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
                        <>
                          <td
                            rowSpan={order.items.length}
                            className="border border-gray-300 px-2 py-2 whitespace-pre-line bg-gray-50"
                          >
                            {formatOrderDate(order.orderDate)}
                          </td>
                          {/* <td
                            rowSpan={order.items.length}
                            className="border border-gray-300 px-2 py-2 font-medium bg-gray-50"
                          >
                            {order.orderId || `#${orderIdx + 1}`}
                          </td> */}
                        </>
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
                          <td
                            rowSpan={order.items.length}
                            className="border border-gray-300 px-2 py-2 font-bold text-black"
                          >
                            {order.totalAmount.toLocaleString()}원
                          </td>
                          <td
                            rowSpan={order.items.length}
                            className="border border-gray-300 px-2 py-2 text-gray-600"
                          >
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="bg-gray-300 text-black px-2 py-1 rounded text-sm mb-2"
                            >
                              배송정보
                            </button>
                            <div>{order.status}</div>
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

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[350px] p-6">
            <h2 className="text-lg font-bold mb-4">📦 배송 정보</h2>
            <ul className="space-y-2 text-sm">
              <li><strong>이름:</strong> {selectedOrder.recipientName || '-'}</li>
              <li><strong>연락처:</strong> {selectedOrder.recipientPhone || '-'}</li>
              <li><strong>주소:</strong> {selectedOrder.address || '-'}</li>
              <li><strong>배송메모:</strong> {selectedOrder.deliveryMemo || '-'}</li>
              <li><strong>송장번호:</strong> {selectedOrder.trackingNumber || '-'}</li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
