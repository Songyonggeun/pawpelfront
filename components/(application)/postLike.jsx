import { useState, useEffect } from "react";

export default function LikeCard({
    postId,
    initialLikeCount = 0,
    initialIsLiked = false,
    onLikeCountChange,
    isLoggedIn = false, // ✅ 추가
}) {
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [loading, setLoading] = useState(false);

    // 로그인한 경우에만 서버에서 좋아요 상태 불러오기
    useEffect(() => {
        async function fetchLikeStatus() {
            if (!isLoggedIn) return;

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${postId}/like/status`,
                    {
                        credentials: "include",
                    }
                );
                if (!res.ok) throw new Error("좋아요 상태를 불러오지 못했습니다.");
                const data = await res.json();

                setLikeCount(data.likeCount);
                setIsLiked(data.isLiked);
                onLikeCountChange?.(data.likeCount, data.isLiked);
            } catch (error) {
                console.error(error);
            }
        }

        fetchLikeStatus();
    }, [postId, isLoggedIn]);


    const toggleLike = async () => {
        if (!isLoggedIn || loading) return;

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${postId}/like`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
            if (!res.ok) throw new Error("좋아요 상태 변경 실패");

            const data = await res.json();
            setLikeCount(data.likeCount);
            setIsLiked(data.isLiked);
            onLikeCountChange?.(data.likeCount, data.isLiked);
        } catch (err) {
            console.error(err);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center mb-6 space-x-2">
            <button
                type="button"
                onClick={() => {
                    if (!isLoggedIn || loading) return; // 👈 클릭 무시
                    toggleLike();
                }}
                aria-pressed={isLiked}
                aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                className={`p-2 rounded-full transition-colors focus:outline-none ${
                    isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700"
                }`}
            >
                {isLiked ? (
                    // 채워진 하트 SVG
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="28"
                        height="28"
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
                    // 빈 하트 SVG
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="28"
                        height="28"
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
            </button>

            <span className="text-gray-700 font-medium select-none">
                {likeCount}
            </span>
        </div>
    );
}
