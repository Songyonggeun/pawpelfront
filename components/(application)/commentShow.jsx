'use client';

import { useState, useEffect } from 'react';

export default function CommentShow({ postId }) {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContents, setEditContents] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

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

  const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((comment) => {
      map[comment.id] = { ...comment, children: [] };
    });

    comments.forEach((comment) => {
      if (comment.parentId) {
        map[comment.parentId]?.children.push(map[comment.id]);
      } else {
        roots.push(map[comment.id]);
      }
    });

    return roots;
  };

  const handleChange = (id, value) => {
    setEditContents((prev) => ({ ...prev, [id]: value }));
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

  const handleReply = (id) => {
    setReplyTo(id);
    setReplyContent('');
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          postId: postId,
          parentId: parentId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || '답글 작성 실패');
        return;
      }

      setReplyTo(null);
      setReplyContent('');
      fetchComments();
    } catch (err) {
      alert('답글 작성 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const renderComment = (comment, depth = 0) => {
    return (
      <div
        key={comment.id}
        style={{ marginLeft: `${depth * 20}px` }}
        className="border-l border-gray-200 pl-3 my-2"
      >
        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
          <div className="flex gap-2">
            <span className="text-gray-700 font-medium">{comment.userName ?? '작성자 없음'}</span>
            <span>|</span>
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

        {depth < 5 ? (
          replyTo === comment.id ? (
            <div className="mt-2">
              <textarea
                rows={1}
                className="w-full border rounded p-2 text-sm"
                placeholder="답글을 입력하세요"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="mt-1 flex gap-2 text-xs">
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  className="text-blue-500"
                >
                  등록
                </button>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-gray-500"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleReply(comment.id)}
              className="text-sm text-blue-500 hover:underline mt-1"
            >
              답글 달기
            </button>
          )
        ) : (
          <p className="text-xs text-gray-400 mt-1">※ 더 이상 답글을 달 수 없습니다.</p>
        )}

        {/* 재귀적으로 자식 댓글 렌더링 */}
        {comment.children?.map((child) => renderComment(child, depth + 1))}
      </div>
    );
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div className="space-y-4 max-w-full">
      {comments.length === 0 && <p className="text-gray-500">댓글이 없습니다.</p>}
      {commentTree.map((comment) => renderComment(comment))}
    </div>
  );
}
