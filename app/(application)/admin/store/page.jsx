'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StoreAdminPage() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [tagString, setTagString] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    originalPrice: '',
    discount: '',
    image: null,
    tags: [],
    category: '',
    quantity: '',
  });

  // 화면 너비 감지 상태 추가
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('상품 데이터를 불러오는데 실패했습니다.');
        return res.json();
      })
      .then(data => {
        const sorted = Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [];
        setProducts(sorted);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const calculatedPrice = () => {
    const price = parseInt(newProduct.originalPrice || '0', 10);
    const discountRate = parseFloat(newProduct.discount);
    if (isNaN(discountRate)) return price;
    const discounted = price * (1 - discountRate / 100);
    return Math.floor(discounted / 100) * 100;
  };

  const handleCreate = async () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.originalPrice || !newProduct.category) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const tags = tagString.trim()
      ? tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : null;

    const baseProduct = {
      name: newProduct.name,
      brand: newProduct.brand,
      originalPrice: parseInt(newProduct.originalPrice, 10),
      discount: newProduct.discount === '' ? null : parseInt(newProduct.discount, 10),
      price: calculatedPrice(),
      tags,
      category: newProduct.category,
      quantity: isNaN(parseInt(newProduct.quantity)) ? 0 : parseInt(newProduct.quantity, 10),
      rating: 0,
      reviews: 0,
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(baseProduct)], { type: "application/json" }));
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products${isEdit ? `/${editingProductId}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      if (!res.ok) throw new Error('저장 실패');

      const saved = await res.json();
      if (isEdit) {
        setProducts(products.map(p => p.id === editingProductId ? saved : p));
      } else {
        setProducts([saved, ...products]);
      }

      setShowModal(false);
      alert('저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      brand: product.brand,
      originalPrice: product.originalPrice.toString(),
      discount: product.discount,
      image: product.image,
      tags: product.tags ?? [],
      category: product.category ?? '',
      quantity: product.quantity?.toString() ?? '',
    });
    setTagString((product.tags ?? []).join(','));
    setEditingProductId(product.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('정말 이 상품을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('삭제 실패');

      setProducts(products.filter((p) => p.id !== id));
      alert('상품이 삭제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('상품 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <button
          onClick={() => {
            setNewProduct({
              name: '',
              brand: '',
              originalPrice: '',
              discount: '',
              image: null,
              tags: [],
              category: '',
              quantity: '',
            });
            setIsEdit(false);
            setEditingProductId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          상품 추가
        </button>
      </div>

      {showModal && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg rounded p-6 w-[90%] max-w-md">
          <h2 className="text-lg font-bold mb-4">{isEdit ? '상품 수정' : '상품 추가'}</h2>

          <div className="space-y-4">
            {/* 카테고리 */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium">카테고리</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded"
              >
                <option value="">카테고리 선택</option>
                <option value="사료">사료</option>
                <option value="간식">간식</option>
                <option value="영양제">영양제</option>
                <option value="용품">용품</option>
              </select>
            </div>

            {/* 브랜드 */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium">브랜드</label>
              <input
                type="text"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>

            {/* 상품명 */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium">상품명</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>

            {/* 태그 */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium">태그</label>
              <input
                type="text"
                value={tagString}
                onChange={(e) => setTagString(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
                placeholder="쉼표로 구분"
              />
            </div>

            {/* 원가 */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium">원가(원)</label>
              <input
                type="number"
                value={newProduct.originalPrice}
                onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded"
                placeholder="예: 10000"
              />
            </div>

            {/* 할인율 */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium">할인율(%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={newProduct.discount}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, discount: e.target.value })
                }
                className="flex-1 p-2 border border-gray-300 rounded"
                placeholder="예: 10"
              />
            </div>

            {/* 할인가 */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium">할인가(원)</label>
              <input
                type="text"
                value={`${calculatedPrice()} 원`}
                readOnly
                className="flex-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-500"
              />
            </div>

            {/* 개수 */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium">개수</label>
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>

            {/* 이미지 파일 업로드 */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium">이미지</label>
              <div className="flex-1">
                <label
                  htmlFor="productImageUpload"
                  className="w-full block p-2 border border-gray-300 rounded cursor-pointer text-gray-700 bg-white hover:bg-gray-100"
                >
                  {newProduct.image?.name || '이미지 선택'}
                </label>
                <input
                  id="productImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files?.[0] || null })
                  }
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end mt-6 space-x-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              저장
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {isMobile ? (
        // 모바일: 카드 형식
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-center p-6 text-gray-500">상품이 없습니다.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="border rounded p-4 shadow-sm bg-white"
              >
                <div className="flex space-x-4">
                  <img
                    src={
                      product.image?.startsWith('/images/product/')
                        ? product.image
                        : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.image}`
                    }
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/images/product/default-product.png';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.brand} | {product.category}</p>
                    <p className="text-sm">
                      가격: {product.price?.toLocaleString()}원 (원가: {product.originalPrice?.toLocaleString()}원, 할인: {product.discount}%)
                    </p>
                    <p className="text-sm">개수: {product.quantity ?? 0}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(product.tags ?? []).map(tag => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 border border-gray-300 text-xs px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm mt-1">평점: {product.rating?.toFixed(1) ?? '-'} | 리뷰: {product.reviews ?? 0}</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-4 justify-end">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // 데스크탑: 기존 테이블 형식
        <table className="w-full text-xs table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-300 border-b border-gray-200">
              <th className="px-3 py-2 text-center whitespace-nowrap">ID</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">카테고리</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">이미지</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">상품명</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">브랜드</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">가격</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">원가</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">할인</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">개수</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">태그</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">평점</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">리뷰 수</th>
              <th className="px-3 py-2 text-center whitespace-nowrap">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center p-4 text-gray-500">
                  상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="even:bg-gray-100">
                  <td className="border border-gray-300 text-center">{product.id}</td>
                  <td className="border border-gray-300 text-center">{product.category}</td>
                  <td className="border border-gray-300 text-center p-1">
                    <img
                      src={
                        product.image?.startsWith('/images/product/')
                          ? product.image
                          : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.image}`
                      }
                      alt={product.name}
                      className="w-12 h-12 object-cover mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = '/images/product/default-product.png';
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 text-center">{product.name}</td>
                  <td className="border border-gray-300 text-center">{product.brand}</td>
                  <td className="border border-gray-300 text-center">
                    {product.price?.toLocaleString()}원
                  </td>
                  <td className="border border-gray-300 text-center">
                    {product.originalPrice?.toLocaleString()}원
                  </td>
                  <td className="border border-gray-300 text-center">
                    {product.discount ?? '-'}%
                  </td>
                  <td className="border border-gray-300 text-center">{product.quantity ?? 0}</td>
                  <td className="border border-gray-300 text-center whitespace-normal">
                    {(product.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block border border-gray-400 rounded px-1 mr-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="border border-gray-300 text-center">
                    {product.rating?.toFixed(1) ?? '-'}
                  </td>
                  <td className="border border-gray-300 text-center">{product.reviews ?? 0}</td>
                  <td className="border border-gray-300 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:underline"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
