"use client";

    import { useEffect, useState } from "react";

    export default function PostPage() {
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editVisibility, setEditVisibility] = useState("공개");

    // 게시물 목록 로드
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post`, {
        credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("받은 데이터 :", data);
            setPosts(data);
        });
    }, []);

    // 삭제
    const handleDelete = (id) => {
        if (window.confirm("삭제하시겠습니까?")) {
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post/delete/${id}`, {
            method: "DELETE",
            credentials: "include",
        }).then((res) => {
            if (res.ok) {
            setPosts((prev) => prev.filter((post) => post.id !== id));
            alert("삭제되었습니다.");
            } else {
            alert("삭제에 실패했습니다.");
            }
        });
        }
    };

    // 수정 시작
    const startEdit = (post) => {
        setEditingPostId(post.id);
        setEditVisibility(post.visibility ? "공개" : "비공개");
    };

    // 수정 취소
    const cancelEdit = () => {
        setEditingPostId(null);
        setEditVisibility("공개");
    };

    // 저장 (공개/비공개)
    const handleUpdate = () => {
        if (editingPostId === null) return;

        // 변경될 공개 여부 메시지
        const message = 
            editVisibility === "공개"
                ? "이 게시글을 공개 처리하시겠습니까?"
                : "이 게시글을 비공개 처리하시겠습니까?"
        
        if(!window.confirm(message)) return;
    
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post/visibility/${editingPostId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                isPublic: editVisibility === "공개", // DTO에 맞게 'isPublic'
            }),
        })
        .then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text(); // HTML 에러 처리
                console.error("서버 오류:", res.status, errorText);
                alert("공개 여부 수정에 실패했습니다.");
                return null; // 이후 then 체인을 막기 위해 null 반환
            }
            return res.json(); // 성공 시 JSON 파싱
        })
        .then((updatedPost) => {
            if (!updatedPost) return; // 에러 처리로 인해 null일 경우 중단

            if(typeof updatedPost.isPublic === "undefined"){
                updatedPost.isPublic = editVisibility === "공개";
            }
            setPosts((prev) =>
                prev.map((post) => (post.id === editingPostId ? updatedPost : post))
            );
            cancelEdit();
            alert("게시글 공개 여부가 수정되었습니다.") // 수정 완료 알림 추가
        });
    };

    // 공지로 이동
    const moveToNotice = (id) => {
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/post/${id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "공지사항" }),
        }).then(() => {
        alert("공지사항으로 이동했습니다.");
        });
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">게시글 관리</h1>

        <ul className="space-y-2">
            {posts.map((post,index) => (
                <li
                key={post.id ?? `fallback-${index}`}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                {editingPostId === post.id ? (
                    <div className="flex gap-2 w-full items-center justify-between">
                    <span>{post.title}</span>
                    <div className="flex gap-2 items-center">
                        <select
                        value={editVisibility}
                        onChange={(e) => setEditVisibility(e.target.value)}
                        className="border p-1 rounded"
                        >
                        <option value="공개">공개</option>
                        <option value="비공개">비공개</option>
                        </select>
                        <button onClick={handleUpdate} className="text-green-600">
                        저장
                        </button>
                        <button onClick={cancelEdit} className="text-gray-600">
                        취소
                        </button>
                    </div>
                    </div>
                ) : (
                    <>
                    <span>{post.isPublic ? post.title : "비공개 처리 된 게시글입니다"}</span>
                    <div className="flex gap-2">
                        <button onClick={() => startEdit(post)} className="text-blue-600">
                        수정
                        </button>
                        <button onClick={() => moveToNotice(post.id)} className="text-yellow-600">
                        공지로 이동
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="text-red-600">
                        삭제
                        </button>
                    </div>
                    </>
                )}
                </li>
            ))}
            </ul>
        </div>
    );
    }
