'use client';

import { useEffect, useState } from "react";

export default function AdminReportPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [message, setMessage] = useState('');

  const [sortField, setSortField] = useState('reportedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [searchType, setSearchType] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/reports`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`에러 응답: ${res.status}\n${text}`);
        }
        return res.json();
      })
      .then((data) => {
        const reportsData = Array.isArray(data) ? data : data.data || [];
        const sorted = [...reportsData].sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
        setReports(sorted);
        setFilteredReports(sorted);
      })
      .catch((error) => {
        console.error("신고 목록 로딩 실패:", error);
      });
  }, []);

  const reportCountByUser = reports.reduce((acc, cur) => {
    acc[cur.reportedUserId] = (acc[cur.reportedUserId] || 0) + 1;
    return acc;
  }, {});

  const handleSort = (field) => {
    const nextOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';

    const sorted = [...filteredReports].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'reportedAt') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
        return nextOrder === 'asc' ? aVal - bVal : bVal - aVal;
      } else {
        aVal = String(aVal || '');
        bVal = String(bVal || '');
        return nextOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
    });

    setSortField(field);
    setSortOrder(nextOrder);
    setFilteredReports(sorted);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (searchType === 'all' || !searchKeyword.trim()) {
      setFilteredReports(reports);
      setCurrentPage(1);
      return;
    }

    const filtered = reports.filter((report) => {
      const keyword = searchKeyword.trim();
      if (searchType === 'reporterName') return report.reporterName?.includes(keyword);
      if (searchType === 'reportedUserName') return report.reportedUserName?.includes(keyword);
      if (searchType === 'reason') return report.reason?.includes(keyword);
      return false;
    });

    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const handleEditClick = (id, currentStatus) => {
    setEditId(id);
    setEditStatus(currentStatus);
  };

  const handleStatusChange = (e) => {
    setEditStatus(e.target.value);
  };

  const handleSaveClick = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: editStatus }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`업데이트 실패: ${res.status}\n${errorText}`);
      }

      const update = (arr) =>
        arr.map((report) => (report.id === id ? { ...report, status: editStatus } : report));

      setReports(update);
      setFilteredReports(update);
      setEditId(null);
      setEditStatus('');
      setMessage('✅ 상태가 변경되었습니다.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('상태 업데이트 중 오류 발생:', error);
      setMessage('❌ 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCancelClick = () => {
    setEditId(null);
    setEditStatus('');
  };

  const handleDeleteClick = async (id) => {
    if (!confirm("정말 이 신고를 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/reports/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`삭제 실패: ${res.status}\n${errorText}`);
      }

      setReports((prev) => prev.filter((r) => r.id !== id));
      setFilteredReports((prev) => prev.filter((r) => r.id !== id));
      setMessage("✅ 신고가 삭제되었습니다.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("삭제 오류:", err);
      setMessage("❌ 신고 삭제에 실패했습니다.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-10">
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}

      <div className="text-2xl font-bold mb-6 flex items-center">
        <span className="mr-2">📁</span> 전체 신고 내역
      </div>

      <div className="mb-4 flex items-center gap-2">
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="border px-2 py-1 rounded">
          <option value="all">전체</option>
          <option value="reporterName">신고자</option>
          <option value="reportedUserName">작성자</option>
          <option value="reason">신고사유</option>
        </select>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="검색어 입력"
          className="border px-2 py-1 rounded w-64"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          검색
        </button>
      </div>

      <table className="w-full border border-gray-300 text-center text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border py-2 cursor-pointer" onClick={() => handleSort('reportedAt')}>
              신고 일시 {sortField === 'reportedAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="border py-2">신고자</th>
            <th className="border py-2">신고 사유</th>
            <th className="border py-2">작성자</th>
            <th className="border py-2">신고타입</th>
            <th className="border py-2">작성글</th>
            <th className="border py-2">작성댓글</th>
            <th className="border py-2">누적 신고 수</th>
            <th className="border py-2">상태</th>
            <th className="border py-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-6 text-gray-500">
                신고 내역이 없습니다.
              </td>
            </tr>
          ) : (
            paginatedReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="border py-2">{new Date(report.reportedAt).toLocaleString()}</td>
                <td className="border py-2">{report.reporterName}</td>
                <td className="border py-2">{report.reason}</td>
                <td className="border py-2">{report.reportedUserName}</td>
                <td className="border py-2">{report.targetType}</td>
                <td className="border py-2">{report.postId}</td>
                <td className="border py-2">{report.commentId}</td>
                <td className="border py-2">{reportCountByUser[report.reportedUserId]}</td>
                <td className="border py-2">
                  {editId === report.id ? (
                    <select value={editStatus} onChange={handleStatusChange} className="border rounded px-2 py-1">
                      <option value="대기중">대기중</option>
                      <option value="처리중">처리중</option>
                      <option value="처리완료">처리완료</option>
                    </select>
                  ) : (
                    report.status
                  )}
                </td>
                <td className="border py-2 space-x-2">
                  {editId === report.id ? (
                    <>
                      <button onClick={() => handleSaveClick(report.id)} className="text-green-600 hover:underline">
                        저장
                      </button>
                      <button onClick={handleCancelClick} className="text-gray-600 hover:underline">
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(report.id, report.status)}
                        className="text-blue-500 hover:underline"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteClick(report.id)}
                        className="text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 border rounded ${currentPage === num ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
