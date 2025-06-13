import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function HealthCareMenu() {
  const pathname = usePathname();
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        setUserRoles(data.roles || []);
      } catch (err) {
        console.error('유저 정보 조회 실패:', err);
      }
    };
    fetchUserInfo();
  }, []);

  const isVetOrAdmin = userRoles.includes('VET') || userRoles.includes('ADMIN');
  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-6 text-sm text-gray-600 p-6">
      {/* max-w-5xl : 최대 너비 약 80rem (1280px), 가변 너비로 px 대신 */}
      <ul className="flex flex-col md:flex-row gap-8">
        <li>
          <Link
            href="/health/home"
            className={`block hover:underline ${
              isActive('/health/home') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            건강홈
          </Link>
        </li>
        <li>
          <Link
            href="/health/guide"
            className={`block hover:underline ${
              isActive('/health/guide') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            건강검진 가이드
          </Link>
        </li>
        <li>
          <Link
            href="/health/check/select"
            className={`block hover:underline ${
              isActive('/health/check/select') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            건강체크
          </Link>
        </li>
        <li>
          <Link
            href="/health/vaccine/select"
            className={`block hover:underline ${
              isActive('/health/vaccine/select') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            접종체크
          </Link>
        </li>
        <li>
          <Link
            href="/health/consult"
            className={`block hover:underline ${
              isActive('/health/consult') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            수의사상담
          </Link>
        </li>
        {isVetOrAdmin && (
          <li>
            <Link
              href="/health/consult/list"
              className={`block hover:underline ${
                isActive('/health/consult/list') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              상담리스트
            </Link>
          </li>
        )}
        <li>
          <Link
            href="/health/map"
            className={`block hover:underline ${
              isActive('/health/map') ? 'text-black font-bold' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            24시동물병원
          </Link>
        </li>
      </ul>
    </div>
  );
}
