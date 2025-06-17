'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PetStorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");

  // 별점/리뷰 정보를 상품ID 별로 저장
  const [productRatings, setProductRatings] = useState({});

  const categories = ["전체", "영양제", "사료", "간식", "용품"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/products`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 상품 목록이 바뀔 때마다 별점/리뷰 정보를 다시 가져오기
  useEffect(() => {
    if (products.length === 0) return;

    const fetchRatingsForProducts = async () => {
      const ratingsMap = {};
      await Promise.all(
        products.map(async (product) => {
          try {
            const [ratingRes, summaryRes] = await Promise.all([
              fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/reviews/product/${product.id}/rating`, {
                credentials: "include",
              }),
              fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/reviews/product/${product.id}/rating-summary`, {
                credentials: "include",
              }),
            ]);
            const avgRating = await ratingRes.json();
            const summary = await summaryRes.json();
            ratingsMap[product.id] = {
              rating: avgRating || 0,
              reviews: summary.reviewCount || 0,
            };
          } catch (err) {
            ratingsMap[product.id] = { rating: 0, reviews: 0 };
          }
        })
      );

      setProductRatings(ratingsMap);
    };

    fetchRatingsForProducts();
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "전체" || product.category === selectedCategory;

    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(lowerSearch) ||
      product.brand.toLowerCase().includes(lowerSearch) ||
      (Array.isArray(product.tags) &&
        product.tags.some((tag) =>
          tag.toLowerCase().includes(lowerSearch)
        ));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 max-w-[1100px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">전체 상품</h1>

      {/* 카테고리 탭 */}
      <div className="flex gap-3 mb-6 items-center flex-wrap justify-between">
        <div className="flex gap-2 overflow-x-auto">
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
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm w-[200px]"
        />
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
                      product.image?.startsWith("/images/")
                        ? product.image
                        : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.image}`
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = "/images/product/default-product.png";
                    }}
                  />
                </Link>
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">{product.brand}</div>
                <Link href={`/store/detail/${product.id}`}>
                  <div className="text-sm font-medium text-gray-800 line-clamp-2 h-10 leading-tight mt-1 hover:underline cursor-pointer">
                    {product.name}
                  </div>
                </Link>

                {/* 별점/리뷰 표시 */}
                <div className="text-xs text-yellow-500 mt-1">
                  ⭐ {productRatings[product.id]?.rating?.toFixed(1) ?? "0.0"}
                  <span className="text-xs text-gray-500"> ({productRatings[product.id]?.reviews ?? 0})</span>
                </div>

                <div className="mt-1">
                  <span className="text-blue-600 font-bold mr-2">{product.discount}%</span>
                  <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString()}원</span>
                </div>
                <div className="text-xs text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()}원
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {Array.isArray(product.tags) &&
                    product.tags.map((tag) => (
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
