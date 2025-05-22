"use client";
import React, { useEffect, useRef, useState } from "react";

const WritePost = () => {
  const [title, setTitle] = useState("");
  const editorRef = useRef(null);
  const quillRef = useRef(null); // Quill 인스턴스 저장

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

  const handleSaveContent = () => {
    const content = quillRef.current?.root.innerHTML || "";
    console.log("제목:", title);
    console.log("내용:", content);
  };

  return (
    <div className="bg-white text-black px-6 py-10 max-w-3xl mx-auto">
      <div className="mb-6">
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-4 py-2"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <div ref={editorRef} className="bg-white" />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSaveContent}
          className="bg-gray-100 border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50"
        >
          임시저장
        </button>
        <button
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
