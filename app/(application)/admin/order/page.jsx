'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [editingStatus, setEditingStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const statusPriority = {
    '결제완료': 3,
    '배송중': 2,
    '배송완료': 1,
  };

  const formatOrderDate = (datetimeStr) => {
    if (!datetimeStr) return '날짜 없음\n--:--';
    try {
      const [datePart, timePartWithMs] = datetimeStr.trim().split(' ');
      const [yy, mm, dd] = datePart.split('/');
      const fullYear = Number(yy) < 50 ? '20' + yy : '19' + yy;
      const [hh, mi] = timePartWithMs.split(':');
      return `${fullYear}.${mm}.${dd}\n${hh}:${mi}`;
    } catch (e) {
      return '파싱 실패\n--:--';
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order/all`, {
        credentials: 'include',
      });
      const data = await res.json();

      // 상태 우선순위 정의
      const statusPriority = {
        '결제완료': 3,
        '배송중': 2,
        '배송완료': 1,
      };

      // 날짜 파서
      const parseDate = (datetimeStr) => {
        if (!datetimeStr) return 0;
        try {
          const [datePart, timePartWithMs] = datetimeStr.trim().split(' ');
          const [yy, mm, dd] = datePart.split('/');
          const fullYear = Number(yy) < 50 ? '20' + yy : '19' + yy;
          const timePart = timePartWithMs.split('.')[0];
          return new Date(`${fullYear}-${mm}-${dd}T${timePart}`);
        } catch (e) {
          return 0;
        }
      };

      // 정렬 적용
      const sorted = data.sort((a, b) => {
        const statusDiff = (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
        if (statusDiff !== 0) return statusDiff;
        return parseDate(b.orderDate) - parseDate(a.orderDate); // 최신순
      });

      setOrders(sorted);
    } catch (err) {
      alert('❗ 주문 목록 불러오기 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    const newStatus = editingStatus[orderId];
    if (!newStatus) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order/${orderId}/status?status=${encodeURIComponent(newStatus)}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );
      alert('상태가 수정되었습니다.');
      fetchOrders();
    } catch (err) {
      console.error('❗ 상태 수정 실패:', err);
      alert('상태 수정 실패');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      alert('삭제되었습니다.');
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error('❗ 삭제 실패:', err);
      alert('삭제 실패');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-center">로딩 중...</div>;

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 전체 주문 관리</h1>

      {orders.length === 0 ? (
        <div className="p-6 text-center">주문이 없습니다.</div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-gray-300 px-2 py-2">날짜</th>
              <th className="border border-gray-300 px-2 py-2">주문번호</th>
              <th className="border border-gray-300 px-2 py-2">상품명</th>
              <th className="border border-gray-300 px-2 py-2">수량</th>
              <th className="border border-gray-300 px-2 py-2">상품 총액</th>
              <th className="border border-gray-300 px-2 py-2">총 결제 금액</th>
              <th className="border border-gray-300 px-2 py-2">결제 상태</th>
              <th className="border border-gray-300 px-2 py-2">배송 정보</th>
              <th className="border border-gray-300 px-2 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, orderIdx) =>
              order.items.map((item, itemIdx) => {
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
                        <td
                          rowSpan={order.items.length}
                          className="border border-gray-300 px-2 py-2 font-medium bg-gray-50"
                        >
                          #{order.id}
                        </td>
                      </>
                    )}

                    <td className="border border-gray-300 px-2 py-2 text-blue-600 hover:underline">
                      <Link href={`/store/detail/${item.productId}`}>
                        {item.productName}
                      </Link>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">{item.quantity}</td>
                    <td className="border border-gray-300 px-2 py-2">
                      {(item.quantity * item.price).toLocaleString()}원
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
                          {order.status}
                        </td>
                        <td
                          rowSpan={order.items.length}
                          className="border border-gray-300 px-2 py-2"
                        >
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
                          >
                            배송정보
                          </button>
                        </td>
                        <td
                          rowSpan={order.items.length}
                          className="border border-gray-300 px-2 py-2"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <button
                              onClick={() => {
                                setSelectedOrderForEdit(order);
                                setNewStatus(order.status); // 초기 상태 설정
                              }}
                              className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
                            >
                              삭제
                            </button>
                          </div>
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

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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

      {selectedOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-[350px] p-6">
            <h2 className="text-lg font-bold mb-4">🚚 상태 수정</h2>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">배송 상태</label>
              <select
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  if (e.target.value !== '배송중') setTrackingNumber('');
                }}
                className="w-full border px-3 py-2 rounded text-sm"
              >
                <option value="결제완료">결제완료</option>
                <option value="배송중">배송중</option>
                <option value="배송완료">배송완료</option>
              </select>
            </div>

            {newStatus === '배송중' && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">송장번호</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="송장번호 입력"
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
            )}

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setSelectedOrderForEdit(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  try {
                    await fetch(
                      `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order/${selectedOrderForEdit.id}/status?status=${encodeURIComponent(newStatus)}&trackingNumber=${encodeURIComponent(trackingNumber)}`,
                      {
                        method: 'PATCH',
                        credentials: 'include',
                      }
                    );
                    alert('상태가 수정되었습니다.');
                    setSelectedOrderForEdit(null);
                    fetchOrders();
                  } catch (err) {
                    console.error('❗ 상태 수정 실패:', err);
                    alert('상태 수정 실패');
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
