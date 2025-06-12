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
  const [thumbnailSrc, setThumbnailSrc] = useState(null);

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const router = useRouter();

  const visibleCount = 5;

  // 서브카테고리 옵션
  const topicSubCategories = ["홈케어", "식이관리", "행동", "영양제", "병원", "질병"];
  const qnaSubCategories = ["훈련", "미용", "먹이", "입양", "기타"];

  function extractFirstImageSrc(html) {
    if (!html) return null;
    const div = document.createElement('div');
    div.innerHTML = html;
    const img = div.querySelector('img');
    if (!img) return null;

    const src = img.src;
    if (src.startsWith("/images/post")) {
      // 정적 리소스이면 그대로 사용
      return src;
    } else {
      // 그 외에는 백엔드 주소가 붙지 않은 상대 경로로 간주하고 baseUrl을 붙임
      const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;
      return src.startsWith("http") ? src : `${baseUrl}${src}`;
    }
  }

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

        quillRef.current.getModule("toolbar").addHandler("image", () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
              const formData = new FormData();
              formData.append("image", file);

              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/image-upload`, {
                  method: "POST",
                  body: formData,
                  credentials: "include",
                });

                if (!res.ok) throw new Error("이미지 업로드 실패");

                const { imageUrl } = await res.json();
                const range = quillRef.current.getSelection(true);
                const baseUrl = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;
                const fullUrl = `${baseUrl}${imageUrl}`;
                quillRef.current.insertEmbed(range.index, "image", fullUrl);
                quillRef.current.setSelection(range.index + 1);
              } catch (error) {
                alert("이미지 업로드 중 오류가 발생했습니다.");
              }
            }
          };
        });

        const editor = editorRef.current.querySelector(".ql-editor");
        if (editor) editor.style.minHeight = "300px";

        quillRef.current.on('text-change', () => {
          const html = quillRef.current.root.innerHTML;
          const firstImgSrc = extractFirstImageSrc(html);
          setThumbnailSrc(firstImgSrc);
        });
      }
    };
    loadCDNs();
  }, []);

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
    if (!authorName) return alert("로그인이 필요합니다.");
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!category) return alert("카테고리를 선택해주세요.");
    if ((category === "토픽" || category === "Q&A") && !subCategory) {
      return alert("서브카테고리를 선택해주세요.");
    }

    const content = quillRef.current?.root.innerHTML || "";

    // 본문 내용이 비어있거나 <p><br></p> 등 빈 내용일 경우 체크
    const plainText = quillRef.current?.getText().trim() || "";
    if (!plainText) return alert("본문 내용을 입력해주세요.");

    // 또는 아래처럼 HTML 태그만 있으면 비어있는지 체크 가능
    // if (!content || content === "<p><br></p>") return alert("본문 내용을 입력해주세요.");

    const postData = {
      title,
      content,
      category,
      subCategory: (category === "토픽" || category === "Q&A") ? subCategory : null,
      authorName,
      petId: selectedPetId,
    };

    try {
      const formData = new FormData();
      const postBlob = new Blob([JSON.stringify(postData)], {
        type: "application/json",
      });
      formData.append("post", postBlob);

      const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("게시글이 성공적으로 등록되었습니다.");
        router.push("/community/total");
      } else {
        const error = await response.json();
        alert(error?.error || "게시글 등록 실패");
      }
    } catch (error) {
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-white text-black px-6 py-10 max-w-3xl mx-auto">
      <input type="hidden" name="authorName" value={authorName || ""} />

      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
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

      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">카테고리</label>
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

      {(category === "토픽" || category === "Q&A") && (
        <div className="mb-6">
          <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">서브카테고리</label>
          <select
            id="subCategory"
            name="subCategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mt-2"
          >
            <option value="">서브카테고리를 선택해주세요</option>
            {(category === "토픽" ? topicSubCategories : qnaSubCategories).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">애완동물 선택 (선택 사항)</label>
        <div className="flex flex-wrap gap-3">
          {petList.slice(0, visibleCount).map((pet) => (
            <PetCard key={pet.id} pet={pet} selected={selectedPetId === pet.id} onClick={() => setSelectedPetId(pet.id)} />
          ))}
          {showMore &&
            petList.slice(visibleCount).map((pet) => (
              <PetCard key={pet.id} pet={pet} selected={selectedPetId === pet.id} onClick={() => setSelectedPetId(pet.id)} />
            ))}
        </div>
        {petList.length > visibleCount && (
          <button type="button" onClick={() => setShowMore(!showMore)} className="mt-2 text-blue-600 underline">
            {showMore ? "접기" : `+${petList.length - visibleCount} 더보기`}
          </button>
        )}
      </div>

      {thumbnailSrc && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">썸네일 미리보기:</p>
          <img src={thumbnailSrc} alt="썸네일 미리보기" className="w-40 h-40 object-cover rounded border" />
        </div>
      )}

      <div className="mb-6">
        <div ref={editorRef} className="bg-white" />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={handleSaveContent} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          등록
        </button>
      </div>
    </div>
  );
};

export default WritePost;

const PetCard = ({ pet, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer border rounded-md p-3 w-28 text-center select-none
      ${selected ? "border-blue-500 bg-blue-100" : "border-gray-300 hover:border-blue-400"}`}
  >
    {pet.imageUrl ? (
      <img src={pet.imageUrl} alt={pet.petName} className="mx-auto mb-2 h-16 w-16 object-cover rounded-full" />
    ) : (
      <div className="mx-auto mb-2 h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
        🐾
      </div>
    )}
    <div className="text-sm font-medium truncate">{pet.petName}</div>
    <div className="text-xs text-gray-600 mt-1 truncate">
      {pet.petType === "cat"
        ? "고양이"
        : pet.petType === "dog"
          ? "강아지"
          : "종 정보 없음"}
          <>
           {' / '}
          </>
      {pet.petGender === "female"
        ? "여아"
        : pet.petGender === "male"
          ? "남아"
          : "성별 정보 없음"}
    </div>


  </div>
);

// 스크립트/스타일 로더
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadStyle(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}
