'use client'; // Next.js 사용하는 경우

import React from 'react';

export default function TotalPage() {
    return (
        <div className="bg-[#18181C] text-white min-h-screen">
            <div className="max-w-6xl mx-auto flex pt-10">
                {/* 왼쪽: 전체글 리스트 */}
                <main className="flex-1 pr-8">
                    <h2 className="text-2xl font-bold mb-6">전체글</h2>

                    <div className="flex gap-2 mb-6">
                        <div className="mb-2">
                            <select
                                className="bg-[#1F2937] text-gray-200 border border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                defaultValue="latest"
                                onChange={(e) => {
                                    const sortBy = e.target.value;
                                    console.log('정렬 방식:', sortBy); // 여기에 정렬 로직 연결
                                }}
                            >
                                <option value="latest">최신순</option>
                                <option value="popular">인기순</option>
                            </select>
                        </div>
                    </div>

                    {/* 게시글 목록 */}
                    <div className="divide-y divide-gray-800 mt-0">
                        {[
                            {
                                category: '건강일상',
                                title: '대형견 놀이터',
                                content: '전북이나 전남에 대형견 운동장 대관 추천 해주실 수 있나요?',
                                author: '로미미',
                                time: '19분 전',
                                views: 0,
                                likes: 0,
                                comments: 0,
                                categoryColor: 'text-gray-400',
                            },
                            {
                                category: '질문과답',
                                title: '서울에 강아지 수영장 있나요?',
                                content: '한강이나 --천에서 한다는 얘기를',
                                author: '남밤박사',
                                time: '58분 전',
                                views: 3,
                                likes: 1,
                                comments: 1,
                                categoryColor: 'text-red-400',
                            },
                            {
                                category: '질문과답',
                                title: '고양이 치석',
                                content: '고양이 치석 관리 어떻게 하시는지 궁금해요~!',
                                author: '알루루럭우유2',
                                time: '2시간 전',
                                views: 7,
                                likes: 1,
                                comments: 1,
                                categoryColor: 'text-red-400',
                            },
                            {
                                category: '노하우',
                                title: '',
                                content: '',
                                author: '',
                                time: '',
                                views: 0,
                                likes: 0,
                                comments: 0,
                                categoryColor: 'text-yellow-400',
                            },
                        ].map((post, idx) => (
                            <div key={idx} className="py-6">
                                <div className={`text-sm ${post.categoryColor} mb-1`}>{post.category}</div>
                                {post.title && <div className="font-semibold text-lg mb-1">{post.title}</div>}
                                {post.content && <div className="text-gray-300 mb-3 text-sm">{post.content}</div>}
                                {post.author && (
                                    <div className="flex items-center text-xs text-gray-500">
                                        <span>{post.author}</span>
                                        <span className="mx-2">·</span>
                                        <span>{post.time}</span>
                                        <span className="mx-2">·</span>
                                        <span>조회수 {post.views}</span>
                                        <span className="ml-auto flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <HeartIcon />{post.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CommentIcon />{post.comments}
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>

                {/* 오른쪽: 인기글 */}
                <aside className="w-80 border-l border-gray-800 pl-8">
                    <h3 className="text-lg font-bold mb-4">인기글</h3>
                    <ol className="space-y-2 text-sm">
                        {[
                            '📢 게시글 챌린지 참여하고 1년치...',
                            '[건강정보] 슈퍼위크에 이거 챙기셨나요?!',
                            '📢 건강토픽 구독하면 영양 간식...',
                            '모모가 추천하는 <항산화제 Top...',
                            '라이펫 슈퍼위크 쇼핑해따용! 😊',
                            '라이펫 슈퍼위크 택배도착이요...',
                            '치킨불 만들기 🐔 (초초초간단해...',
                            '물만 먹으면 "펫켓" 기침하는 아이...',
                            '결국 품절제품을 기다리지 못 하고...',
                            '라이펫 쇼핑목록 공유부탁드려요...',
                        ].map((text, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span className="text-pink-400 font-bold">{index + 1}</span>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ol>
                </aside>
            </div>
        </div>
    );
}

function HeartIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

function CommentIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17 8h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2" />
            <polyline points="15 3 12 0 9 3" />
        </svg>
    );
}
