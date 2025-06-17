"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editVisibility, setEditVisibility] = useState("공개");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortField, setSortField] = useState("author");
  const [sortOrder, setSortOrder] = useState("asc");


  const itemsPerPage = 20;
const router = useRouter();
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setFilteredPosts(data);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => {
        if (res.ok) {
          setPosts((prev) => prev.filter((post) => post.id !== id));
          setFilteredPosts((prev) => prev.filter((post) => post.id !== id));
          alert("삭제되었습니다.");
        } else {
          alert("삭제에 실패했습니다.");
        }
      });
    }
  };

  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditVisibility(post.visibility ? "비공개" : "공개");
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
          alert("공개 여부 수정에 실패했습니다.");
          return null;
        }
        return res.json();
      })
      .then((updatedPost) => {
  if (!updatedPost) return;

  const updateLists = (list) =>
    list.map((post) =>
      post.id === editingPostId
        ? {
            ...updatedPost,
            authorName: post.authorName ?? "작성자 없음", // 작성자 이름 유지
          }
        : post
    );

  setPosts((prev) => updateLists(prev));
  setFilteredPosts((prev) => updateLists(prev));
  cancelEdit();
  alert("게시글 공개 여부가 수정되었습니다.");
});
  };

  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) => {
      const field = searchType === "title" ? post.title : post.authorName;
      return field?.toLowerCase().includes(keyword);
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const nextOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...filteredPosts].sort((a, b) => {
      let aVal = field === "author" ? a.authorName : a.createdAt;
      let bVal = field === "author" ? b.authorName : b.createdAt;

      if (!aVal) aVal = "";
      if (!bVal) bVal = "";

      return nextOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    setSortField(field);
    setSortOrder(nextOrder);
    setFilteredPosts(sorted);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toISOString().slice(0, 10);
  };

  const MoveButton = ({ postId }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState("");

    const handleMove = () => {
  if (!selectedTarget) {
    alert("이동할 게시판을 선택해주세요.");
    return;
  }

  const confirmTextMap = {
    total: "전체글로 이동하시겠습니까?",
    topic: "건강토픽으로 이동하시겠습니까?",
    best: "BEST 게시판으로 이동하시겠습니까?",
    qa: "질문과 답변 게시판으로 이동하시겠습니까?",
    daily: "건강일상 게시판으로 이동하시겠습니까?",
  };

  const confirmText = confirmTextMap[selectedTarget] || "게시글을 이동하시겠습니까?";

  if (!window.confirm(confirmText)) return;

fetch(
  `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post/move/${postId}?category=${selectedTarget}`,
  {
    method: "PATCH",
    credentials: "include",
  }
).then((res) => {
    if (res.ok) {
      alert("게시글이 이동되었습니다.");
      setIsDropdownOpen(false);
      setSelectedTarget("");
    } else {
      alert("이동에 실패했습니다.");
    }
  });
};
    return (
        <div className="inline-block relative">
        <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-blue-600 hover:underline"
        >
          이동
        </button>
        {isDropdownOpen && (
          <div className="absolute bg-white border mt-1 p-2 rounded shadow z-10">
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="border px-2 py-1 text-sm mb-2 w-32"
            >
              <option value="">선택</option>
              <option value="topic">건강토픽</option>
              <option value="qa">질문과답</option>
              <option value="daily">건강일상</option>
              
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleMove}
                className="text-green-600 hover:underline text-sm"
              >
                이동
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="text-gray-600 hover:underline text-sm"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">게시글 관리</h1>

      <div className="flex items-center gap-2 mb-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="title">제목</option>
          <option value="authorName">작성자</option>
        </select>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="검색어 입력"
          className="border px-2 py-1 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          검색
        </button>
      </div>

      <table className="w-full text-sm text-left border-t border-gray-300">
        <thead className="bg-gray-300 text-gray-700 text-sm">
          <tr>
            <th className="px-4 text-center py-3 border-b">제목</th>
            <th
              className="px-4 text-center py-3 border-b cursor-pointer hover:underline"
              onClick={() => handleSort("author")}
            >
              작성자 {sortField === "author" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="px-4 text-center py-3 border-b cursor-pointer hover:underline"
              onClick={() => handleSort("createdAt")}
            >
              작성일 {sortField === "createdAt" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className="px-4 py-3 border-b w-[100px] text-center">공개 여부</th>
            <th className="px-4 text-center py-3 border-b">관리</th>
          </tr>
        </thead>
        <tbody>
            {paginatedPosts.map((post) => (
            <tr key={post.id} className="border-b hover:bg-gray-50 text-center">
                <td
                    onClick={() => router.push(`/community/detail/${post.id}`)}
                    className={`px-4 py-2 text-left max-w-[250px] truncate cursor-pointer hover:underline ${
                    (editingPostId === post.id && editVisibility === "비공개") || (!editingPostId && !post.isPublic)
                        ? "text-gray-400"
                        : ""
                    }`}
                    title={post.title}
                >
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                    {post.title}
                    </span>
                </td>
              <td className="px-4 py-2">{post.authorName ?? "작성자 없음"}</td>
              <td className="px-4 py-2">{formatDate(post.createdAt)}</td>
              <td className="px-4 py-2">
                {editingPostId === post.id ? (
                  <select
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value)}
                    className="border rounded p-1 w-[75px] text-sm"
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
              <td className="px-4 py-2 space-x-2">
                {editingPostId === post.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="text-green-600 hover:underline"
                    >
                      저장
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-600 hover:underline"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(post)}
                      className="text-purple-600 hover:underline"
                    >
                      공개설정
                    </button>
                    <MoveButton postId={post.id} />
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:underline"
                    >
                      삭제
                    </button>
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
