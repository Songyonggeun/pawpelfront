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

        // 최신 댓글이 위로 오도록 내림차순 정렬
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

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const currentComments = comments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  );

  if (loading) return <div>댓글 불러오는 중...</div>;
  if (error) return <div className="text-red-600">에러: {error}</div>;

  return (
    <div>
      {currentComments.map(comment => (
        <form
          key={comment.id}
          onSubmit={e => { e.preventDefault(); handleSubmit(comment.id); }}
          className="mb-4 p-3 rounded"
        >
          <div className="mb-1 font-semibold">{comment.authorName}</div>
          <textarea
            value={editContents[comment.id] || ''}
            onChange={e => handleChange(comment.id, e.target.value)}
            rows={1}
            className="w-full p-2 border rounded resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              수정 저장
            </button>
          </div>
        </form>
      ))}

      {/* 페이지네이션 컨트롤 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            이전
          </button>
          <span className="self-center">
            페이지 {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
