'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PetStorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("상품 목록 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-[1100px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">베스트 상품</h1>

      <div className="flex gap-3 mb-6 overflow-x-auto">
        {["전체", "영양제", "사료", "간식", "용품"].map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-600"
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md">
              <div className="relative bg-white p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-2 right-2 text-gray-400 text-xl">♡</span>
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">{product.brand}</div>
                <div className="text-sm font-medium text-gray-800 line-clamp-2 h-10 leading-tight mt-1">
                  {product.name}
                </div>
                <div className="text-xs text-yellow-500 mt-1">
                  ⭐
                  <span>{product.rating}</span>
                  <span className="text-xs text-gray-500"> ({product.reviews})</span>
                </div>
                <div className="mt-1">
                  <span className="text-blue-600 font-bold mr-2">{product.discount}%</span>
                  <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString()}원</span>
                </div>
                <div className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
