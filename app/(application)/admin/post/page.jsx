"use client";

import { useEffect, useState } from "react";

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editVisibility, setEditVisibility] = useState("공개");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
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
    }
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

    const message = editVisibility === "공개"
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
    }).then(() => alert("공지사항으로 이동했습니다."));
  };

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const paginatedPosts = posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">게시글 관리</h1>

      <table className="w-full text-sm text-left border-t border-gray-300">
        <thead className="bg-gray-300 text-gray-700 text-sm">
          <tr>
            <th className="px-4 text-center py-3 border-b">제목</th>
            <th className="px-4 text-center py-3 border-b">공개 여부</th>
            <th className="px-4 text-center py-3 border-b">공지로 이동</th>
            <th className="px-4 text-center py-3 border-b">관리</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((post, index) => (
            <tr key={post.id ?? `fallback-${index}`} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                {post.isPublic ? post.title : <span className="text-gray-400">비공개 처리된 게시글입니다</span>}
              </td>
              <td className="px-4 py-2">
                {editingPostId === post.id ? (
                  <select
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="공개">공개</option>
                    <option value="비공개">비공개</option>
                  </select>
                ) : post.isPublic ? (
                  <span className="text-green-600 font-semibold">공개</span>
                ) : (
                  <span className="text-gray-500">비공개</span>
                )}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => moveToNotice(post.id)}
                  className="text-yellow-600 hover:underline"
                >
                  공지로 이동
                </button>
              </td>
              <td className="px-4 py-2 space-x-2">
                {editingPostId === post.id ? (
                  <>
                    <button onClick={handleUpdate} className="text-green-600 hover:underline">저장</button>
                    <button onClick={cancelEdit} className="text-gray-600 hover:underline">취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(post)} className="text-purple-600 hover:underline">공개설정</button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">삭제</button>
                    <button onClick={() => moveToNotice(post.id)} className="text-blue-600 hover:underline">공지이동</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-6 space-x-2 text-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 border rounded disabled:opacity-30"
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span className="px-3 py-1 text-gray-600">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 border rounded disabled:opacity-30"
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
}
