'use client';

import { useEffect, useState } from 'react';

const COMMENTS_PER_PAGE = 10;

export default function CommentShow({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editContents, setEditContents] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/post/${postId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('댓글을 불러올 수 없습니다.');
        const data = await res.json();
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(data);

        const initialEditContents = {};
        data.forEach(c => {
          initialEditContents[c.id] = c.content;
        });
        setEditContents(initialEditContents);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleChange = (commentId, newContent) => {
    setEditContents(prev => ({ ...prev, [commentId]: newContent }));
  };

  const handleSubmit = async (commentId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${commentId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContents[commentId] }),
      });
      if (!res.ok) throw new Error('댓글 수정 실패');

      alert('댓글이 수정되었습니다.');

      const refreshed = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/post/${postId}`, {
        credentials: 'include',
      });
      const refreshedData = await refreshed.json();
      refreshedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(refreshedData);
    } catch (err) {
      alert(err.message);
    }
  };

const handleDelete = async (commentId) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include', // 쿠키를 포함하여 인증 상태를 전달
    });

    if (!res.ok) {
      // 에러 메시지 출력
      const errorResponse = await res.json();
      throw new Error(errorResponse.error || '댓글 삭제 실패');
    }

    alert('댓글이 삭제되었습니다.');

    // 댓글 삭제 후 화면에서 해당 댓글을 삭제
    setComments(comments.filter((comment) => comment.id !== commentId));
  } catch (err) {
    alert(err.message);
  }
};

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const currentComments = comments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  );

  if (loading) return <div className="text-center text-gray-400">댓글 불러오는 중...</div>;
  if (error) return <div className="text-center text-red-500">에러: {error}</div>;

  return (
    <div className="space-y-2 w-full">
      {currentComments.map(comment => (
        <form
          key={comment.id}
          onSubmit={e => { e.preventDefault(); handleSubmit(comment.id); }}
          className="bg-zinc-800 text-white p-4 rounded-lg shadow-sm space-y-2 w-full"
        >
          <div className="flex justify-between items-center">
            <div className="font-bold text-sm text-blue-300">{comment.userName}</div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="text-xs text-blue-600 bg-transparent border-2 border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition p-1"
                title="댓글 수정"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => handleDelete(comment.id)}
                className="text-xs text-red-600 bg-transparent border-2 border-red-600 rounded-md hover:bg-red-600 hover:text-white transition p-1"
                title="댓글 삭제"
              >
                삭제
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <textarea
              value={editContents[comment.id] || ''}
              onChange={e => handleChange(comment.id, e.target.value)}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </form>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 text-sm">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-zinc-700 rounded-md text-white disabled:opacity-40"
          >
            ◀ 이전
          </button>
          <span className="text-gray-400">
            페이지 {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-1 bg-zinc-700 rounded-md text-white disabled:opacity-40"
          >
            다음 ▶
          </button>
        </div>
      )}
    </div>
  );
}
