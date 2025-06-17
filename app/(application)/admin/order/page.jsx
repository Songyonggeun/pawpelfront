'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ORDERS_PER_PAGE = 10;

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const statusPriority = {
    '결제완료': 3,
    '배송중': 2,
    '배송완료': 1,
    '주문취소': 0,
  };

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

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

      const sorted = data.sort((a, b) => {
        const statusDiff = (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
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
        return statusDiff !== 0
          ? statusDiff
          : parseDate(b.orderDate) - parseDate(a.orderDate);
      });

      setOrders(sorted);
    } catch (err) {
      alert('❗ 주문 목록 불러오기 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('정말 취소하시겠습니까?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order/${orderId}/status?status=${encodeURIComponent('주문취소')}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      alert('취소되었습니다.');
      fetchOrders();
    } catch (err) {
      console.error('❗ 취소 실패:', err);
      alert('취소 실패');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-center">로딩 중...</div>;

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 전체 주문 관리</h1>

      {orders.length === 0 ? (
        <div className="p-6 text-center">주문이 없습니다.</div>
      ) : (
        <>
          <table className="w-full text-xs table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-300 border-b border-gray-200 text-center">
                <th className="px-3 py-2 whitespace-nowrap">날짜</th>
                <th className="px-3 py-2 whitespace-nowrap">주문번호</th>
                <th className="px-3 py-2 whitespace-nowrap">상품명</th>
                <th className="px-3 py-2 whitespace-nowrap">수량</th>
                <th className="px-3 py-2 whitespace-nowrap">상품 총액</th>
                <th className="px-3 py-2 whitespace-nowrap">총 결제 금액</th>
                <th className="px-3 py-2 whitespace-nowrap">결제 상태</th>
                <th className="px-3 py-2 whitespace-nowrap">배송 정보</th>
                <th className="px-3 py-2 whitespace-nowrap">관리</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, orderIdx) =>
                order.items.map((item, itemIdx) => (
                  <tr key={`${order.id}-${itemIdx}`} className="border-t border-gray-200 text-center">
                    {itemIdx === 0 && (
                      <>
                        <td rowSpan={order.items.length} className="px-3 py-2 whitespace-pre-line bg-gray-50">
                          {formatOrderDate(order.orderDate)}
                        </td>
                        <td rowSpan={order.items.length} className="px-3 py-2 font-medium bg-gray-50">
                          #{order.id}
                        </td>
                      </>
                    )}
                    <td className={order.status === '주문취소' ? 'px-3 py-2 line-through text-gray-400' : 'px-3 py-2'}>
                      <Link href={`/store/detail/${item.productId}`}>
                        {item.productName}
                      </Link>
                    </td>
                    <td className={order.status === '주문취소' ? 'px-3 py-2 line-through text-gray-400' : 'px-3 py-2'}>
                      {item.quantity}
                    </td>
                    <td className={order.status === '주문취소' ? 'px-3 py-2 line-through text-gray-400' : 'px-3 py-2'}>
                      {(item.quantity * item.price).toLocaleString()}원
                    </td>
                    {itemIdx === 0 && (
                      <>
                        <td rowSpan={order.items.length} className={`px-3 py-2 whitespace-pre-line ${order.status === '주문취소' ? 'line-through text-gray-400' : ''}`}>
                          {(order.totalAmount + (order.totalAmount <= 35000 ? 3000 : 0)).toLocaleString()}원
                          {order.totalAmount <= 35000 && (
                            <div className="text-[11px] text-gray-500 mt-1">(배송비 3,000원 포함)</div>
                          )}
                        </td>
                        <td rowSpan={order.items.length} className="px-3 py-2 text-gray-600">
                          {order.status}
                        </td>
                        <td rowSpan={order.items.length} className="px-3 py-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-block bg-gray-100 border border-gray-300 text-xs px-2 py-0.5 rounded mr-1"
                          >
                            배송정보
                          </button>
                        </td>
                        <td rowSpan={order.items.length} className="px-3 py-2 text-center whitespace-nowrap space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrderForEdit(order);
                              setNewStatus(order.status);
                              setTrackingNumber(order.trackingNumber || '');
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:underline"
                          >
                            취소
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="mt-6 flex justify-center items-center space-x-2 text-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </>
      )}

      {/* 배송 정보 모달 */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
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

      {/* 상태 수정 모달 */}
      {selectedOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
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
