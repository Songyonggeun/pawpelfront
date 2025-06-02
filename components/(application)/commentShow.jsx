'use client';

import { useState, useEffect } from 'react';

export default function CommentShow({ postId }) {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContents, setEditContents] = useState({});

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/post/${postId}`);
      if (!res.ok) throw new Error('댓글 불러오기 실패');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (id, value) => {
    setEditContents(prev => ({ ...prev, [id]: value }));
  };

  const handleEdit = (id, content) => {
    setEditingId(id);
    setEditContents({ [id]: content });
  };

  const handleSave = async (id, userId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContents[id],
          userId: userId,
        }),
      });
      if (!res.ok) throw new Error('댓글 수정 실패');
      alert('댓글이 수정되었습니다.');
      setEditingId(null);
      fetchComments();
    } catch (err) {
      alert('댓글 수정 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('댓글 삭제 실패');
      fetchComments();
    } catch (err) {
      alert('댓글 삭제 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-4 max-w-full">
      {comments.length === 0 && <p className="text-gray-500">댓글이 없습니다.</p>}

      {comments.map(comment => (
        <div key={comment.id}>
          {/* 작성자 + 날짜 + 버튼 라인 */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
            <div className="flex gap-2">
              <span className="text-gray-700 font-medium">
                {comment.userName ?? '작성자 없음'}
              </span>
              <span className="text-gray-400">|</span>
              <span>{formatDate(comment.createdAt)}</span>
            </div>

            <div className="flex gap-2">
              {editingId === comment.id ? (
                <>
                  <button
                    onClick={() => handleSave(comment.id, comment.userId)}
                    className="text-blue-500 hover:underline"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:underline"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(comment.id, comment.content)}
                    className="text-blue-500 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 댓글 본문 또는 수정 영역 */}
          {editingId === comment.id ? (
            <textarea
              rows={1}
              className="w-full rounded-md border border-gray-300 p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              value={editContents[comment.id] || ''}
              onChange={(e) => handleChange(comment.id, e.target.value)}
            />
          ) : (
            <p className="whitespace-pre-wrap p-2 rounded border border-gray-200 bg-gray-50 text-sm">
              {comment.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
