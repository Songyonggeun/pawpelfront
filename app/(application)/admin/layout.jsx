    import Link from "next/link"

    export default function ApplicationLayout({ children }) {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        {/* 사이드바 */}
        <aside className="w-full lg:w-64 bg-gray-100 p-4">
            <nav>
            <ul className="flex lg:flex-col gap-4 justify-center lg:justify-start">
                <li>    
                <Link href="/admin/user" className="text-gray-700 hover:underline font-medium">회원 관리</Link>         
                </li>
                <li>
                <Link href="/admin/post" className="text-gray-700 hover:underline font-medium">게시글 관리</Link>
                </li>
                <li>
                <Link href="/admin/store" className="text-gray-700 hover:underline font-medium">스토어 관리</Link>
                </li>
                <li>
                <Link href="/admin/order" className="text-gray-700 hover:underline font-medium">주문 관리</Link>
                </li>
                <li>
                <Link href="/admin/report" className="text-gray-700 hover:underline font-medium">신고 내역</Link>
                </li>
            </ul>
            </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
            {children}
        </main>
        </div>
    );
    }
