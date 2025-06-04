'use client';

import { useState, useEffect } from 'react';
import CommentLike from './commentLike';

export default function CommentShow({ postId }) {
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);  // 로그인 사용자 정보
  const [editingId, setEditingId] = useState(null);
  const [editContents, setEditContents] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [postId]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/auth/me`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('사용자 정보 불러오기 실패');
      const user = await res.json();
      setCurrentUser(user);  // user.imageUrl 사용 가능
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/post/${postId}`);
      if (!res.ok) throw new Error('댓글 불러오기 실패');
      const data = await res.json();
      const tree = buildCommentTree(data);
      setComments(tree);
    } catch (err) {
      console.error(err);
    }
  };

  // 평평한 배열을 트리 구조로 변환하는 함수
  const buildCommentTree = (flatComments) => {
    const map = {};
    const roots = [];

    flatComments.forEach(comment => {
      comment.children = [];
      map[comment.id] = comment;
    });

    flatComments.forEach(comment => {
      if (comment.parentId) {
        const parent = map[comment.parentId];
        if (parent) {
          parent.children.push(comment);
        } else {
          roots.push(comment);
        }
      } else {
        roots.push(comment);
      }
    });

    return roots;
  };

  // 좋아요 상태를 업데이트하는 함수
  const handleLike = async (commentId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${commentId}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('좋아요 처리 실패');
      fetchComments(); // 좋아요 갱신을 위해 댓글 다시 불러오기
    } catch (err) {
      alert('좋아요 처리 중 오류가 발생했습니다.');
      console.error(err);
    }
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

  const renderComment = (comment, parentUserName = null, depth = 0) => {
    // comment.userImageUrl 가 있다고 가정, 없으면 빈 이미지 혹은 기본 이미지 처리
    const userImageUrl = comment.userImageUrl || '/default-profile.png';

    // 좋아요 상태 및 수 - API에서 받아온 comment.likeCount, comment.likedByCurrentUser 가 있다고 가정
    const likeCount = comment.likeCount || 0;
    const likedByCurrentUser = comment.likedByCurrentUser || false;

    return (
      <div
        key={comment.id}
        style={{ marginLeft: depth * 4 }}
        className="border-l border-gray-200 pl-3 my-2 flex gap-2 items-start"
      >
        <img
          src={userImageUrl}
          alt={`${comment.userName ?? '작성자'} 프로필`}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
            <div className="flex gap-2 items-center">
              <span className="text-gray-700 font-medium">{comment.userName ?? '작성자 없음'}</span>
              <span>|</span>
              <span>{formatDate(comment.createdAt)}</span>

              {/* 분리된 CommentLike 컴포넌트 사용 */}
              <CommentLike
                commentId={comment.id}
                initialLikeCount={comment.likeCount || 0}
                initialIsLiked={comment.likedByCurrentUser || false}
                onLikeToggle={() => fetchComments()} // 좋아요 토글 후 댓글 다시 불러오기
              />
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
            <p className="text-sm">
              {parentUserName && (
                <span className="text-gray-500">@{parentUserName} </span>
              )}
              {comment.content}{' '}
            </p>
          )}

          {replyTo === comment.id ? (
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
          )}

          {comment.children && comment.children.map(child =>
            renderComment(child, comment.userName, depth + 1)
          )}
        </div>
      </div>
    );
  };  

  return (
    <div className="space-y-4 max-w-full">
      {comments.length === 0 && <p className="text-gray-500">댓글이 없습니다.</p>}
      {comments.map(comment => renderComment(comment))}
    </div>
  );
}
