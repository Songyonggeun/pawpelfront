import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "액티베이트 스몰 60p (종합 영양제)",
    brand: "벳플러스",
    rating: 4.9,
    reviews: 224,
    discount: 17,
    price: 64900,
    originalPrice: 78000,
    tags: ["무료배송", "BEST", "특가"],
    image: "/images/aktivait.jpg",
  },
  {
    id: 2,
    name: "프리미엄 비프(소 단일) (100gx10팩)",
    brand: "바프독",
    rating: 5,
    reviews: 3,
    discount: 4,
    price: 54900,
    originalPrice: 57000,
    tags: [ "BEST"],
    image: "/images/synoquin.jpg",
  },
  {
    id: 3,
    name: "미니파이케어 라이스(신장관리) 10개입",
    brand: "닥터맘마",
    rating: 4.9,
    reviews: 22,
    discount: 12,
    price: 11900,
    originalPrice: 13500,
    tags: ["당일배송", "BEST"],
    image: "/images/samylin.jpg",
  },
  {
    id: 4,
    name: "댕댕카솔 진정크림(연두)",
    brand: "헬로마이펫",
    rating: 4.7,
    reviews: 6,
    discount: 29,
    price: 28000,
    originalPrice: 39000,
    tags: ["당일발송","BEST"],
    image: "/images/zylkene.jpg",
  },
];

export default function PetStorePage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
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
                ⭐ {product.rating} 리뷰 {product.reviews}
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
    </div>
  );
}
