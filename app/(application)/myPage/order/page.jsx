'use client';

import { useEffect, useState } from 'react';

export default function OrderListPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientPhone, setNewRecipientPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

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


  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [reviewContent, setReviewContent] = useState('');

const handleSubmitReview = async () => {
  if (!reviewContent.trim()) {
    alert('후기를 입력해주세요.');
    return;
  }

  try {
    await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/review`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        orderId: selectedOrderForReview.id,
        content: reviewContent,
      }),
    });
    alert('후기가 등록되었습니다!');
    setSelectedOrderForReview(null);
    setReviewContent('');
  } catch (err) {
    console.error('❗ 후기 등록 실패:', err);
    alert('후기 등록에 실패했습니다.');
  }
};


useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSelectedOrderDetail(null);
      setSelectedOrderForEdit(null);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [selectedOrderDetail, selectedOrderForEdit]);



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
              const timePart = timePartWithMs.split('.')[0];
              return new Date(`${fullYear}-${mm}-${dd}T${timePart}`);
            };
            return parse(b.orderDate) - parse(a.orderDate);
          })
        );
      } catch (err) {
        console.error('❗ 주문 불러오기 실패:', err);
      }
    };

    fetchOrdersWithProducts();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!confirm('정말 주문을 취소하시겠습니까?')) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order/${orderId}/status?status=${encodeURIComponent('주문취소')}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      alert('주문이 취소되었습니다.');
      location.reload();
    } catch (err) {
      console.error('❗ 주문 취소 실패:', err);
      alert('주문 취소 실패');
    }
  };

  useEffect(() => {
    if (selectedOrderForEdit) {
      setNewRecipientName(selectedOrderForEdit.recipientName);
      setNewRecipientPhone(selectedOrderForEdit.recipientPhone);
      setNewAddress(selectedOrderForEdit.address);
    }
  }, [selectedOrderForEdit]);

  const handleAddressUpdate = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/order/${selectedOrderForEdit.id}/delivery`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientName: newRecipientName,
          recipientPhone: newRecipientPhone,
          address: newAddress,
        }),
      });
      alert('배송 정보가 수정되었습니다.');
      setSelectedOrderForEdit(null);
      location.reload();
    } catch (err) {
      console.error('❗ 배송지 수정 실패:', err);
      alert('배송지 수정 실패');
    }
  };

  if (!user) return <div className="p-6 text-center">로그인 정보를 확인 중입니다...</div>;

  return (
    <>
      <main className="flex-1 order-1 md:order-2 ml-0 md:-ml-6">
        <h1 className="text-2xl font-bold mb-6 text-center">🧾 주문 내역</h1>

        {orders.length === 0 ? (
          <div className="p-6 text-center">주문 내역이 없습니다.</div>
        ) : (
          <table className="w-full text-center mt-2 border-t border-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-base text-gray-600 bg-gray-50">
                <th className="py-2">날짜</th>
                <th className="py-2">상품 이미지</th>
                <th className="py-2">상품명</th>
                <th className="py-2">수량</th>
                <th className="py-2">총 결제 금액</th>
                <th className="py-2">상태</th>
                <th className="py-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, orderIdx) =>
                order.items.map((item, itemIdx) => {
                  const product = item.product;
                  const imageUrl = product?.image?.startsWith('/images/')
                    ? product.image
                    : product?.image
                    ? `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.image}`
                    : '/images/product/default-product.png';

                  const deliveryFee = order.totalAmount <= 35000 ? 3000 : 0;

                  return (
                    <tr key={`${orderIdx}-${itemIdx}`} className="border-b border-gray-300 hover:bg-gray-100 text-sm">
                      {itemIdx === 0 && (
                        <td rowSpan={order.items.length} className="py-2 whitespace-pre-line bg-gray-50">
                          {formatOrderDate(order.orderDate)}
                        </td>
                      )}
                      <td className="py-2">
                        <img
                          src={imageUrl}
                          alt={product?.name || '상품'}
                          className="w-16 h-16 object-cover mx-auto rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/images/product/default-product.png';
                          }}
                        />
                      </td>
                      <td className="py-2">
                        <div>{product?.name || item.productName}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.price.toLocaleString()}원
                        </div>
                      </td>
                      <td className="py-2">{item.quantity}</td>
                      {itemIdx === 0 && (
                        <>
                          <td rowSpan={order.items.length} className="py-2 font-bold text-black">
                            {order.totalAmount.toLocaleString()}원
                            <button
                              onClick={() => setSelectedOrderDetail(order)}
                              className="block text-xs text-blue-600 underline mt-1 mx-auto"
                            >
                              상세보기
                            </button>
                          </td>
                          <td rowSpan={order.items.length} className="py-2 text-gray-600">
                            {order.status}
                          </td>
                          <td rowSpan={order.items.length} className="py-2 text-center align-middle">
                            {order.status === '결제완료' ? (
                              <div className="flex flex-col justify-center items-center h-full space-y-2">
                                <button
                                  onClick={() => setSelectedOrderForEdit(order)}
                                  className="inline-block bg-gray-100 border border-gray-300 text-xs px-2 py-0.5 rounded"
                                >
                                  배송지수정
                                </button>
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="inline-block bg-gray-100 border border-gray-300 text-xs px-2 py-0.5 rounded"
                                >
                                  주문취소
                                </button>
                              </div>
                            ) : order.status === '배송완료' ? (
                              <button
                                onClick={() => {
                                  setSelectedOrderForReview(order);
                                  setReviewContent('');
                                }}
                                className="inline-block bg-gary-300 border border-gray-300 text-xs px-2 py-0.5 rounded"
                              >
                                후기작성
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
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

      {/* 배송지 수정 모달 */}
      {selectedOrderForEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
          onClick={() => setSelectedOrderForEdit(null)} // 배경 클릭 시 닫기
        >
          <div
            className="bg-white rounded-lg shadow-lg w-[350px] p-6"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 방지
          >
        <h2 className="text-lg font-bold mb-4">✏️ 배송지</h2>
            <div className="space-y-2 text-sm">
              <div>
                <label className="block mb-1">이름</label>
                <input
                  type="text"
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">전화번호</label>
                <input
                  type="text"
                  value={newRecipientPhone}
                  onChange={(e) => setNewRecipientPhone(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">주소</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleAddressUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                저장
              </button>
              <button
                onClick={() => setSelectedOrderForEdit(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상세보기 모달 */}
{selectedOrderDetail && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
    onClick={() => setSelectedOrderDetail(null)} // 배경 클릭 시 닫기
  >
    <div
      className="bg-white rounded-lg shadow-lg w-[400px] max-h-[90vh] overflow-y-auto p-6"
      onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 방지
    >
      <h2 className="text-lg font-bold mb-4">💰 결제 상세 정보</h2>

      <div className="space-y-3 text-sm">
        {selectedOrderDetail.items.map((item, idx) => {
          const productName = item.product?.name || item.productName;
          const itemTotal = item.price * item.quantity;
          return (
            <div key={idx} className="flex justify-between border-b pb-1">
              <div>
                <div className="font-medium">{productName}</div>
                <div className="text-xs text-gray-500">
                  {item.price.toLocaleString()}원 × {item.quantity}개
                </div>
              </div>
              <div className="text-right font-semibold">
                {itemTotal.toLocaleString()}원
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t mt-4 pt-4 text-sm space-y-1">
        <div className="flex justify-between font-semibold">
          <span>상품 총액</span>
          <span>
            {selectedOrderDetail.items
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toLocaleString()}
            원
          </span>
        </div>
        <div className="flex justify-between">
          <span>배송비</span>
          <span>
            {selectedOrderDetail.totalAmount <= 35000 ? '3,000원' : '배송비 무료'}
          </span>
        </div>
        <div className="flex justify-between font-bold text-base mt-2">
          <span>총 결제 금액</span>
          <span>{selectedOrderDetail.totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      <button
        onClick={() => setSelectedOrderDetail(null)}
        className="px-4 py-2 bg-blue-500 text-white rounded w-full mt-6"
      >
        닫기
      </button>
    </div>
  </div>
)}

{/* 후기 작성 모달  */}
{selectedOrderForReview && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
    onClick={() => setSelectedOrderForReview(null)}
  >
    <div
      className="bg-white rounded-lg shadow-lg w-[400px] p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-bold mb-4">📝 후기 작성</h2>
      <textarea
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
        rows={5}
        className="w-full border rounded p-2 text-sm"
        placeholder="상품에 대한 후기를 작성해주세요."
      />
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setSelectedOrderForReview(null)}
          className="px-4 py-2 bg-gray-300 text-black rounded"
        >
          취소
        </button>
        <button
          onClick={handleSubmitReview}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          등록
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}
