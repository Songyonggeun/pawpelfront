"use client";

import { useState, useEffect } from "react";

export default function CommentLike({
    commentId,
    initialLikeCount = 0,
    initialIsLiked = false,
    onLikeToggle,
}) {
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // 로그인 여부를 체크하고, 로그인된 경우에만 like 상태를 가져오도록 수정
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/auth/me`, {
                    credentials: 'include',
                });

                if (res.ok) {
                    const user = await res.json();
                    setCurrentUser(user);
                } else {
                    setCurrentUser(null);
                }
            } catch {
                setCurrentUser(null);
            }
        };

        checkLogin();
    }, []);

    // 로그인 상태가 변경되었을 때만 좋아요 상태를 조회
    useEffect(() => {
        if (currentUser) {
            fetchLikeStatus();  // 로그인 시에만 좋아요 상태를 가져옴
        } else {
            setLikeCount(initialLikeCount); // 로그인 안 했으면 초기값 그대로 사용
        }
    }, [currentUser]);

    // 좋아요 상태를 가져오는 함수
    const fetchLikeStatus = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${commentId}/like/status`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error("좋아요 상태 조회 실패");
            const data = await res.json();

            setLikeCount(data.likeCount);
            setIsLiked(data.isLiked);
        } catch (err) {
            console.error(err);
        }
    };

    // 좋아요 토글 처리
    const toggleLike = async () => {
        if (!currentUser || loading) return; // 로그인 안 했으면 클릭 무시

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/comments/${commentId}/like`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("좋아요 처리 실패");

            const data = await res.json();
            setLikeCount(data.likeCount);
            setIsLiked(data.isLiked);

            if (onLikeToggle) onLikeToggle(data.likeCount, data.isLiked);
        } catch (err) {
            console.error(err);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };


    return (
            <button
                type="button"
                onClick={toggleLike}
                aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                aria-pressed={isLiked}
                className={`ml-2 text-sm font-semibold flex items-center gap-1 transition-colors ${
                    isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-red-500"
                } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
            {isLiked ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                        4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 
                        3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 
                        8.5c0 3.78-3.4 6.86-8.55 
                        11.54L12 21.35z"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor">
                    <path
                        d="M16.5 3c-1.74 0-3.41 0.81-4.5 
                        2.09C10.91 3.81 9.24 3 7.5 
                        3 4.42 3 2 5.42 2 
                        8.5c0 3.78 3.4 6.86 8.55 
                        11.54L12 21.35l1.45-1.32C18.6 
                        15.36 22 12.28 22 
                        8.5 22 5.42 19.58 3 16.5 
                        3zM12 19.55l-.1-.1C7.14 
                        15.24 4 12.39 4 8.5 4 
                        6.5 5.5 5 7.5 5c1.54 
                        0 3.04 1 3.57 2.36h1.87C13.46 
                        6 14.96 5 16.5 5c2 
                        0 3.5 1.5 3.5 3.5 0 
                        3.89-3.14 6.74-7.9 10.95l-.1.1z"
                    />
                </svg>
            )}
            {likeCount}
        </button>
    );
}
