import React from "react";
import PetInsuranceBanner from "@/components/(Inputs)/advertisement";

const menuItems = [
    { label: "맞춤 체크", color: "#1e3a8a" },
    { label: "검진 가이드", color: "#15803d" },
    { label: "수의사 상담", color: "#b91c1c" },
];

export default function LifetCommunityUI() {
    return (

        <div>
            <PetInsuranceBanner />
            {/* 상단 메뉴 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", margin: "1.5rem 0" }}>
                            {/* 기능 아이콘 영역 */}
            <div className="grid grid-cols-3 gap-6 text-center">
                <a href="/health/check/select" className="cursor-pointer">
                    <div className="w-18 h-18 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">✓</div>
                    <div className="mt-2 text-m text-gray-800 font-medium">건강체크</div>
                </a>
                <a href="/community/total" className="cursor-pointer">
                    <div className="w-18 h-18 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-2xl font-bold">💬</div>
                    <div className="mt-2 text-m text-gray-800 font-medium">커뮤니티</div>
                </a>
                <a href="/health/guide" className="cursor-pointer">
                    <div className="w-18 h-18 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">📘</div>
                    <div className="mt-2 text-m text-gray-800 font-medium">건강체크 가이드</div>
                </a>
            </div>
            </div>

            <section className="w-full border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                        인기 급상승 🔥
                    </h2>

                    <div className="flex gap-2 my-3">
                        <button className="px-4 py-1 border border-white text-white text-sm rounded bg-gray-700 hover:bg-gray-600">
                            인기글
                        </button>
                        <button className="px-4 py-1 text-white text-sm rounded bg-gray-700 hover:bg-gray-600">
                            최신글
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        "[건강정보] 슈퍼위크에 이거 챙기셨나요?!",
                        "치킨불 만들기 🍗 (초초초간단해요!)",
                        "결국 품절제품을 기다리지 못 하고...",
                        "라이펫 쇼핑목록 공유부탁드려요 🥲",
                        "인형",
                        "젤리 모으기",
                        "오 배송에 빨라요",
                        "다들 진드기 관리 어케 하시나요...",
                        "플러그오프 준비중"
                    ].map((title, idx) => (
                        <div key={idx} className="bg-gray-100 rounded-lg p-4 text-gray-900">
                        <div className="flex justify-between">
                            <span className="font-semibold">{idx + 1}. {title}</span>
                            <span className="text-sm text-gray-500">1일 전 ♡ 10 💬 5</span>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
            <div>
                
            </div>

        </div>
    );
}
