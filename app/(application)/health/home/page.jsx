'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // ✅ 수정된 부분
import 'swiper/css';
import 'swiper/css/navigation';

export default function HealthHome() {
    const [pets, setPets] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dDay, setDDay] = useState(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [consults, setConsults] = useState([]);
    const [posts, setPosts] = useState([]);

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
        // 게시글 전체 가져오기 후 최신순 정렬
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                const postList = Array.isArray(data) ? data : data.content || [];
                // isPublic === true인 게시글만 필터링
                const publicPosts = postList.filter((post) => post.isPublic);
                setPosts(publicPosts);
            })
            .catch((error) => {
                console.error("게시글 불러오기 실패:", error);
                setPosts([]);
            });

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
        <div className="p-10 max-w-4xl mx-auto space-y-[50px]">
            {/* 맨 위 반려동물 카드 */}
            {isLoggedIn && pets.length > 0 && (
                <div className="max-w-3xl mx-auto relative group">
                    {/* 커스텀 내비게이션 버튼 */}
                    <div
                        className="
        custom-prev absolute left-[-4] top-1/2 -translate-y-1/2
        text-3xl font-bold text-gray-400
        hover:text-gray-700
        transition duration-300
        z-10 px-3 cursor-pointer
    "
                    >
                        ‹
                    </div>

                    <div
                        className="
        custom-next absolute right-[-4] top-1/2 -translate-y-1/2
        text-3xl font-bold text-gray-400
        hover:text-gray-700
        transition duration-300
        z-10 px-3 cursor-pointer
    "
                    >
                        ›
                    </div>

                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            nextEl: '.custom-next',
                            prevEl: '.custom-prev',
                        }}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={true} // ✅ 무한 루프 설정
                        onSlideChange={(swiper) => {
                            const pet = pets[swiper.activeIndex];
                            setCurrentIndex(swiper.activeIndex);
                            setDDay(calculateDDay(pet.petAge, pet.lastCheckupDate));
                        }}
                        onSwiper={(swiper) => {
                            const pet = pets[swiper.activeIndex];
                            setCurrentIndex(swiper.activeIndex);
                            setDDay(calculateDDay(pet.petAge, pet.lastCheckupDate));
                        }}
                    >
                        {pets.map((pet, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full ml-4" />
                                        <div>
                                            <div className="font-bold text-lg">{pet.petName}</div>
                                            <div className="text-gray-600 text-sm">
                                                {pet.petType} · {(2025 - pet.petAge)}살
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-600 mr-4">검진 권장 시기</div>
                                        <div
                                            className={`inline-block mt-1 px-3 py-1 text-white text-sm rounded-full mr-4 ${getBadgeColor()}`}
                                        >
                                            D{dDay > 0 ? '-' + dDay : 'day'}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* 기능 아이콘 영역 - 가로 정렬 */}
            <div className="flex flex-wrap justify-center gap-22 text-center mb-20">
                <a href="/health/check/select" className="cursor-pointer w-24">
                    <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">✓</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">건강체크</div>
                </a>
                <a href="/health/vaccine/select" className="cursor-pointer w-24">
                    <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">💉</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">접종체크</div>
                </a>
                <a href="/health/guide" className="cursor-pointer w-24">
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">📘</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">건강체크 가이드</div>
                </a>
                <a href="/consult" className="cursor-pointer w-24">
                    <div className="w-20 h-20 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-2xl font-bold">💬</div>
                    <div className="mt-2 text-sm text-gray-800 font-medium">수의사 상담</div>
                </a>
            </div>


            {/* 수의사 소개 + 커뮤니티 미리보기 */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-24">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="w-full md:w-1/3 bg-gray-50 rounded-lg p-6 text-center md:text-left">
                        <h2 className="text-xl font-semibold mb-2 leading-snug">
                            우리 아이 건강에 대해<br />궁금한 점이 있으신가요?
                        </h2>
                        <a href="/health/consult">
                            <p className="text-sm text-gray-600 mb-4">전문 수의사에게 1:1 상담을 받아보세요.</p>
                        </a>
                        <img src="/images/vet-consult.png" alt="수의사 이미지" className="w-32 h-auto mx-auto md:mx-0" />
                    </div>

                    <div className="w-full md:w-2/3 md:pl-6 mt-6 md:mt-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">커뮤니티 최신 글</h3>
                            <a href="/community/total" className="text-sm text-gray-600 hover:underline flex items-center">
                                더보기 <span className="ml-1">→</span>
                            </a>
                        </div>
                        {/* 커뮤니티 최신 글 */}
                        <div className="space-y-2">
                            {posts.length === 0 ? (
                                <div className="text-sm text-gray-500">불러온 게시글이 없습니다.</div>
                            ) : (
                                posts.slice(0, 5).map((post, index) => {
                                    const createdDate = new Date(post.createdDate || post.createdAt);
                                    // 좋아요, 댓글, 조회수 기본값 0 처리
                                    const likeCount = post.likeCount ?? 0;
                                    const commentCount = post.commentCount ?? 0;
                                    const viewCount = post.viewCount ?? 0;

                                    return (
                                        <a
                                            key={index}
                                            href={`/community/detail/${post.id}`}
                                            className="block hover:bg-gray-50 p-2 rounded"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-blue-600 font-semibold">
                                                    [{post.category || '카테고리없음'}]
                                                </span>
                                                <div className="text-sm font-medium text-gray-800 truncate flex-1">
                                                    {post.title}
                                                </div>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-4">
                                                <div>{post.authorName}</div>
                                                <div>{createdDate.toLocaleDateString()}</div>
                                                <div>조회수 {viewCount}</div>
                                                <div>💬 {commentCount}</div>
                                                <div>❤️ {likeCount}</div>
                                            </div>
                                        </a>
                                    );
                                })
                            )}
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
