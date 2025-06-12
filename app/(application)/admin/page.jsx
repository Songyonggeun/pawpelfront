'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/stats`, {
    credentials: 'include',
  })
    .then(res => res.json())
    .then(data => {
      console.log('👤 userCount:', data.userCount);
      console.log('📝 postCount:', data.postCount);
      setUserCount(data.userCount);
      setPostCount(data.postCount);
    })
    .catch(console.error);

}, []);
useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/sales/monthly`, {
    credentials: 'include',
  })
    .then(res => res.json())
    .then(data => {
      console.log('📊 월별 매출 데이터:', data); // 👈 여기가 중요!
      setSalesData(data);
    })
    .catch(err => {
      console.error('❗ 매출 데이터 오류:', err);
    });
}, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/sales/total`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(setTotalSales)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">관리자 대시보드</h1>

      {/* 요약 카드 */}
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

      {/* 💰 월별 매출 차트 */}
<div className="bg-white shadow rounded-xl p-6">
  <h2 className="text-xl font-semibold text-gray-700 mb-2">월별 총 매출</h2>
  <p className="text-sm text-gray-500 mb-4">
    전체 합계: <span className="font-semibold text-purple-600">{totalSales.toLocaleString()}원</span>
  </p>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={salesData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
      <Bar dataKey="totalSales" fill="#8884d8" name="매출 금액" />
    </BarChart>
  </ResponsiveContainer>
</div>

      {/* 관리 메뉴 카드 */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-[640px]">
          <Link href="/admin/user" className="flex-1 bg-blue-100 hover:bg-blue-200 transition p-6 rounded-xl shadow text-center min-w-[300px]">
            <h3 className="text-xl font-semibold text-blue-900">회원 관리</h3>
            <p className="text-sm mt-1 text-gray-700">회원 목록 확인/수정/탈퇴</p>
          </Link>
          <Link href="/admin/post" className="flex-1 bg-green-100 hover:bg-green-200 transition p-6 rounded-xl shadow text-center min-w-[300px]">
            <h3 className="text-xl font-semibold text-green-900">게시글 관리</h3>
            <p className="text-sm mt-1 text-gray-700">게시글 수정/삭제/이동</p>
          </Link>
          <Link href="/admin/store" className="flex-1 bg-yellow-100 hover:bg-yellow-200 transition p-6 rounded-xl shadow text-center min-w-[300px]">
            <h3 className="text-xl font-semibold text-yellow-900">스토어 관리</h3>
            <p className="text-sm mt-1 text-gray-700">상품 등록/수정/삭제</p>
          </Link>
          <Link href="/admin/order" className="flex-1 bg-orange-100 hover:bg-orange-200 transition p-6 rounded-xl shadow text-center min-w-[300px]">
            <h3 className="text-xl font-semibold text-orange-900">주문 관리</h3>
            <p className="text-sm mt-1 text-gray-700">주문 확인/수정/취소</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
