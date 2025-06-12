    'use client';

    import { useEffect, useState } from "react";

    export default function AdminReportPage() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetch("/admin/reports")
        .then((res) => res.json())
        .then(setReports)
        .catch(console.error);
    }, []);

    // 누적 신고 수 계산
    const reportCountByUser = reports.reduce((acc, cur) => {
        acc[cur.reportedUserId] = (acc[cur.reportedUserId] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="p-10">
        <div className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">📁</span> 전체 신고 관리
        </div>

        <table className="w-full border border-gray-300 text-center text-sm">
            <thead className="bg-gray-100">
            <tr>
                <th className="border border-gray-300 py-2">신고 일시</th>
                <th className="border border-gray-300 py-2">신고자 ID</th>
                <th className="border border-gray-300 py-2">신고당한 유저 ID</th>
                <th className="border border-gray-300 py-2">신고 사유</th>
                <th className="border border-gray-300 py-2">누적 신고 수</th>
                <th className="border border-gray-300 py-2">관리</th>
            </tr>
            </thead>
            <tbody>
            {reports.length === 0 ? (
                <tr>
                <td colSpan={8} className="py-6 text-gray-500">
                    신고 내역이 없습니다.
                </td>
                </tr>
            ) : (
                reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 py-2">
                    {new Date(report.reportedAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 py-2">{report.reporterId}</td>
                    <td className="border border-gray-300 py-2">{report.reportedUserId}</td>
                    <td className="border border-gray-300 py-2">{report.reason}</td>
                    <td className="border border-gray-300 py-2">{report.targetType}</td>
                    <td className="border border-gray-300 py-2">{report.targetId}</td>
                    <td className="border border-gray-300 py-2">
                    {reportCountByUser[report.reportedUserId]}
                    </td>
                    <td className="border border-gray-300 py-2 space-x-2">
                    <button className="text-blue-500 hover:underline">수정</button>
                    <button className="text-red-500 hover:underline">삭제</button>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
    }
