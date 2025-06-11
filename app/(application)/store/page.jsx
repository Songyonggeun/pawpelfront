'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PetStorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "영양제", "사료", "간식", "용품"];

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

  // 현재 선택된 카테고리에 따른 필터링
  const filteredProducts = selectedCategory === "전체"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="p-4 md:p-8 max-w-[1100px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">전체 상품</h1>

      {/* 카테고리 탭 */}
      <div className="flex gap-3 mb-6 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium 
              ${selectedCategory === cat 
                ? "bg-blue-100 text-blue-600" 
                : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md">
              <div className="relative bg-white p-4">
                <Link href={`/store/detail/${product.id}`}>
                <img
                  src={
                    product.image?.startsWith('/images/')
                      ? product.image // 정적 이미지 (public 폴더)
                      : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.image}` // 업로드 이미지
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onError={(e) => {
                    e.currentTarget.src = '/images/product/default-product.png';
                  }}
                />
                </Link>
                <span className="absolute top-2 right-2 text-gray-400 text-xl">♡</span>
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">{product.brand}</div>
                <Link href={`/store/detail/${product.id}`}>
                  <div className="text-sm font-medium text-gray-800 line-clamp-2 h-10 leading-tight mt-1 hover:underline cursor-pointer">
                    {product.name}
                  </div>
                </Link>
                <div className="text-xs text-yellow-500 mt-1">
                  ⭐
                  <span>{product.rating}</span>
                  <span className="text-xs text-gray-500"> ({product.reviews})</span>
                </div>
                <div className="mt-1">
                  <span className="text-blue-600 font-bold mr-2">{product.discount}%</span>
                  <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString()}원</span>
                </div>
                <div className="text-xs text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()}원
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
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

      <div className="mx-auto mt-6 w-[200px] h-[100px] bg-transparent" />
    </div>
  );
}
