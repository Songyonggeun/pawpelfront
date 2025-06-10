'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
        } catch (err) {
          console.error('❗ JSON 파싱 실패. 응답 내용:', text);
          throw new Error('JSON 파싱 실패');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('상품 정보를 불러오는 중 오류가 발생했습니다.');
      });
  }, [id]);

  useEffect(() => {
    if (product && quantity > product.quantity) {
      setQuantity(product.quantity);
    }
  }, [product]);

  if (!product) return <div className="p-6">로딩 중...</div>;

  const totalPrice = product.price * quantity; 

  return (
    <div className="max-w-[1100px] mx-auto p-8 flex flex-col lg:flex-row">
      {/* 이미지 영역 */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <div className="border border-gray-200 rounded-lg p-4">
          <img
            src={product.image || '/images/default-product.png'}
            alt={product.name}
            className="w-[400px] h-[400px] object-cover rounded-md"
          />
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="w-full lg:w-1/2 space-y-4 pl-4">
        <p className="text-sm text-gray-500">{product.brand}</p>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>⭐ {product.rating || 0}</span>
          <span className="text-gray-600">({product.reviews || 0})</span>
        </div>

        <div className="text-sm text-gray-400">
          <span>{product.discount}%</span>
          <span className="ml-2 line-through">
            {product.originalPrice.toLocaleString()}원
          </span>
        </div>

        <p className="text-2xl font-bold text-black">
          {product.price.toLocaleString()}원
        </p>

        <div className="text-sm text-gray-700">
          배송비 3,000원 (35,000원 이상 무료배송)
        </div>

        {/* 회색 선 */}
        <hr className="border-t border-gray-200 my-4" />

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
            <p className="text-xs text-gray-500">
              재고: {product.quantity}개
            </p>
        </div>


        {/* 총 가격 */}
        <div className="text-xl font-bold text-right text-black">
          총 가격: {totalPrice.toLocaleString()}원
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2 pt-4">
          <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm py-2 rounded">
            🛒 장바구니
          </button>
          <button className="flex-1 bg-black hover:bg-gray-800 text-white text-sm py-2 rounded">
            💳 바로구매
          </button>
        </div>
      </div>
    </div>
  );
}
