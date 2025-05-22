"use client";
import React, { useEffect, useRef, useState } from "react";

const WritePost = () => {
  const [title, setTitle] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    // 필요한 CDN 스크립트 & CSS 로드
    const loadCDNs = async () => {
      if (typeof window !== "undefined" && window.$ === undefined) {
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
        await loadStyle("https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css");
        await loadScript("https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js");
        await loadStyle("https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css");
        await loadScript("https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js");
      }

      // Summernote 초기화
      if (window.$) {
        window.$(editorRef.current).summernote({
          height: 350,
          placeholder: "내용을 입력해주세요.",
          toolbar: [
            ["style", ["bold", "italic", "underline", "clear"]],
            ["font", ["strikethrough", "superscript", "subscript"]],
            ["fontsize", ["fontsize"]],
            ["color", ["color"]],
            ["para", ["ul", "ol", "paragraph"]],
            ["insert", ["link", "picture", "video"]],
            ["view", ["fullscreen", "codeview"]],
          ],
        });
      }
    };

    loadCDNs();
  }, []);

  const handleSaveContent = () => {
    const content = window.$(editorRef.current).summernote("code");
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
        <div ref={editorRef} />
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
