'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

function formatDate(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (daysDiff === 0) return '오늘';
  if (daysDiff < 7) return `${daysDiff}일 전`;
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

const statusLabel = {
  PENDING: '답변대기',
  ANSWERED: '답변완료',
  CLOSED: '종료됨',
};

const categoryOptions = [
  '전체',
  '종합 관리', '간담낭', '감염', '구강', '근골격', '내분비', '뇌신경',
  '면역매개', '비뇨기', '생식기', '소화기', '심혈관', '안구', '종양', '피부', '호흡기', '기타'
];

export default function ConsultListPage() {
  const router = useRouter();
  const statusRef = useRef(null);
  const categoryRef = useRef(null);

  const [consults, setConsults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    const fetchConsults = async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '10',
      });
      if (statusFilter !== '전체') params.append('status', statusFilter);
      if (categoryFilter !== '전체') params.append('category', categoryFilter);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/consult?${params}`, {
          credentials: 'include',
        });

        const text = await res.text();
        if (text.startsWith('<!DOCTYPE html')) {
          router.replace('/login');
          return;
        }

        const data = JSON.parse(text);
        setConsults(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching consults:', err);
        alert('목록을 불러오지 못했습니다.');
      }
    };

    fetchConsults();
  }, [page, statusFilter, categoryFilter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        statusRef.current &&
        !statusRef.current.contains(e.target)
      ) {
        setShowStatusModal(false);
      }
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target)
      ) {
        setShowCategoryModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToDetail = (id) => router.push(`/health/consult/${id}`);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">상담 리스트</h1>

      {/* 필터 영역 */}
      <div className="flex gap-2 mb-4 text-sm relative">
        {/* 상태 필터 */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setShowStatusModal((prev) => !prev)}
            className="bg-gray-100 px-4 py-2 rounded-full"
          >
            상태: {statusFilter === '전체' ? '전체' : statusLabel[statusFilter] || statusFilter}
          </button>
          {showStatusModal && (
            <div className="absolute top-full left-0 z-10 bg-white border shadow rounded mt-1 text-xs">
              {['전체', 'PENDING', 'ANSWERED', 'CLOSED'].map(status => (
                <div
                  key={status}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusModal(false);
                    setPage(0);
                  }}
                >
                  {status === '전체' ? '전체' : statusLabel[status]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="relative" ref={categoryRef}>
          <button
            onClick={() => setShowCategoryModal((prev) => !prev)}
            className="bg-gray-100 px-4 py-2 rounded-full"
          >
            카테고리: {categoryFilter}
          </button>
          {showCategoryModal && (
            <div className="absolute top-full left-0 z-10 bg-white border shadow rounded mt-1 text-xs max-h-64 overflow-y-auto">
              {categoryOptions.map((cat) => (
                <div
                  key={cat}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setCategoryFilter(cat);
                    setShowCategoryModal(false);
                    setPage(0);
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 상담글 리스트 */}
      <ul className="bg-white rounded-xl shadow-md p-2 sm:p-4 divide-y divide-gray-200">
        {consults.map((post, index) => (
          <li
            key={post.id}
            onClick={() => goToDetail(post.id)}
            className="cursor-pointer px-4 py-5" // ← 상하 패딩 균일하게
          >
            <div className="text-xs text-gray-400 mb-1">
              {post.petType ? `#${post.petType}` : ''} {post.subCategory && `#${post.subCategory}`}
            </div>
            <div className="font-semibold text-base truncate">{post.title}</div>
            <div
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              className="text-sm text-gray-700 mt-1"
            >
              {post.content}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {post.username} · {formatDate(post.createdAt)}
            </div>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-2 mt-6 text-sm items-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="bg-gray-100 px-4 py-2 rounded-full"
        >
          이전
        </button>
        <span>페이지 {page + 1} / {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="bg-gray-100 px-4 py-2 rounded-full"
        >
          다음
        </button>
      </div>
    </div>
  );
}
