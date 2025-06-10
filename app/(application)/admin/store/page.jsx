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
    discount: 0,
    image: '',
    tags: [],
    category: '',
  });

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
    return Math.round(price * (1 - newProduct.discount / 100));
  };

  const handleCreate = async () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.originalPrice || !newProduct.category) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const image = newProduct.image?.trim()
      ? newProduct.image.trim()
      : '/images/default-product.png';

    const tags = tagString.trim()
      ? tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : null;

    let baseProduct = {
      name: newProduct.name,
      brand: newProduct.brand,
      originalPrice: parseInt(newProduct.originalPrice),
      discount: newProduct.discount,
      price: calculatedPrice(),
      tags,
      image,
      category: newProduct.category,
      rating: 0,
      reviews: 0,
    };

    // 수정 시 기존 값을 유지하도록 처리
    if (isEdit) {
      const prev = products.find(p => p.id === editingProductId);
      baseProduct = {
        name: newProduct.name || prev.name,
        brand: newProduct.brand || prev.brand,
        originalPrice: newProduct.originalPrice ? parseInt(newProduct.originalPrice) : prev.originalPrice,
        discount: newProduct.discount ?? prev.discount,
        price: newProduct.originalPrice
          ? Math.round(parseInt(newProduct.originalPrice) * (1 - (newProduct.discount ?? prev.discount) / 100))
          : prev.price,
        tags: tags ?? prev.tags,
        image: image || prev.image,
        category: newProduct.category || prev.category,
        rating: prev.rating,
        reviews: prev.reviews,
      };
    }
  }


  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      brand: product.brand,
      originalPrice: product.originalPrice.toString(),
      discount: product.discount,
      image: product.image,
      tags: product.tags ?? [],
      category: product.category ?? '',
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

      setProducts(products.filter((p) => p.id !== id)); // 목록에서 제거
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
            discount: 0,
            image: '',
            tags: [],
            category: '',
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

        <div className="space-y-3">
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="">카테고리 선택</option>
            <option value="사료">사료</option>
            <option value="간식">간식</option>
            <option value="영양제">영양제</option>
            <option value="용품">용품</option>
          </select>
          <input
            type="text"
            placeholder="브랜드"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="상품명"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="태그"
            value={tagString}
            onChange={(e) => setTagString(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            placeholder="원가"
            value={newProduct.originalPrice}
            onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <select
            value={newProduct.discount}
            onChange={(e) => setNewProduct({ ...newProduct, discount: parseInt(e.target.value) })}
            className="w-full border p-2 rounded"
          >
            {[0, 5, 10, 15, 20, 25, 30, 40, 50].map((val) => (
              <option key={val} value={val}>{val}% 할인</option>
            ))}
          </select>
          <input
            type="text"
            value={`${calculatedPrice()} 원`}
            readOnly
            className="w-full border p-2 rounded bg-gray-100 text-gray-500"
            title="자동 계산된 할인가"
          />
        </div>

        <div className="flex justify-end mt-4 space-x-2">
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
          <th className="px-3 py-2 text-center whitespace-nowrap">태그</th>
          <th className="px-3 py-2 text-center whitespace-nowrap">평점</th>
          <th className="px-3 py-2 text-center whitespace-nowrap">리뷰 수</th>
          <th className="px-3 py-2 text-center whitespace-nowrap">관리</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan="11" className="text-center p-6 text-gray-500">
              상품이 없습니다.
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <tr key={product.id} className="border-t border-gray-200">
              <td className="px-3 py-2 text-center whitespace-nowrap">{product.id}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{product.category}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => { e.currentTarget.src = '/images/default-product.png'; }}
                  />
                </div>
              </td>
              <td className="px-3 py-2 text-center whitespace-nowrap">
                <Link href={`/store/detail/${product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{product.brand}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{product.price?.toLocaleString()}원</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{product.originalPrice?.toLocaleString()}원</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{product.discount}%</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">
                {(product.tags ?? []).map((tag) => (
                  <span key={tag} className="inline-block bg-gray-100 border border-gray-300 text-xs px-2 py-0.5 rounded mr-1">
                    {tag}
                  </span>
                ))}
              </td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{product.rating?.toFixed(1) ?? '-'}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{product.reviews ?? 0}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap space-x-2">
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
  </div>
);

}
