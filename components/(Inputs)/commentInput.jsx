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
        credentials: 'include', // 쿠키(세션) 전송
        body: JSON.stringify({
          content,
          postId,
        }),
      });

      if (!res.ok) {
        throw new Error('댓글 작성 실패');
      }

      const newComment = await res.json();
      setContent('');
      if (onCommentAdded) {
        onCommentAdded(newComment); // 부모 컴포넌트에 알림
      }
    } catch (err) {
      console.error(err);
      setError('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 pt-2 flex items-start gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        rows={2}
        className="border rounded-md p-2 resize-none flex-grow"
        style={{ width: '300px' }} // 필요하면 고정 너비 지정
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 self-center"
      >
        {loading ? '작성 중...' : '댓글 작성'}
      </button>
    </form>
  );
}
