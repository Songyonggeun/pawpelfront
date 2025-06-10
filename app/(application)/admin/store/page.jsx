'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StoreAdminPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/products`, {
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

  const handleDelete = async (id) => {
    const confirmed = window.confirm('정말 이 상품을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/product/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('삭제 실패');
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <h1 className="text-2xl font-bold mb-6">상품 관리</h1>

      <div className="mb-4 flex justify-end">
        <Link href="/admin/store/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + 상품 등록
        </Link>
      </div>

      <table className="w-full text-xs table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-300 border-b border-gray-200">
            <th className="px-3 py-2 text-center whitespace-nowrap">ID</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">이미지</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">상품명</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">브랜드</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">평점</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">리뷰 수</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">가격</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">원가</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">할인</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">태그</th>
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
                <td className="px-3 py-2 text-center whitespace-nowrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => { e.currentTarget.src = '/default-product.png'; }}
                  />
                </td>
                <td className="px-3 py-2 text-center whitespace-nowrap">{product.name}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap">{product.brand}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap">{product.rating?.toFixed(1) ?? '-'}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap">{product.reviews ?? 0}</td>
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
                <td className="px-3 py-2 text-center whitespace-nowrap space-x-2">
                  <Link href={`/admin/store/edit/${product.id}`} className="text-blue-600 hover:underline">
                    수정
                  </Link>
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
