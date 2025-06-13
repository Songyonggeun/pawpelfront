"use client";

import React, { useState, useEffect, useRef } from "react";
import CommunityMenu from "@/components/(application)/communityMenu";
import HealthCareMenu from "@/components/(application)/healthCare";
import HealthBanner from "@/components/(application)/healthBanner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

export default function HeaderClient({ isLoggedIn, userRoles }) {
    const router = useRouter();
    const [showCommunityMenu, setShowCommunityMenu] = useState(false);
    const [showHealthCareMenu, setShowHealthCareMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [mouseAtTop, setMouseAtTop] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        if (pathname.startsWith("/community")) {
            setShowCommunityMenu(true);
            setShowHealthCareMenu(false);
        } else if (pathname.startsWith("/health")) {
            setShowHealthCareMenu(true);
            setShowCommunityMenu(false);
        } else {
            setShowCommunityMenu(false);
            setShowHealthCareMenu(false);
        }
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 50) {
                setHeaderVisible(true);
            } else if (currentScrollY > lastScrollY.current) {
                setHeaderVisible(false);
            } else {
                setHeaderVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientY < 50) {
                setMouseAtTop(true);
                setHeaderVisible(true);
            } else {
                setMouseAtTop(false);
                if (window.scrollY > lastScrollY.current) {
                    setHeaderVisible(false);
                }
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notifications`,
                    {
                        credentials: "include",
                    }
                );
                if (!res.ok) {
                    const text = await res.text();
                    console.error("알림 실패 상태:", res.status, text);
                    return;
                }

                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                console.error("알림 패치 중 네트워크 오류:", err);
            }
        };

        fetchNotifications(); // 초기 1회 호출
        const interval = setInterval(fetchNotifications, 10000); // 이후 10초마다 반복
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notifications/${id}/read`,
            {
                method: "PATCH",
                credentials: "include",
            }
        );
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const toggleCommunityMenu = () => {
        setShowCommunityMenu((prev) => !prev);
        setShowHealthCareMenu(false);
    };

    const toggleHealthCareMenu = () => {
        setShowHealthCareMenu((prev) => !prev);
        setShowCommunityMenu(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
        if (mobileMenuOpen) {
            setShowCommunityMenu(false);
            setShowHealthCareMenu(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });
            window.location.href = "/";
        } catch (err) {
            console.error("로그아웃 실패:", err);
            alert("로그아웃 중 오류가 발생했습니다.");
        }
    };

    const handleSearch = () => {
        if (!searchKeyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }
        router.push(
            `/search?page=0&keyword=${encodeURIComponent(searchKeyword.trim())}`
        );
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <header
            className={`w-full z-50 sticky top-0 bg-white shadow-sm transition-transform duration-300 ${
                headerVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="max-w-screen-xl w-full mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center w-full md:w-auto min-w-0">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
                    >
                        <span className="text-blue-500 text-2xl font-bold select-none">
                            ✓
                        </span>
                        <span className="text-2xl font-bold text-blue-500 select-none whitespace-nowrap">
                            Pawple
                        </span>
                    </Link>

                    <nav className="hidden md:flex text-gray-700 text-base font-bold items-center space-x-12 ml-10 min-w-0 flex-shrink-0">
                        <button
                            onClick={toggleCommunityMenu}
                            className={`${
                                pathname.startsWith("/community")
                                    ? "text-black font-bold"
                                    : "hover:text-blue-500"
                            } whitespace-nowrap`}
                        >
                            커뮤니티
                        </button>

                        <button
                            onClick={toggleHealthCareMenu}
                            className={`${
                                pathname.startsWith("/health")
                                    ? "text-black font-bold"
                                    : "hover:text-blue-500"
                            } whitespace-nowrap`}
                        >
                            건강관리
                        </button>

                        <Link
                            href="/store"
                            className={`${
                                pathname === "/store"
                                    ? "text-black font-bold"
                                    : "hover:text-blue-500"
                            } whitespace-nowrap`}
                        >
                            스토어
                        </Link>
                    </nav>
                </div>

                <div className="md:flex items-center space-x-6 ml-auto min-w-0">
                    <HealthBanner isLoggedIn={isLoggedIn} />

                    {isClient && (
                        <>
                            <div className="relative flex-shrink-0 min-w-[280px] max-[1050px]:hidden">
                                <input
                                    type="text"
                                    placeholder="검색어를 입력해주세요."
                                    className="border border-gray-300 rounded-full px-4 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={searchKeyword}
                                    onChange={(e) =>
                                        setSearchKeyword(e.target.value)
                                    }
                                    onKeyDown={onKeyDown}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="absolute right-3 top-1.5 text-gray-500"
                                    aria-label="검색 버튼"
                                >
                                    🔍
                                </button>
                            </div>

                            {/* 장바구니 + 마이페이지 + 로그아웃 버튼들 */}

                            <div className="flex items-center space-x-6 flex-shrink-0 min-w-max">
                                <div className="relative flex-shrink-0">
                                    <button
                                        onClick={() =>
                                            setDropdownOpen((prev) => !prev)
                                        }
                                        className="relative top-1 text-gray-700 hover:text-blue-500 transition-colors whitespace-nowrap"
                                    >
                                        <Bell className="w-5 h-5" />
                                        {notifications.length > 0 && (
                                            <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl border border-gray-200 rounded-lg z-50 max-h-96 overflow-y-auto custom-scrollbar">
                                            <div className="p-4 font-semibold text-gray-800 border-b text-sm flex justify-between items-center">
                                                <span>새 알림</span>
                                                {notifications.length > 0 && (
                                                    <button
                                                        className="text-xs text-blue-500 hover:underline"
                                                        onClick={async () => {
                                                            try {
                                                                await fetch(
                                                                    `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notifications/read-all`,
                                                                    {
                                                                        method: "PATCH",
                                                                        credentials:
                                                                            "include",
                                                                    }
                                                                );
                                                                setNotifications(
                                                                    []
                                                                );
                                                            } catch (err) {
                                                                console.error(
                                                                    "모두 읽음 실패:",
                                                                    err
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        모두 읽음
                                                    </button>
                                                )}
                                            </div>

                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-gray-500 text-sm text-center">
                                                    새로운 알림이 없습니다.
                                                </div>
                                            ) : (
                                                <ul className="divide-y divide-gray-100">
                                                    {notifications.map((n) => (
                                                        <li
                                                            key={n.id}
                                                            className="flex justify-between items-start gap-2 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                                            onClick={async () => {
                                                                await markAsRead(
                                                                    n.id
                                                                );
                                                                if (n.postId) {
                                                                    window.location.href = `/community/detail/${n.postId}`;
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-sm text-gray-800">
                                                                    📩{" "}
                                                                    {n.message}
                                                                </span>
                                                                <span className="text-xs text-gray-400 mt-1">
                                                                    {new Date(
                                                                        n.createdAt
                                                                    ).toLocaleString(
                                                                        "ko-KR",
                                                                        {
                                                                            dateStyle:
                                                                                "short",
                                                                            timeStyle:
                                                                                "short",
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <button
                                                                className="text-xs text-blue-500 hover:underline whitespace-nowrap"
                                                                onClick={async (
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    await markAsRead(
                                                                        n.id
                                                                    );
                                                                }}
                                                            ></button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/store/cart"
                                    className="text-sm text-black hover:text-blue-500 whitespace-nowrap"
                                >
                                    장바구니
                                </Link>

                                {isLoggedIn ? (
                                    userRoles.length === 0 ? null : (
                                        <>
                                            {userRoles.includes("ADMIN") ? (
                                                <Link
                                                    href="/admin"
                                                    className="text-sm text-black hover:text-blue-500 whitespace-nowrap"
                                                >
                                                    관리자페이지
                                                </Link>
                                            ) : (
                                                <Link
                                                    href="/myPage"
                                                    className="text-sm text-black hover:text-blue-500 whitespace-nowrap"
                                                >
                                                    마이페이지
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="text-sm text-black hover:text-blue-500 whitespace-nowrap"
                                            >
                                                로그아웃
                                            </button>
                                        </>
                                    )
                                ) : (
                                    <Link
                                        href="/login"
                                        className="text-sm text-black hover:text-blue-500 whitespace-nowrap"
                                    >
                                        로그인
                                    </Link>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* 모바일용 검색창 + 햄버거 버튼 */}
                <div className="flex md:hidden w-full mt-4 space-x-2">
                    <div className="relative flex-grow min-w-0">
                        <input
                            type="text"
                            placeholder="검색어를 입력해주세요."
                            className="border border-gray-300 rounded-full px-4 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={onKeyDown}
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-3 top-1.5 text-gray-500"
                            aria-label="검색 버튼"
                        >
                            🔍
                        </button>
                    </div>

                    <button
                        className="p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
                        onClick={toggleMobileMenu}
                        aria-label="모바일 메뉴 토글"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {showCommunityMenu && (
                <div className="w-4/5 mx-auto px-4 border-t border-gray-200 md:block hidden">
                    <CommunityMenu visible={showCommunityMenu} />
                </div>
            )}
            {showHealthCareMenu && (
                <div className="w-4/5 mx-auto px-4 border-t border-gray-200 md:block hidden">
                    <HealthCareMenu visible={showHealthCareMenu} />
                </div>
            )}

            {mobileMenuOpen && (
                <nav className="md:hidden border-t border-gray-200 w-full px-4 py-3 bg-white shadow-sm">
                    <ul className="space-y-2 font-semibold text-gray-700">
                        <li>
                            <button
                                onClick={toggleCommunityMenu}
                                className="w-full text-left hover:text-blue-500"
                            >
                                커뮤니티
                            </button>
                            {showCommunityMenu && (
                                <CommunityMenu visible={showCommunityMenu} />
                            )}
                        </li>
                        <li>
                            <button
                                onClick={toggleHealthCareMenu}
                                className="w-full text-left hover:text-blue-500"
                            >
                                건강관리
                            </button>
                            {showHealthCareMenu && (
                                <HealthCareMenu visible={showHealthCareMenu} />
                            )}
                        </li>
                        <li>
                            <Link
                                href="/store"
                                className="block hover:text-blue-500"
                            >
                                스토어
                            </Link>
                        </li>
                        {isLoggedIn ? (
                            <>
                                {userRoles.includes("ADMIN") ? (
                                    <li>
                                        <Link
                                            href="/admin"
                                            className="block hover:text-blue-500"
                                        >
                                            관리자페이지
                                        </Link>
                                    </li>
                                ) : (
                                    <li>
                                        <Link
                                            href="/myPage"
                                            className="block hover:text-blue-500"
                                        >
                                            마이페이지
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left hover:text-blue-500"
                                    >
                                        로그아웃
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link
                                    href="/login"
                                    className="block hover:text-blue-500"
                                >
                                    로그인
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            )}
        </header>
    );
}
