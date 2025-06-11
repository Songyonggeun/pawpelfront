'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function CheckoutPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [user, setUser] = useState(null);
  const [detailedItems, setDetailedItems] = useState([]);

  // 배송 정보 상태
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [deliveryMemo, setDeliveryMemo] = useState('');

  const address = address1 + ' ' + address2;

  useEffect(() => {
    const stored = localStorage.getItem('pendingOrder');
    if (!stored) {
      alert('결제할 주문 정보가 없습니다.');
      router.push('/store/cart');
      return;
    }

    const parsed = JSON.parse(stored);
    setOrderData(parsed);

    // 상품 상세 정보 불러오기
    Promise.all(
      parsed.items.map((item) =>
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products/${item.productId}`, {
          credentials: 'include',
        }).then((res) => res.json())
          .then((detail) => ({ ...detail , ...item }))
      )
    ).then(setDetailedItems);
  }, [router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        const data = await res.json();
        setUser(data);
        setRecipientName(data?.name || '');
      } catch (err) {
        console.error('유저 정보 요청 실패:', err);
      }
    };
    fetchUser();
  }, []);

  if (!orderData || detailedItems.length === 0) return <div className="p-6">주문 정보를 불러오는 중...</div>;

  const totalAmount = orderData.totalAmount;
  const deliveryFee = totalAmount < 35000 ? 3000 : 0;
  const finalAmount = totalAmount;

  const orderId = 'order-' + Date.now();
  const orderName =
    detailedItems.length === 1
      ? detailedItems[0].productName
      : `${detailedItems[0].productName} 외 ${detailedItems.length - 1}건`;

  const handlePayment = () => {
    if (!recipientName || !recipientPhone || !address) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }

    const fullOrder = {
      ...orderData,
      recipientName,
      recipientPhone,
      address,
      deliveryMemo,
    };

    localStorage.setItem('pendingOrder', JSON.stringify(fullOrder));

    const tossPayments = window.TossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY);
    tossPayments.requestPayment('카드', {
      orderId,
      orderName,
      amount: finalAmount,
      customerName: user?.name || '비회원',
      successUrl: `http://localhost:3000/store/success?orderId=${orderId}&amount=${finalAmount}`,
      failUrl: 'http://localhost:3000/store/fail',
    });
  };

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const selectedAddress = data.address;
        setAddress1(selectedAddress);
      },
    }).open();
  };

  return (
    <div className="max-w-[700px] mx-auto p-6 space-y-6">
      <Script src="https://js.tosspayments.com/v1/payment" strategy="afterInteractive" />
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />
      <h1 className="text-2xl font-bold mb-4">🧾 주문서 확인</h1>

      {/* 배송 정보 입력 */}
      <div className="space-y-2 border border-gray-200 rounded p-4">
      <h2 className="text-lg font-semibold">📦 배송 정보</h2>
          
        {/* 이름 / 연락처 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="recipientName" className="block mb-1 text-sm font-medium text-gray-700">
              수령인 이름
            </label>
            <input
              id="recipientName"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="border border-gray-400 p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="recipientPhone" className="block mb-1 text-sm font-medium text-gray-700">
              연락처 (숫자만)
            </label>
            <input
              id="recipientPhone"
              type="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="border border-gray-400 p-2 rounded w-full"
            />
          </div>
        </div>

        {/* 주소 + [검색 버튼] */}
        <div>
          <label htmlFor="address1" className="block mb-1 text-sm font-medium text-gray-700">
            주소
          </label>
          <div className="flex gap-4">
            <input
              id="address1"
              type="text"
              value={address1}
              readOnly
              placeholder="주소를 검색하세요"
              className="border border-gray-400 p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={openPostcode}
              className="border p-2 rounded bg-white hover:bg-gray-100"
            >
              주소 검색
            </button>
          </div>
        </div>

        {/* 상세주소 */}
        <div>
          <label htmlFor="address2" className="block mb-1 text-sm font-medium text-gray-700">
            상세 주소 (예: 아파트 동/호수 등)
          </label>
          <input
            id="address2"
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="border border-gray-400 p-2 rounded w-full"
          />
        </div>

        {/* 배송메모 */}
        <div>
          <label htmlFor="deliveryMemo" className="block mb-1 text-sm font-medium text-gray-700">
            배송 요청사항 (선택)
          </label>
          <input
            id="deliveryMemo"
            type="text"
            value={deliveryMemo}
            onChange={(e) => setDeliveryMemo(e.target.value)}
            className="border border-gray-400 p-2 rounded w-full"
          />
        </div>
      </div>

      {/* 상품 목록 */}
      <ul className="space-y-4">
        {detailedItems.map((item, idx) => (
          <li key={idx} className="flex items-center gap-4 border border-gray-200 rounded p-4">
            <div className="flex-1 flex flex-row gap-6">
              <div className="w-32 flex-shrink-0">
                <img
                  src={
                    item.image?.startsWith('/images/')
                      ? item.image
                      : item.image
                      ? `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${item.image}`
                      : '/images/product/default-product.png'
                  }
                  alt={item.productName}
                  className="w-full h-24 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = '/images/product/default-product.png';
                  }}
                />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-gray-800">{item.productName}</h2>
                <p className="text-sm text-gray-500">{item.brand || ''}</p>
                <div className="text-sm text-gray-400">
                  {item.discount && item.originalPrice && (
                    <>
                      <span>{item.discount}%</span>
                      <span className="ml-2 line-through">{item.originalPrice.toLocaleString()}원</span>
                    </>
                  )}
                </div>
                <p className="text-lg font-bold text-black">
                  {item.price.toLocaleString()}원 x {item.quantity}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 가격 정보 */}
      <div className="text-right space-y-1 text-black">
        <div>상품 금액: {(finalAmount - deliveryFee).toLocaleString()}원</div>
        <div>배송비: {deliveryFee.toLocaleString()}원</div>
        <div className="text-lg font-bold">총 결제 금액: {finalAmount.toLocaleString()}원</div>
      </div>

      {/* 결제 버튼 */}
      <div className="text-right">
        <button
          onClick={handlePayment}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          💳 결제하기
        </button>
      </div>
    </div>
  );
}
