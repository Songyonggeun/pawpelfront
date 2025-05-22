"use client";

import { useEffect, useState } from "react";

export default function PostPage() {
  const [posts, setPosts] = useState([]); // 게시물 목록 상태
  const [editingPostId, setEditingPostId] = useState(null); // 수정 중인 게시물 ID
  const [editTitle, setEditTitle] = useState(""); // 수정 중인 제목 입력값

  // 페이지 로드 시 게시물 목록 불러오기
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/post`)
    .then((res) => res.json())
    .then((data) => setPosts(data));
}, []);

  // 게시물 삭제 요청
const handleDelete = (id) => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/post/${id}`, {
    method: "DELETE",
    }).then(() => {
      setPosts((prev) => prev.filter((post) => post.id !== id)); // 목록에서 제거
    });
};

  // 수정 시작
const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
};

  // 수정 취소
const cancelEdit = () => {
    setEditingPostId(null);
    setEditTitle("");
};

  // 제목 수정 저장
const handleUpdate = () => {
    if (editingPostId === null) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/post/${editingPostId}`, {
    method: "",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: editTitle }),
    })
    .then((res) => res.json())
    .then((updatedPost) => {
        setPosts((prev) =>
        prev.map((post) => (post.id === editingPostId ? updatedPost : post))
        );
        cancelEdit(); // 수정 종료
    });
};

  // 공지로 이동 요청
const moveToNotice = (id) => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/post/${id}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: "공지사항" }),
    }).then(() => {
    alert("공지사항으로 이동했습니다.");
    });
};

return (
    <div className="p-4 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">게시글 관리</h1>

    <ul className="space-y-2">
        {posts.map((post) => (
        <li
            key={post.id}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
        >
            {editingPostId === post.id ? (
            <div className="flex gap-2 w-full">
                <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border p-1 rounded flex-1"
                />
                <button onClick={handleUpdate} className="text-green-600">
                저장
                </button>
                <button onClick={cancelEdit} className="text-gray-600">
                취소
                </button>
            </div>
            ) : (
            <>
                <span>{post.title}</span>
                <div className="flex gap-2">
                <button
                    onClick={() => startEdit(post)}
                    className="text-blue-600"
                >
                    수정
                </button>
                <button
                    onClick={() => moveToNotice(post.id)}
                    className="text-yellow-600"
                >
                    공지로 이동
                </button>
                <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600"
                >
                    삭제
                </button>
                </div>
            </>
            )}
        </li>
        ))}
    </ul>
    </div>
);
}
