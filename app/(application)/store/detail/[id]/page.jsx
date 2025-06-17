'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import ProductReview from '@/components/(application)/ProductReview';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ⭐ 별점/리뷰 상태 추가
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const checkLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
        credentials: 'include',
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // ⭐ 별점/리뷰 불러오기
  const fetchRatingInfo = async (productId) => {
    try {
      const [ratingRes, summaryRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/reviews/product/${productId}/rating`, {
          credentials: 'include',
        }),
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/reviews/product/${productId}/rating-summary`, {
          credentials: 'include',
        }),
      ]);

      const avgRating = await ratingRes.json();
      const summary = await summaryRes.json();
      console.log('📦 리뷰 요약 응답:', summary); 

      setRating(avgRating || 0);
      setReviewCount(summary.reviewCount || 0);
    } catch (err) {
      console.error('❗ 별점 정보 불러오기 실패:', err);
    }
  };

  // 상품 정보 불러오기
  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products/${id}`, {
      credentials: 'include',
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          setProduct(json);
          fetchRatingInfo(json.id); // ✅ 별점 불러오기
        } catch (err) {
          console.error('❗ JSON 파싱 실패. 응답 내용:', text);
        }
      })
      .catch((err) => {
        console.error(err);
        alert('상품 정보를 불러오는 중 오류가 발생했습니다.');
      });
  }, [id]);

  // 수량 제한
  useEffect(() => {
    if (product && quantity > product.quantity) {
      setQuantity(product.quantity);
    }
  }, [product]);

  const totalPrice = product?.price * quantity;

  const addToCart = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...product,
          quantity,
        }),
      });

      if (!response.ok) throw new Error('장바구니 추가 실패');

      setShowCartModal(true);
    } catch (err) {
      console.error(err);
      alert('장바구니 담기 실패');
    }
  };

  const handleBuyNow = async () => {
    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...product,
          quantity,
        }),
      });

      if (!response.ok) throw new Error('장바구니 추가 실패');

      const orderDto = {
        totalAmount: totalPrice,
        status: '결제대기',
        items: [
          {
            productId: product.id,
            productName: product.name,
            quantity,
            price: product.price,
          },
        ],
      };

      localStorage.setItem('pendingOrder', JSON.stringify(orderDto));
      router.push(`/store/checkout?id=${product.id}`);
    } catch (err) {
      console.error('❗ 바로구매 실패:', err);
      alert('바로구매 중 오류가 발생했습니다.');
    }
  };

  if (!product) return <div className="p-6">로딩 중...</div>;

  return (
    <>
      <Script src="https://js.tosspayments.com/v1/payment" strategy="afterInteractive" />

      {/* 상품 상세 */}
      <div className="max-w-[1100px] mx-auto p-8 flex flex-col lg:flex-row">
        {/* 이미지 */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="border border-gray-200 rounded-lg p-4">
            <img
              src={
                product.image?.startsWith('/images/')
                  ? product.image
                  : product.image
                  ? `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.image}`
                  : '/images/product/default-product.png'
              }
              alt={product.name}
              className="w-[400px] h-[400px] object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src = '/images/product/default-product.png';
              }}
            />
          </div>
        </div>

        {/* 정보 */}
        <div className="w-full lg:w-1/2 space-y-4 pl-4">
          <p className="text-sm text-gray-500">{product.brand}</p>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* 별점 영역 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>⭐ {rating.toFixed(1)}</span>
            <span>({reviewCount})</span>
          </div>

          <div className="text-sm text-gray-400">
            <span>{product.discount}%</span>
            <span className="ml-2 line-through">{product.originalPrice.toLocaleString()}원</span>
          </div>
          <p className="text-2xl font-bold">{product.price.toLocaleString()}원</p>
          <div className="text-sm text-gray-700">배송비 3,000원 (35,000원 이상 무료배송)</div>
          <hr className="my-4" />

          {/* 수량 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">수량</span>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-10 h-8 flex items-center justify-center">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => Math.min(prev + 1, product.quantity))}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500">재고: {product.quantity}개</p>
          </div>

          <div className="text-xl font-bold text-right">총 가격: {totalPrice.toLocaleString()}원</div>
          <div className="flex gap-2 pt-4">
            <button onClick={addToCart} className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm py-2 rounded">
              🛒 장바구니
            </button>
            <button onClick={handleBuyNow} className="flex-1 bg-black hover:bg-gray-800 text-white text-sm py-2 rounded">
              💳 바로구매
            </button>
          </div>
        </div>
      </div>

      {/* 리뷰 */}
      <ProductReview productId={id} />

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white border border-gray-300 shadow-lg rounded-xl px-6 py-5 w-[340px] text-center">
            <p className="text-gray-800 font-semibold mb-5 text-base">로그인이 필요합니다.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                닫기
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
