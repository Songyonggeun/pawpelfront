"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";// useRouter 훅 추가

const WritePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); // 카테고리 상태 추가
  const editorRef = useRef(null);
  const quillRef = useRef(null); // Quill 인스턴스 저장
  const router = useRouter(); // useRouter 훅 사용

  useEffect(() => {
    const loadCDNs = async () => {
      if (typeof window !== "undefined" && !window.Quill) {
        await loadStyle("https://cdn.quilljs.com/1.3.6/quill.snow.css");
        await loadScript("https://cdn.quilljs.com/1.3.6/quill.min.js");
      }

      // 중복 초기화 방지
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

        // 내용 입력 칸 높이 늘리기
        const editor = editorRef.current.querySelector(".ql-editor");
        if (editor) {
          editor.style.minHeight = "300px"; // 필요 시 더 늘릴 수 있음
        }
      }
    };

    loadCDNs();
  }, []);

  const handleSaveContent = async () => {
    const content = quillRef.current?.root.innerHTML || "";
    console.log("제목:", title);
    console.log("카테고리:", category);
    console.log("내용:", content);

    // 요청할 JSON 데이터 준비
    const postData = {
      title,
      content,
      category,
    };

    // fetch를 사용하여 JSON 형식으로 서버에 POST 요청 보내기
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SPRING_SERVER_URL + '/api/posts', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData), // JSON 데이터 전송
        credentials: "include",
      });

      if (response.ok) {
        alert("게시글이 성공적으로 등록되었습니다."); // 성공 시 알림
        router.push("/community/total"); // 작성 완료 후 페이지 이동
      } else {
        alert("게시글 등록 실패"); // 실패 시 알림
      }
    } catch (error) {
      console.error("게시글 등록 중 오류 발생:", error);
      alert("게시글 등록 중 오류 발생"); // 오류 시 알림
    }
  };

  return (
    <div className="bg-white text-black px-6 py-10 max-w-3xl mx-auto">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          type="text"
          id="title" // id 추가
          name="title" // name 값 추가
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
          id="category" // id 추가
          name="category" // name 값 추가
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mt-2"
        >
          <option value="">카테고리를 선택해주세요</option>
          <option value="health-topic">건강토픽</option>
          <option value="q-and-a">질문과 답</option>
          <option value="health-daily">건강일상</option>
          <option value="know-how">노하우</option>
          <option value="psychology-care">심리케어</option>
        </select>
      </div>

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
