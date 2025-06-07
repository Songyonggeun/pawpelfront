'use client';

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const topicSubCategories = ["홈케어", "식이관리", "행동", "영양제", "병원", "질병"];
const qnaSubCategories = ["훈련", "미용", "먹이", "입양", "기타"];
const visibleCount = 5;

export default function EditPostPage() {
    const { id: postId } = useParams();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [authorName, setAuthorName] = useState(null);
    const [petList, setPetList] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [showMore, setShowMore] = useState(false);

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        async function loadQuill() {
            if (!window.Quill) {
                await loadStyle("https://cdn.quilljs.com/1.3.6/quill.snow.css");
                await loadScript("https://cdn.quilljs.com/1.3.6/quill.min.js");
            }
            if (window.Quill && editorRef.current && !quillRef.current) {
                quillRef.current = new window.Quill(editorRef.current, {
                    theme: "snow",
                    placeholder: "내용을 입력해주세요.",
                    modules: {
                        toolbar: [
                            [{ header: [1, 2, false] }],
                            ["bold", "italic", "underline"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link", "image"],
                            ["clean"],
                        ],
                    },
                });
                const editor = editorRef.current.querySelector(".ql-editor");
                if (editor) editor.style.minHeight = "300px";
            }
        }
        loadQuill();
    }, []);

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${postId}`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("게시글 불러오기 실패");
                const data = await res.json();

                setTitle(data.title);
                setCategory(data.category);
                setSubCategory(data.subCategory || "");
                setAuthorName(data.authorName);
                setSelectedPetId(data.petId || null);

                if (quillRef.current) {
                    quillRef.current.root.innerHTML = data.content || "";
                } else {
                    const interval = setInterval(() => {
                        if (quillRef.current) {
                            quillRef.current.root.innerHTML = data.content || "";
                            clearInterval(interval);
                        }
                    }, 100);
                }
            } catch (e) {
                alert("게시글을 불러오지 못했습니다.");
                router.push("/community/total");
            }
        }
        if (postId) fetchPost();
    }, [postId, router]);

    useEffect(() => {
        async function fetchUserAndPets() {
            try {
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/auth/me`, {
                    credentials: "include",
                });
                if (!userRes.ok) throw new Error("사용자 정보 불러오기 실패");
                const user = await userRes.json();
                setAuthorName(user.username || user.name || null);

                const petRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/petinfo`, {
                    credentials: "include",
                });
                if (petRes.ok) {
                    const pets = await petRes.json();
                    setPetList(pets);
                }
            } catch {
                setAuthorName(null);
                setPetList([]);
            }
        }
        fetchUserAndPets();
    }, []);

    const handleUpdate = async () => {
        if (!title.trim()) return alert("제목을 입력해주세요.");
        if (!category) return alert("카테고리를 선택해주세요.");
        if ((category === "토픽" || category === "Q&A") && !subCategory) return alert("서브카테고리를 선택해주세요.");

        const content = quillRef.current?.root.innerHTML || "";

        const payload = {
            title,
            content,
            category,
            subCategory: (category === "토픽" || category === "Q&A") ? subCategory : null,
            petId: selectedPetId,
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("게시글이 수정되었습니다.");
                router.push("/community/total");
            } else {
                alert("수정 실패");
            }
        } catch {
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 bg-white text-black">
            <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">제목</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력해주세요"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">카테고리</label>
                <select
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setSubCategory("");
                    }}
                >
                    <option value="">카테고리를 선택해주세요</option>
                    <option value="토픽">토픽</option>
                    <option value="Q&A">Q&A</option>
                    <option value="일상">일상</option>
                </select>
            </div>

            {(category === "토픽" || category === "Q&A") && (
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">서브카테고리</label>
                    <select
                        className="w-full border border-gray-300 rounded px-4 py-2"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                    >
                        <option value="">서브카테고리를 선택해주세요</option>
                        {(category === "토픽" ? topicSubCategories : qnaSubCategories).map((sub) => (
                            <option key={sub} value={sub}>
                                {sub}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">애완동물 선택 (선택사항)</label>
                <div className="flex flex-wrap gap-3">
                    {petList.slice(0, visibleCount).map((pet) => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            selected={selectedPetId === pet.id}
                            onClick={() => setSelectedPetId(pet.id)}
                        />
                    ))}
                    {showMore &&
                        petList.slice(visibleCount).map((pet) => (
                            <PetCard
                                key={pet.id}
                                pet={pet}
                                selected={selectedPetId === pet.id}
                                onClick={() => setSelectedPetId(pet.id)}
                            />
                        ))}
                </div>
                {petList.length > visibleCount && (
                    <button
                        type="button"
                        onClick={() => setShowMore(!showMore)}
                        className="mt-2 text-blue-600 underline"
                    >
                        {showMore ? "접기" : `+${petList.length - visibleCount} 더보기`}
                    </button>
                )}
            </div>

            <div className="mb-6">
                <div ref={editorRef} className="bg-white" />
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    수정 완료
                </button>
            </div>
        </div>
    );
}

function PetCard({ pet, selected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer border rounded-md p-3 w-24 text-center select-none ${selected ? "border-blue-500 bg-blue-100" : "border-gray-300 hover:border-blue-400"}`}
        >
            {pet.imageUrl ? (
                <img
                    src={pet.imageUrl}
                    alt={pet.petName}
                    className="mx-auto mb-2 h-16 w-16 object-cover rounded-full"
                />
            ) : (
                <div className="mx-auto mb-2 h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    🐾
                </div>
            )}
            <div className="text-sm font-medium truncate">{pet.petName}</div>
        </div>
    );
}

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.body.appendChild(script);
    });
}
function loadStyle(href) {
    return new Promise((resolve) => {
        const link = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
        link.onload = resolve;
        document.head.appendChild(link);
    });
}
