'use client';

import { useEffect, useState } from 'react';

export default function HealthHome() {
    const [pet, setPet] = useState(null);
    const [dDay, setDDay] = useState(null);
    const [consults, setConsults] = useState([]);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/petinfo`, {
            credentials: 'include',
        })
            .then((res) => {
                if (res.status === 401 || res.status === 403) {
                    setIsLoggedIn(false);
                    setIsAuthChecked(true);
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (!data) return;
                setPet(data);
                setIsLoggedIn(true);
                setIsAuthChecked(true);
                const dDayValue = calculateDDay(data.age, data.lastCheckupDate);
                setDDay(dDayValue);
            });

        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/consult/recent`)
            .then((res) => res.json())
            .then((data) => setConsults(data.slice(0, 3)));
    }, []);

    const calculateDDay = (age, lastCheckupDate) => {
        const months = age <= 3 ? 12 : age <= 7 ? 6 : 3;
        const lastDate = new Date(lastCheckupDate);
        const nextDate = new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth() + months);

        const today = new Date();
        const diffTime = nextDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getBadgeColor = () => {
        if (dDay <= 0) return 'bg-red-500';
        if (dDay <= 7) return 'bg-yellow-400';
        return 'bg-blue-400';
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            {/* 상단 프로필 박스 - 로그인 시에만 표시 */}
            {isLoggedIn && pet && (
                <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full" />
                        <div>
                            <div className="font-bold text-lg">{pet.name || '이름 없음'}</div>
                            <div className="text-gray-600 text-sm">{pet.type} · {pet.age}살</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-gray-600">검진 권장 시기</div>
                        {dDay !== null && (
                            <div className={`inline-block mt-1 px-3 py-1 text-white text-sm rounded-full ${getBadgeColor()}`}>
                                D{dDay > 0 ? '-' + dDay : 'day'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 기능 아이콘 영역 */}
            <div className="grid grid-cols-3 gap-6 text-center">
                <a href="/health/check" className="cursor-pointer">
                    <div className="w-14 h-14 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">✓</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">건강체크</div>
                </a>
                <a href="/consult" className="cursor-pointer">
                    <div className="w-14 h-14 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-2xl font-bold">💬</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">수의사 상담</div>
                </a>
                <a href="/health/guide" className="cursor-pointer">
                    <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">📘</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">건강체크 가이드</div>
                </a>
            </div>

            {/* 최근 상담 목록 */}
            <div className="bg-white rounded-xl shadow-md p-4">
                <h2 className="text-lg font-semibold mb-2">최근 수의사 상담</h2>
                {consults.length === 0 ? (
                    <div className="text-sm text-gray-500">최근 상담이 없습니다.</div>
                ) : (
                    <ul className="text-sm space-y-2">
                        {consults.map((item, idx) => (
                            <li key={idx} className="text-gray-700">
                                🩺 {item.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
