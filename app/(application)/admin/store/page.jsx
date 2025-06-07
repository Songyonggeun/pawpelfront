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
      .then(setProducts)
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">상품 관리</h1>

      <div className="mb-4">
        <Link href="/admin/store/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + 상품 등록
        </Link>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">이미지</th>
              <th className="p-3 border">상품명</th>
              <th className="p-3 border">브랜드</th>
              <th className="p-3 border">평점</th>
              <th className="p-3 border">리뷰 수</th>
              <th className="p-3 border">가격</th>
              <th className="p-3 border">원가</th>
              <th className="p-3 border">할인</th>
              <th className="p-3 border">태그</th>
              <th className="p-3 border">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center p-6 text-gray-500">
                  상품이 없습니다.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3 border">{product.id}</td>
                <td className="p-3 border">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                </td>
                <td className="p-3 border">{product.name}</td>
                <td className="p-3 border">{product.brand}</td>
                <td className="p-3 border">{product.rating?.toFixed(1) ?? '-'}</td>
                <td className="p-3 border">{product.reviews ?? 0}</td>
                <td className="p-3 border">{product.price?.toLocaleString()}원</td>
                <td className="p-3 border">{product.originalPrice?.toLocaleString()}원</td>
                <td className="p-3 border">{product.discount}%</td>
                <td className="p-3 border">
                  {(product.tags ?? []).map((tag) => (
                    <span key={tag} className="inline-block bg-gray-100 border text-sm px-2 py-0.5 rounded mr-1">
                      {tag}
                    </span>
                  ))}
                </td>
                <td className="p-3 border space-x-2">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
