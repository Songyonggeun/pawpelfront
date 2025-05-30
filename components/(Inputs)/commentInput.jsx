'use client';

import { useState } from 'react';

export default function CommentInput({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content, postId }),
      });

      if (!res.ok) {
        throw new Error('댓글 작성 실패');
      }

      const newComment = await res.json();
      setContent('');
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (err) {
      console.error(err);
      setError('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full relative">
      <div className="flex items-center w-full gap-2">
        <div className="relative w-full">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={1}
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none pr-10"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-transparent text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* 종이비행기 SVG 아이콘 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="24"
              height="24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <polygon
                points="16,256 496,32 400,480 256,368 176,432 176,304 416,96 208,320 16,256"
                stroke="black"
                strokeWidth="32"
                fill="none"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 -mt-1 ml-1">{error}</p>}
    </form>
  );
}
