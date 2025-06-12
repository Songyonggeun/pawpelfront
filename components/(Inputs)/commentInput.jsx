"use client";

import { useState, useEffect, useRef } from "react";

export default function CommentInput({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [mentionUsers, setMentionUsers] = useState([]);
  const [mentionDropdown, setMentionDropdown] = useState({
    visible: false,
    list: [],
    top: 0,
    left: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchMentionUsers();
  }, []);

  const fetchMentionUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/mentionable`
      );
      if (!res.ok) throw new Error("멘션 유저 불러오기 실패");
      const data = await res.json(); // [{ id, nickname }]
      setMentionUsers(data);
    } catch (err) {
      console.error("멘션 유저 불러오기 실패", err);
    }
  };

  const getCaretCoordinates = (element, position) => {
    const div = document.createElement("div");
    const style = getComputedStyle(element);
    for (const prop of style) {
      div.style[prop] = style[prop];
    }

    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.overflow = "hidden";
    div.style.width = `${element.offsetWidth}px`;
    div.style.height = `${element.offsetHeight}px`;
    div.scrollTop = element.scrollTop;

    const before = element.value.substring(0, position);
    const after = element.value.substring(position);

    div.textContent = before;

    const span = document.createElement("span");
    span.textContent = after.length === 0 ? "." : after[0];
    div.appendChild(span);

    document.body.appendChild(div);
    const { offsetLeft: left, offsetTop: top } = span;
    document.body.removeChild(div);

    return { top, left };
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);

    const cursorPos = e.target.selectionStart;
    const textUntilCursor = value.substring(0, cursorPos);
    const match = textUntilCursor.match(/@(\w*)$/);

    if (match) {
      const keyword = match[1].toLowerCase();
      const filtered = mentionUsers.filter((user) =>
        user.nickname?.toLowerCase().startsWith(keyword)
      );

      const caret = getCaretCoordinates(e.target, cursorPos);
      const rect = textareaRef.current.getBoundingClientRect();

      setMentionDropdown({
        visible: true,
        list: filtered,
        top: window.scrollY + rect.top + caret.top - 20,
        left: window.scrollX + rect.left + caret.left,
      });
    } else {
      setMentionDropdown((prev) => ({ ...prev, visible: false }));
    }
  };

  const insertMention = (nickname) => {
    const cursorPos = textareaRef.current.selectionStart;
    const before = content
      .substring(0, cursorPos)
      .replace(/@(\w*)$/, `@${nickname} `);
    const after = content.substring(cursorPos);
    const newValue = before + after;
    setContent(newValue);
    setMentionDropdown({ ...mentionDropdown, visible: false });

    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionEnd = before.length;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content, postId }),
        }
      );

      if (!res.ok) throw new Error("댓글 작성 실패");

      const newComment = await res.json();
      setContent("");
      if (onCommentAdded) onCommentAdded(newComment);
    } catch (err) {
      console.error(err);
      setError("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full relative"
    >
      <div className="flex items-center w-full gap-2">
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            placeholder="댓글을 입력하세요..."
            rows={1}
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none pr-20"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute bottom-3 right-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            작성
          </button>

          {mentionDropdown.visible && (
            <ul
              className="absolute z-50 bg-white border rounded shadow w-48"
              style={{ top: "100%", left: "0px" }}
            >
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
        </div>
      </div>
      {error && <p className="text-sm text-red-500 -mt-1 ml-1">{error}</p>}
    </form>
  );
}
