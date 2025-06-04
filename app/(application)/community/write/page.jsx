'use client';
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const WritePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [authorName, setAuthorName] = useState(null);
  const [petList, setPetList] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const router = useRouter();

  const visibleCount = 5;

  // 서브카테고리 옵션 (토픽 카테고리일 때만)
  const topicSubCategories = [
    "홈케어",
    "식이관리",
    "행동",
    "영양제",
    "병원",
    "질병",
  ];

  useEffect(() => {
    const loadCDNs = async () => {
      if (typeof window !== "undefined" && !window.Quill) {
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
        if (editor) {
          editor.style.minHeight = "300px";
        }
      }
    };
    loadCDNs();
  }, []);

  // 로그인 사용자 정보 및 애완동물 목록 받아오기
  useEffect(() => {
    const fetchUserAndPets = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");
        const userData = await res.json();
        setAuthorName(userData.username || userData.name || null);

        const petRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/petinfo`, {
          credentials: "include",
        });
        if (petRes.ok) {
          const pets = await petRes.json();
          // pets 배열이 id, petName, imageUrl 포함한다고 가정
          setPetList(pets);
        } else {
          setPetList([]);
        }
      } catch (error) {
        setAuthorName(null);
        setPetList([]);
      }
    };
    fetchUserAndPets();
  }, []);

  const handleSaveContent = async () => {
    if (!authorName) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!category) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (category === "토픽" && !subCategory) {
      alert("서브카테고리를 선택해주세요.");
      return;
    }

    const content = quillRef.current?.root.innerHTML || "";

    const postData = {
      title,
      content,
      category,
      subCategory: category === "토픽" ? subCategory : null,
      authorName,
      petId: selectedPetId, // 선택한 애완동물 id 전달 (null 가능)
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("게시글이 성공적으로 등록되었습니다.");
        router.push("/community/total");
      } else {
        alert("게시글 등록 실패");
      }
    } catch (error) {
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-white text-black px-6 py-10 max-w-3xl mx-auto">
      <input type="hidden" name="authorName" value={authorName || ""} />

      {/* 제목 입력 */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full border border-gray-300 rounded px-4 py-2 mt-2"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 카테고리 선택 */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory("");
          }}
          className="w-full border border-gray-300 rounded px-4 py-2 mt-2"
        >
          <option value="">카테고리를 선택해주세요</option>
          <option value="토픽">토픽</option>
          <option value="Q&A">Q&A</option>
          <option value="일상">일상</option>
        </select>
      </div>

      {/* 서브카테고리 (토픽 선택 시) */}
      {category === "토픽" && (
        <div className="mb-6">
          <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
            서브카테고리
          </label>
          <select
            id="subCategory"
            name="subCategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mt-2"
          >
            <option value="">서브카테고리를 선택해주세요</option>
            {topicSubCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 애완동물 카드 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          애완동물 선택 (선택 사항)
        </label>

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

      {/* Quill 에디터 영역 */}
      <div className="mb-6">
        <div ref={editorRef} className="bg-white" />
      </div>

      {/* 등록 버튼 */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSaveContent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default WritePost;

// 애완동물 카드 컴포넌트
const PetCard = ({ pet, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border rounded-md p-3 w-24 text-center select-none
        ${selected ? "border-blue-500 bg-blue-100" : "border-gray-300 hover:border-blue-400"}`}
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
};

// Helper functions to load Quill scripts and styles
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
