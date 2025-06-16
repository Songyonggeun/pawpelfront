"use client";
import React, { useEffect, useState } from "react";

// 작성 시간 포맷팅 함수
const formatDateTimeToMinute = (dateString) => {
  if (!dateString) return "";

  const [datePart, timePart] = dateString.split(" ");
  if (!datePart || !timePart) return dateString;

  const [yy, mm, dd] = datePart.split("/");
  const [hour, minute] = timePart.split(":");

  if (!yy || !mm || !dd || !hour || !minute) return dateString;

  const yearFull = parseInt(yy, 10) < 50 ? "20" + yy : "19" + yy;

  return `${yearFull}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
};

export default function ReviewTable() {
  const [reviews, setReviews] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editVisibility, setEditVisibility] = useState("");
  const [message, setMessage] = useState("");

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/review`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server Error: ${res.status}\n${text}`);
        }
        return res.json();
      })
      .then(setReviews)
      .catch((err) => {
        console.error("리뷰 데이터를 불러오지 못했습니다:", err.message);
      });
  }, []);

  const toggleContent = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const startEdit = (review) => {
    setEditingReviewId(review.id);
    setEditVisibility(review.isPublic);
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditVisibility("");
    setMessage("");
  };

  const handleSave = () => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/review/${editingReviewId}/public`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPublic: editVisibility }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("공개 여부 업데이트 실패");
        return res.json();
      })
      .then(() => {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === editingReviewId ? { ...review, isPublic: editVisibility } : review
          )
        );
        setMessage("공개여부가 수정되었습니다");
        setEditingReviewId(null);
        setEditVisibility("");
      })
      .catch((err) => {
        console.error(err);
        setMessage("업데이트 중 오류가 발생했습니다");
      });
  };

  const handleDelete = (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/review/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("삭제 실패");
        setReviews((prev) => prev.filter((review) => review.id !== id));
        setMessage("리뷰가 삭제되었습니다.");
      })
      .catch((err) => {
        console.error(err);
        setMessage("삭제 중 오류가 발생했습니다.");
      });
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">리뷰 관리</h2>

      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>
      )}

      <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-300 border-b border-gray-200">
          <tr>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">상품명</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">작성자 ID</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">작성자 닉네임</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">작성일</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">공개 여부</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">평점</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">액션</th>
          </tr>
        </thead>
        <tbody>
          {currentReviews.map((review, idx) => (
            <React.Fragment key={review.id}>
              <tr className={`hover:bg-gray-50 ${idx % 2 === 1 ? "bg-gray-100" : ""}`}>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">{review.productName ?? "상품 없음"}</td>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">{review.userId}</td>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">{review.nickname}</td>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">{formatDateTimeToMinute(review.createdAt)}</td>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap text-center">
                  {editingReviewId === review.id ? (
                    <select
                      value={editVisibility}
                      onChange={(e) => setEditVisibility(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="공개">공개</option>
                      <option value="비공개">비공개</option>
                    </select>
                  ) : (
                    <span
                      className={`font-semibold ${
                        review.isPublic === "공개" ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {review.isPublic}
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap text-center">{review.rating}</td>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap text-center space-x-2">
                  {editingReviewId === review.id ? (
                    <>
                      <button
                        onClick={handleSave}
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
                        onClick={() => startEdit(review)}
                        className="text-blue-600 hover:underline"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => toggleContent(review.id)}
                        className="text-purple-600 hover:underline ml-2"
                      >
                        {expandedRows[review.id] ? "본문 닫기" : "본문 보기"}
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 hover:underline ml-2"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </td>
              </tr>
              {expandedRows[review.id] && (
                <tr>
                  <td colSpan="7" className="border border-gray-300 px-3 py-2 bg-gray-50 text-sm text-gray-800 whitespace-pre-wrap">
                    <strong>리뷰 본문:</strong>
                    <div className="mt-1">{review.content}</div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border border-gray-300 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
