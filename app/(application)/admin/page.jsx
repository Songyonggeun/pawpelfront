'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
const [userCount, setUserCount] = useState(0);
const [postCount, setPostCount] = useState(0);

useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/stats`)
    .then(res => res.json())
    .then(data => {
        setUserCount(data.userCount);
        setPostCount(data.postCount);
    });
}, []);

return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
    <h1 className="text-3xl font-bold text-gray-800">관리자 대시보드</h1>

      {/* 요약 카드 영역 */}    
    <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-[640px]">
        <div className="flex-1 bg-white shadow rounded-xl p-6 min-w-[300px]">
            <h2 className="text-xl font-semibold text-gray-700">전체 회원 수</h2>
            <p className="text-3xl font-bold mt-2 text-blue-600">{userCount}명</p>
        </div>

        <div className="flex-1 bg-white shadow rounded-xl p-6 min-w-[300px]">
            <h2 className="text-xl font-semibold text-gray-700">전체 게시글 수</h2>
            <p className="text-3xl font-bold mt-2 text-green-600">{postCount}개</p>
        </div>
        </div>
    </div>

      {/* 관리 메뉴 카드 영역 */}
    <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-[640px]">
        <Link
            href="admin/user"
            className="flex-1 bg-blue-100 hover:bg-blue-200 transition p-6 rounded-xl shadow text-center min-w-[300px]"
        >
            <h3 className="text-xl font-semibold text-blue-900">회원 관리</h3>
            <p className="text-sm mt-1 text-gray-700">회원 목록 확인/수정/탈퇴</p>
        </Link>

        <Link
            href="admin/post"
            className="flex-1 bg-green-100 hover:bg-green-200 transition p-6 rounded-xl shadow text-center min-w-[300px]"
        >
            <h3 className="text-xl font-semibold text-green-900">게시글 관리</h3>
            <p className="text-sm mt-1 text-gray-700">게시글 수정/삭제/이동</p>
        </Link>
        </div>
    </div>
    </div>
);
}
