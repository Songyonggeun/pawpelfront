    'use client';

    import { useEffect, useState } from "react";

    export default function AdminReportPage() {
    const [reports, setReports] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editStatus, setEditStatus] = useState('');
    const [message, setMessage] = useState('');
    const [sortField, setSortField] = useState('reportedAt');
    const [sortOrder, setSortOrder] = useState('asc');

    const [searchType, setSearchType] = useState('all');  // 기본을 전체로 변경
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredReports, setFilteredReports] = useState([]);

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
            setReports(reportsData);
            setFilteredReports(reportsData);
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
        const nextOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";

        const sorted = [...filteredReports].sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];

        if (field === "reportedAt") {
            aVal = aVal ? new Date(aVal).getTime() : 0;
            bVal = bVal ? new Date(bVal).getTime() : 0;
        } else {
            aVal = aVal ? String(aVal) : "";
            bVal = bVal ? String(bVal) : "";
        }

        if (aVal < bVal) return nextOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return nextOrder === "asc" ? 1 : -1;
        return 0;
        });

        setSortField(field);
        setSortOrder(nextOrder);
        setFilteredReports(sorted);
    };

    const handleSearch = () => {
        // 전체 선택이거나, 빈 검색어면 전체 리스트 보여주기
        if (searchType === 'all' || !searchKeyword.trim()) {
        setFilteredReports(reports);
        return;
        }

        const filtered = reports.filter((report) => {
        if (searchType === 'reporterId') {
            return String(report.reporterId).includes(searchKeyword);
        }
        if (searchType === 'reportedUserId') {
            return String(report.reportedUserId).includes(searchKeyword);
        }
        return false;
        });

        setFilteredReports(filtered);
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

        setReports((prev) =>
            prev.map((report) =>
            report.id === id ? { ...report, status: editStatus } : report
            )
        );

        setFilteredReports((prev) =>
            prev.map((report) =>
            report.id === id ? { ...report, status: editStatus } : report
            )
        );

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

    return (
        <div className="p-10">
        {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>
        )}

        <div className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">📁</span> 전체 신고 내역
        </div>

        <div className="mb-4 flex items-center gap-2">
            <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border px-2 py-1 rounded"
            >
            <option value="all">전체</option>
            <option value="reporterId">신고자 ID</option>
            <option value="reportedUserId">신고당한 유저 ID</option>
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

        <table className="w-full border border-gray-300 text-center text-sm">
            <thead className="bg-gray-100">
            <tr>
                <th
                className="border border-gray-300 py-2 cursor-pointer select-none"
                onClick={() => handleSort('reportedAt')}
                >
                신고 일시 {sortField === 'reportedAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="border border-gray-300 py-2">신고자 ID</th>
                <th className="border border-gray-300 py-2">신고당한 유저 ID</th>
                <th className="border border-gray-300 py-2">신고 유형</th>
                <th className="border border-gray-300 py-2">누적 신고 수</th>
                <th className="border border-gray-300 py-2">상태</th>
                <th className="border border-gray-300 py-2">관리</th>
            </tr>
            </thead>
            <tbody>
            {filteredReports.length === 0 ? (
                <tr>
                <td colSpan={7} className="py-6 text-gray-500">신고 내역이 없습니다.</td>
                </tr>
            ) : (
                filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 py-2">
                    {new Date(report.reportedAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 py-2">{report.reporterId}</td>
                    <td className="border border-gray-300 py-2">{report.reportedUserId}</td>
                    <td className="border border-gray-300 py-2">{report.targetType}</td>
                    <td className="border border-gray-300 py-2">
                    {reportCountByUser[report.reportedUserId]}
                    </td>
                    <td className="border border-gray-300 py-2">
                    {editId === report.id ? (
                        <select
                        value={editStatus}
                        onChange={handleStatusChange}
                        className="border border-gray-300 rounded px-2 py-1"
                        >
                        <option value="대기중">대기중</option>
                        <option value="처리중">처리중</option>
                        <option value="처리완료">처리완료</option>
                        </select>
                    ) : (
                        report.status
                    )}
                    </td>
                    <td className="border border-gray-300 py-2 space-x-2">
                    {editId === report.id ? (
                        <>
                        <button
                            onClick={() => handleSaveClick(report.id)}
                            className="text-green-600 hover:underline"
                        >
                            저장
                        </button>
                        <button
                            onClick={handleCancelClick}
                            className="text-gray-600 hover:underline"
                        >
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
                        <button className="text-red-500 hover:underline">삭제</button>
                        </>
                    )}
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
    }
