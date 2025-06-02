'use client';
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const WritePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState(""); // 서브카테고리 상태 추가
  const [authorName, setAuthorName] = useState(null); // 작성자 상태 추가
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const router = useRouter();

  // 서브카테고리 옵션 배열 (토픽일 때만 보임)
  const topicSubCategories = [
    "영양제",
    "홈케어",
    "식이관리",
    "행동",
    "병원",
    "투약",
    "신부전",
    "슬개골탈구",
    "췌장",
  ];

  useEffect(() => {
    // Quill 에디터 로딩
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

  // 로그인 사용자 정보 받아오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("로그인 사용자 정보를 불러올 수 없습니다.");
        const userData = await res.json();
        setAuthorName(userData.username || userData.name || null);
      } catch (error) {
        setAuthorName(null);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSaveContent = async () => {
    if (!authorName) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!title) {
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
      subCategory: category === "토픽" ? subCategory : null, // 토픽일 때만 포함
      authorName,
    };

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SPRING_SERVER_URL + "/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
      alert("게시글 등록 중 오류 발생");
    }
  };

  return (
    <div className="bg-white text-black px-6 py-10 max-w-3xl mx-auto">
      <input type="hidden" name="authorName" value={authorName || ""} />

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
            setSubCategory(""); // 카테고리 변경 시 서브카테고리 초기화
          }}
          className="w-full border border-gray-300 rounded px-4 py-2 mt-2"
        >
          <option value="">카테고리를 선택해주세요</option>
          <option value="토픽">토픽</option>
          <option value="Q&A">Q&A</option>
          <option value="일상">일상</option>
        </select>
      </div>

      {category === "토픽" && (
        <div className="mb-6">
          <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
            서브카테고리 (토픽 선택 시)
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

      <div className="mb-6">
        <div ref={editorRef} className="bg-white" />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSaveContent}
          className="bg-gray-100 border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50"
        >
          임시저장
        </button>
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

// Helper functions
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
