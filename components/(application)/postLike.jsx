'use client';

import { useState } from 'react';

export default function LikeCard({ postId, initialLikeCount, initialIsLiked, onLikeCountChange }) {
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // ✅ POST 요청으로 좋아요 토글
      const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('좋아요 상태 변경 실패');

      const data = await response.json();
      setLikeCount(data.likeCount);
      setIsLiked(data.isLiked);

      if (onLikeCountChange) onLikeCountChange(data.likeCount);
    } catch (error) {
      console.error(error);
      alert('좋아요 처리 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <button
        onClick={toggleLike}
        disabled={loading}
        className={`px-6 py-3 rounded-md font-semibold transition-colors ${
          isLiked ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
        } ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600'}`}
      >
        👍 좋아요 ({likeCount})
      </button>
    </div>
  );
}
