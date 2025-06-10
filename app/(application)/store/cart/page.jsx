'use client';

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products/cart`, {
        credentials: 'include',
      });
      const data = await res.json();
      setCart(data);
      setSelectedItems(new Set(data.map(item => item.id))); // 디폴트 전체 선택
    } catch (err) {
      console.error("장바구니 불러오기 실패:", err);
      alert("장바구니 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map(item => item.id)));
    }
  };

  const toggleItem = (id) => {
    const newSet = new Set(selectedItems);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedItems(newSet);
  };

  const removeItem = async (productId) => {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products/cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCart(prev => prev.filter(item => item.id !== productId));
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        throw new Error("삭제 실패");
      }
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const removeSelectedItems = () => {
    selectedItems.forEach(id => removeItem(id));
  };

  const totalProductPrice = cart.reduce((acc, item) =>
    selectedItems.has(item.id) ? acc + item.price * item.quantity : acc, 0
  );
  const deliveryFee = totalProductPrice < 35000 && totalProductPrice > 0 ? 3000 : 0;
  const totalPrice = totalProductPrice + deliveryFee;

  const updateQuantity = (id, newQty) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  if (cart.length === 0) {
    return <div className="p-6 text-center text-gray-500">장바구니에 담긴 상품이 없습니다.</div>;
  }

  return (
    <div className="max-w-[1000px] mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">🛒 장바구니</h1>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          <button onClick={toggleSelectAll}>
            {selectedItems.size === cart.length ? "전체 해제" : "전체 선택"}
          </button>
        </div>
        <div className="space-x-4">
          <span className="cursor-pointer" onClick={() => {
            if (confirm("정말 전체 삭제하시겠습니까?")) {
              cart.forEach(item => removeItem(item.id));
            }
          }}>전체 삭제</span>
          <span className="cursor-pointer" onClick={() => {
            if (confirm("선택한 항목을 삭제하시겠습니까?")) {
              removeSelectedItems();
            }
          }}>선택항목 삭제</span>
        </div>
      </div>

    <ul className="space-y-4">
        {cart.map(item => (
            <li key={item.id} className="flex items-center gap-4 border border-gray-200 rounded p-4">
            <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => toggleItem(item.id)}
                className="w-4 h-4"
            />
            <div className="flex-1 flex flex-row gap-6">
            {/* 이미지 + 상품정보 */}
            <div className="w-32 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded" />
            </div>

            {/* 상품명, 브랜드, 가격 */}
            <div className="flex-1">
                <h2 className="font-medium text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.brand}</p>
                <div className="text-sm text-gray-400">
                    <span>{item.discount}%</span>
                    <span className="ml-2 line-through">
                        {item.originalPrice.toLocaleString()}원
                    </span>
                </div>

                <p className="text-lg font-bold text-black">
                    {item.price.toLocaleString()}원
                </p>
            </div>

            {/* 수량 조절 */}
            <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            {/* 주문/삭제 버튼 */}
            <div className="flex flex-col items-end justify-center gap-1 self-center">
                <button className="text-sm bg-gray-100 text-black px-3 py-1 rounded hover:bg-gray-300">
                    주문하기
                </button>
                <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm bg-gray-100 text-black px-3 py-1 rounded hover:bg-gray-300"
                >
                    삭제하기
                </button>
            </div>
        </div>
        </li>
    ))}
    </ul>

      {deliveryFee > 0 && (
        <div className="text-sm text-gray-500 text-right">
          35,000원 미만 구매 시 배송비 3,000원이 추가됩니다.
        </div>
      )}

      <div className="text-right text-black space-y-1 text-m">
        <div>상품 금액: {totalProductPrice.toLocaleString()}원</div>
        <div>배송비: {deliveryFee.toLocaleString()}원</div>
        <div className="text-lg font-bold">총 결제 금액: {totalPrice.toLocaleString()}원</div>
      </div>

      <div className="text-right">
        <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          💳 결제하기
        </button>
      </div>
    </div>
  );
}
