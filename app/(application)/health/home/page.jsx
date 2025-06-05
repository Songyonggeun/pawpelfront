'use client';

import { useEffect, useState } from 'react';

export default function HealthHome() {
    const [pets, setPets] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dDay, setDDay] = useState(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [consults, setConsults] = useState([]);
    // const [communityPosts, setCommunityPosts] = useState([]);

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
                setPets(data);
                setIsLoggedIn(true);
                setIsAuthChecked(true);
                const firstPet = data[0];
                setDDay(calculateDDay(firstPet.petAge, firstPet.lastCheckupDate));
            });

        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/consult/recent`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setConsults(data || []));

        // fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/community/recent`)
        //     .then((res) => res.json())
        //     .then((data) => setCommunityPosts(data || []));
    }, []);

    const calculateDDay = (age, lastCheckupDate) => {
        const months = age <= 3 ? 12 : age <= 7 ? 6 : 3;
        const lastDate = lastCheckupDate ? new Date(lastCheckupDate) : new Date();
        const nextDate = new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth() + months);
        const today = new Date();
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getBadgeColor = () => {
        if (dDay <= 0) return 'bg-red-500';
        if (dDay <= 7) return 'bg-yellow-400';
        return 'bg-blue-400';
    };

    const handlePrev = () => {
        const newIndex = currentIndex === 0 ? pets.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        const pet = pets[newIndex];
        setDDay(calculateDDay(pet.petAge, pet.lastCheckupDate));
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % pets.length;
        setCurrentIndex(newIndex);
        const pet = pets[newIndex];
        setDDay(calculateDDay(pet.petAge, pet.lastCheckupDate));
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            {isLoggedIn && pets.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center relative">
                    {pets.length > 1 && (
                        <>
                            <button onClick={handlePrev} className="absolute left-2 text-xl font-bold text-gray-500 hover:text-black">{'<'}</button>
                            <button onClick={handleNext} className="absolute right-2 text-xl font-bold text-gray-500 hover:text-black">{'>'}</button>
                        </>
                    )}
                    <div className="flex items-center space-x-4 mx-left">
                        <div className="w-16 h-16 bg-gray-200 rounded-full" />
                        <div>
                            <div className="font-bold text-lg">{pets[currentIndex].petName}</div>
                            <div className="text-gray-600 text-sm">
                                {pets[currentIndex].petType} · {(2025 - pets[currentIndex].petAge)}살
                            </div>
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

            {!isLoggedIn && isAuthChecked && (
                <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md text-center">
                    로그인 후 이용해주세요.
                </div>
            )}

            {/* 기능 아이콘 영역 */}
            <div className="grid grid-cols-4 gap-6 text-center">
                <a href="/health/check/select" className="cursor-pointer">
                    <div className="w-18 h-18 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">✓</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">건강체크</div>
                </a>
                <a href="/health/vaccine/select" className="cursor-pointer">
                    <div className="w-18 h-18 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">💉</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">접종체크</div>
                </a>
                <a href="/health/guide" className="cursor-pointer">
                    <div className="w-18 h-18 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">📘</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">건강체크 가이드</div>
                </a>
                <a href="/consult" className="cursor-pointer">
                    <div className="w-18 h-18 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-2xl font-bold">💬</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">수의사 상담</div>
                </a>
            </div>

            {/* 수의사 소개 + 커뮤니티 미리보기 */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    {/* 수의사 소개 카드 */}
                    <div className="w-full md:w-1/3 bg-gray-50 rounded-lg p-6 text-center md:text-left">
                        <h2 className="text-xl font-semibold mb-2 leading-snug">
                            우리 아이 건강에 대해<br />궁금한 점이 있으신가요?
                        </h2>
                        <a href="/health/consult">
                            <p className="text-sm text-gray-600 mb-4">전문 수의사에게 1:1 상담을 받아보세요.</p>
                        </a>
                        <img src="/images/vet-consult.png" alt="수의사 이미지" className="w-32 h-auto mx-auto md:mx-0" />
                    </div>

                    {/* 커뮤니티 미리보기 */}
                    <div className="w-full md:w-2/3 md:pl-6 mt-6 md:mt-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">커뮤니티 최신 글</h3>
                            <a href="/community/total" className="text-sm text-gray-600 hover:underline flex items-center">
                                더보기 <span className="ml-1">→</span>
                            </a>
                        </div>
                        <div className="space-y-4">
                            {/* {communityPosts.map((post, idx) => (
                                <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50">
                                    <a href={`/community/${post.id}`} className="font-medium text-gray-800 truncate hover:underline block">
                                        {post.title}
                                    </a>
                                    <div className="text-sm text-gray-500 truncate">{post.content}</div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>{post.nickname}</span>
                                        <span>{post.daysAgo}일 전 · 조회수 {post.views}</span>
                                    </div>
                                </div> */}
                            {/* ))} */}
                        </div>
                    </div>
                </div>
            </div>

            {/* 최근 수의사 상담 */}
            {isLoggedIn && (
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
            )}
        </div>
    );
}
