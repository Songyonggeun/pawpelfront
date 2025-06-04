"use client";

import { useEffect, useState } from "react";

const POSTS_PER_PAGE = 20;

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editVisibility, setEditVisibility] = useState("공개");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== id));
        alert("삭제되었습니다.");
      } else {
        alert("삭제에 실패했습니다.");
      }
    });
  };

  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditVisibility(post.visibility ? "공개" : "비공개");
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditVisibility("공개");
  };

  const handleUpdate = () => {
    if (editingPostId === null) return;

    const message =
      editVisibility === "공개"
        ? "이 게시글을 공개 처리하시겠습니까?"
        : "이 게시글을 비공개 처리하시겠습니까?";
    if (!window.confirm(message)) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post/visibility/${editingPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        isPublic: editVisibility === "공개",
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("서버 오류:", res.status, errorText);
          alert("공개 여부 수정에 실패했습니다.");
          return null;
        }
        return res.json();
      })
      .then((updatedPost) => {
        if (!updatedPost) return;
        if (typeof updatedPost.isPublic === "undefined") {
          updatedPost.isPublic = editVisibility === "공개";
        }
        setPosts((prev) =>
          prev.map((post) => (post.id === editingPostId ? updatedPost : post))
        );
        cancelEdit();
        alert("게시글 공개 여부가 수정되었습니다.");
      });
  };

  const moveToNotice = (id) => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post/${id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "공지사항" }),
    }).then(() => {
      alert("공지사항으로 이동했습니다.");
    });
  };

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">게시글 관리</h1>

      <table className="min-w-full table-auto border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">제목</th>
            <th className="border p-2">공개여부</th>
            <th className="border p-2">동작</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.id} className="text-center">
              <td className="border p-2">
                {editingPostId === post.id ? (
                  post.title
                ) : post.isPublic ? (
                  post.title
                ) : (
                  <span className="text-gray-500 italic">비공개 처리 된 게시글입니다</span>
                )}
              </td>
              <td className="border p-2">
                {editingPostId === post.id ? (
                  <select
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="공개">공개</option>
                    <option value="비공개">비공개</option>
                  </select>
                ) : (
                  post.isPublic ? "공개" : "비공개"
                )}
              </td>
              <td className="border p-2">
                {editingPostId === post.id ? (
                  <div className="flex justify-center gap-2">
                    <button onClick={handleUpdate} className="text-green-600">
                      저장
                    </button>
                    <button onClick={cancelEdit} className="text-gray-600">
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center gap-2">
                    <button onClick={() => startEdit(post)} className="text-blue-600">
                      수정
                    </button>
                    <button onClick={() => moveToNotice(post.id)} className="text-yellow-600">
                      공지로 이동
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600">
                      삭제
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
