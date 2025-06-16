'use client';

import { useEffect, useState } from 'react';

export default function ProductReview({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedReviewIds, setExpandedReviewIds] = useState([]);

    const formatDateToYMD = (dateString) => {
        if (!dateString) return "";
        const datePart = dateString.split('T')[0];
        return datePart.replace(/-/g, '/');
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/reviews/product/${productId}`);
                if (!res.ok) {
                    console.error(`Error: ${res.status} - ${res.statusText}`);
                    return;
                }
                const data = await res.json();
                setReviews(data);
            } catch (err) {
                console.error('리뷰 불러오기 실패:', err);
            } finally {
                setLoading(false);
            }
        };
        if (productId) fetchReviews();
    }, [productId]);

    if (loading) {
        return <div className="p-6">리뷰를 불러오는 중...</div>;
    }

    if (reviews.length === 0) {
        return <div className="p-6">아직 작성된 리뷰가 없습니다.</div>;
    }

    const toggleExpand = (id) => {
        setExpandedReviewIds((prev) =>
            prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
        );
    };

    return (
        <div className="mt-10 max-w-[1100px] mx-auto px-8 mb-10">
            <h3 className="text-lg font-bold mb-4 text-gray-800">상품 리뷰 목록</h3>

            {/* 헤더 */}
            <div className="grid grid-cols-12 text-sm font-semibold bg-gray-100 py-2 text-center text-gray-700 rounded-t-md">
                <div className="col-span-1 px-2">번호</div>
                <div className="col-span-2 text-center pr-6 px-0">작성자</div>
                <div className="col-span-5 text-left px-3">리뷰 내용</div>
                <div className="col-span-1 px-2">평점</div>
                <div className="col-span-2 px-2">작성일</div>
            </div>

            {/* 리뷰 목록 */}
            <div className="divide-y">
                {reviews.map((review, idx) => {
                    const isExpanded = expandedReviewIds.includes(review.id);

                    return (
                        <div
                            key={review.id}
                            className="grid grid-cols-12 gap-x-2 px-0 py-4 text-sm items-start rounded-md hover:bg-blue-50 cursor-pointer transition-shadow"
                            onClick={() => toggleExpand(review.id)}
                        >
                            <div className="col-span-1 text-center text-gray-500 px-2">{idx + 1}</div>

                            {/* 작성자 칸 오른쪽으로 이동 (왼쪽 패딩 제거, 오른쪽 패딩 증가) */}
                            <div className="col-span-2 text-center font-medium text-gray-700 pr-8">
                                {review.nickname}
                            </div>

                            {/* 리뷰 내용 칸 */}
                            <div
                                className={`col-span-5 text-left text-gray-600 whitespace-pre-wrap pl-1 pr-3 ${
                                    isExpanded ? '' : 'line-clamp-3'
                                }`}
                            >
                                {review.content}
                            </div>

                            <div className="col-span-1 text-center text-yellow-500 font-bold text-lg px-2">
                                ⭐ {review.rating}
                            </div>
                            <div className="col-span-2 text-center text-gray-500 whitespace-nowrap px-2">
                                {formatDateToYMD(review.createdAt)}
                            </div>

                            {review.image && (
                                <div className="col-span-12 mt-2 flex justify-start px-3">
                                    <img
                                        src={review.image}
                                        alt={`${review.nickname}님의 리뷰 이미지`}
                                        className="w-24 h-24 object-cover rounded-md"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
