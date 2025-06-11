"use client";

import { useState, useEffect, useRef } from "react";
import CommentLike from "./commentLike";
import UserIcon from "../(icon)/userIcon";
import Link from "next/link";

export default function CommentShow({ postId }) {
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContents, setEditContents] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [mentionUsers, setMentionUsers] = useState([]);
  const [openProfileMenuId, setOpenProfileMenuId] = useState(null);
  const profileMenuRef = useRef(null);
  const [mentionDropdown, setMentionDropdown] = useState({
    visible: false,
    list: [],
    top: 0,
    left: 0,
  });

  const textareaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setOpenProfileMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
    fetchMentionUsers();
  }, [postId]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/auth/me`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("사용자 정보 불러오기 실패");
      const user = await res.json();
      console.log("받아온 유저 정보:", user);
      setCurrentUser(user);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMentionUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/mentionable`
      );
      const data = await res.json();
      setMentionUsers(data); // [{ id, nickname }]
    } catch (err) {
      console.error("멘션 사용자 불러오기 실패", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/post/${postId}`
      );
      const data = await res.json();
      const tree = buildCommentTree(data);
      setComments(tree);
    } catch (err) {
      console.error(err);
    }
  };

  const buildCommentTree = (flatComments) => {
    const map = {};
    const roots = [];

    flatComments.forEach((comment) => {
      comment.children = [];
      map[comment.id] = comment;
    });

    flatComments.forEach((comment) => {
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

  const handleReplyContentChange = (e) => {
    const value = e.target.value;
    setReplyContent(value);

    const cursorPos = e.target.selectionStart;
    const textUntilCursor = value.substring(0, cursorPos);
    const match = textUntilCursor.match(/@(\w*)$/);

    if (match) {
      const keyword = match[1].toLowerCase();
      const filtered = mentionUsers.filter(
        (user) =>
          user.nickname && user.nickname.toLowerCase().startsWith(keyword)
      );

      const { top, left } = e.target.getBoundingClientRect();
      setMentionDropdown({
        visible: true,
        list: filtered,
        top: top + 30,
        left: left + 10,
      });
    } else {
      setMentionDropdown({ ...mentionDropdown, visible: false });
    }
  };

  const insertMention = (nickname) => {
    const cursorPos = textareaRef.current.selectionStart;
    const before = replyContent
      .substring(0, cursorPos)
      .replace(/@(\w*)$/, `@${nickname} `);
    const after = replyContent.substring(cursorPos);
    setReplyContent(before + after);
    setMentionDropdown({ ...mentionDropdown, visible: false });

    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionEnd = before.length;
    }, 0);
  };

  const handleReply = (id) => {
    setReplyTo(id);
    setReplyContent("");
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim()) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: replyContent, postId, parentId }),
        }
      );
      if (!res.ok) throw new Error("댓글 등록 실패");
      setReplyTo(null);
      setReplyContent("");
      fetchComments();
    } catch (err) {
      alert("댓글 등록 중 오류 발생");
      console.error(err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${commentId}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("좋아요 처리 실패");
      fetchComments();
    } catch (err) {
      alert("좋아요 처리 중 오류");
      console.error(err);
    }
  };

  const handleEdit = (id, content) => {
    setEditingId(id);
    setEditContents({ [id]: content });
  };

  const handleSave = async (id, userId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editContents[id], userId }),
        }
      );
      if (!res.ok) throw new Error("수정 실패");
      alert("수정 완료");
      setEditingId(null);
      fetchComments();
    } catch (err) {
      alert("수정 중 오류");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("삭제 실패");
      fetchComments();
    } catch (err) {
      alert("삭제 중 오류");
      console.error(err);
    }
  };

  const formatDate = (str) => {
    const date = new Date(str);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const highlightMentions = (text) => {
    const regex = /@(\w+)/g;
    return text.split(regex).map((part, i) =>
      i % 2 === 1 ? (
        <span key={i} className="text-blue-500">
          @{part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderComment = (comment, parentUser = null, depth = 0) => {
    return (
      <div
        key={comment.id}
        className="pl-3 my-2 flex gap-2 items-start"
        style={{ marginLeft: depth * 4 }}
      >
        <div className="flex-shrink-0 relative">
          <div
            onClick={() =>
              setOpenProfileMenuId(
                openProfileMenuId === comment.id ? null : comment.id
              )
            }
            className="cursor-pointer"
          >
            <UserIcon />
          </div>

          {openProfileMenuId === comment.id && (
            <div
              ref={profileMenuRef}
              className="absolute z-10 bg-white border border-gray-300 rounded shadow px-3 py-2 text-sm top-0 left-full ml-2 whitespace-nowrap w-fit space-y-1"
            >
              <Link
                href={`/profile/${comment.userId}`}
                className="block text-blue-600 hover:underline"
                onClick={() => setOpenProfileMenuId(null)}
              >
                프로필 보기
              </Link>
              <button
                onClick={() => {
                  setOpenProfileMenuId(null);
                  alert(`"${comment.userName}"님을 차단했습니다.`);
                  // 또는 차단 처리 API 호출 가능:
                  // await fetch(`/api/block/${comment.userId}`, { method: "POST" })
                }}
                className="block text-red-500 hover:underline"
              >
                차단하기
              </button>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenProfileMenuId(
                  openProfileMenuId === comment.id ? null : comment.id
                );
              }}
              className="text-gray-700 font-medium hover:underline cursor-pointer"
            >
              {comment.userName}
            </span>
            <span>{formatDate(comment.createdAt)}</span>
            <CommentLike
              commentId={comment.id}
              initialLikeCount={comment.likeCount}
              initialIsLiked={comment.likedByCurrentUser}
              onLikeToggle={fetchComments}
            />
          </div>

          {editingId === comment.id ? (
            <>
              <textarea
                className="w-full border p-2 text-sm"
                value={editContents[comment.id]}
                onChange={(e) =>
                  setEditContents((prev) => ({
                    ...prev,
                    [comment.id]: e.target.value,
                  }))
                }
              />
              <div className="flex gap-2 text-xs mt-1">
                <button
                  onClick={() => handleSave(comment.id, comment.userId)}
                  className="text-blue-500"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500"
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm">
                {parentUser && (
                  <span className="text-gray-400">@{parentUser} </span>
                )}
                {highlightMentions(comment.content)}
              </p>
              <div className="mt-1 flex gap-2 text-sm">
                <button
                  onClick={() => handleReply(comment.id)}
                  className="text-blue-500"
                >
                  답글
                </button>
                {Number(currentUser?.id) === Number(comment.userId) && (
                  <>
                    <button
                      onClick={() => handleEdit(comment.id, comment.content)}
                      className="text-gray-500"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-500"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {replyTo === comment.id && (
            <div className="mt-2 relative">
              <textarea
                ref={textareaRef}
                className="w-full border p-2 text-sm"
                value={replyContent}
                onChange={handleReplyContentChange}
                placeholder="답글을 입력하세요"
              />
              {mentionDropdown.visible && (
                <ul className="absolute z-10 bg-white border rounded shadow mt-1 w-48">
                  {mentionDropdown.list.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => insertMention(user.nickname)}
                      className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                    >
                      @{user.nickname}
                    </li>
                  ))}
                </ul>
              )}
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
          )}

          {comment.children &&
            comment.children.map((child) =>
              renderComment(child, comment.userName, depth + 1)
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-500">댓글이 없습니다.</p>
      ) : (
        comments.map((comment) => renderComment(comment))
      )}
    </div>
  );
}
