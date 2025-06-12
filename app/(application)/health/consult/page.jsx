"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "종합 관리", "간담낭", "감염", "구강", "근골격", "내분비", "뇌신경",
  "면역매개", "비뇨기", "생식기", "소화기", "심혈관", "안구", "종양", "피부", "호흡기", "기타"
];

export default function VetConsultForm() {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [consultCategory, setConsultCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false); // ✅ 추가

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        const petsWithCheck = (data.pets || []).map((pet) => {
          const sortedRecords = (pet.healthRecords || []).sort(
            (a, b) => new Date(b.checkedAt) - new Date(a.checkedAt)
          );
          const latestCheck = sortedRecords[0] || null;
          return {
            ...pet,
            latestHealthCheckDate: latestCheck ? new Date(latestCheck.checkedAt) : null,
          };
        });

        setPets(petsWithCheck);
        setIsAuthChecked(true); // ✅ 로그인 성공 시 렌더링 허용
      } catch (err) {
        router.replace("/login"); // ✅ 로그인 실패 시 로그인 페이지로 이동
      }
    };
    fetchPets();
  }, []);

  const formatDate = (date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleSubmit = async () => {
    if (!selectedPetId || !consultCategory || !title.trim() || !content.trim()) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    const payload = {
      title,
      content,
      subCategory: consultCategory,
      petId: selectedPetId,
      status: 'PENDING',
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/consult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (text.startsWith("<!DOCTYPE html")) {
        alert("⚠️ 서버 오류 페이지가 반환되었습니다.\n다시 시도하거나 관리자에게 문의하세요.");
        return;
      }

      if (!res.ok) {
        alert("❌ 서버 오류 발생: " + text);
        return;
      }

      try {
        const data = JSON.parse(text);
        router.push(`/consult/read?id=${data.id}`);
      } catch (err) {
        alert("서버 응답을 JSON으로 변환할 수 없습니다:\n\n" + text);
      }

    } catch (err) {
      alert("요청 도중 오류가 발생했습니다.");
    }
  };

  // ✅ 인증 확인 안 된 경우 렌더링 방지
  if (!isAuthChecked) return null;

  return (
    <div className="max-w-xl mx-auto p-4 text-sm">
      <h2 className="text-center text-base font-semibold mb-4">상담 신청</h2>

      <div className="mb-4">
        <label className="text-sm">반려동물</label>
        {pets.length === 0 ? (
          <div className="text-sm text-red-500">반려동물이 없습니다.</div>
        ) : (
          <div className="flex gap-4 flex-wrap justify-center">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className={`w-32 h-32 border rounded-lg flex flex-col items-center justify-center shadow-sm cursor-pointer
                  ${selectedPetId === pet.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
                <div className="text-sm font-medium text-center">{pet.petName}</div>
                <div className="text-[11px] text-gray-500 text-center mt-1">
                  {pet.latestHealthCheckDate
                    ? `${formatDate(pet.latestHealthCheckDate)}`
                    : "건강체크 기록 없음"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="text-sm">상담 주제 1개를 선택해주세요</label>
        <select
          value={consultCategory}
          onChange={(e) => setConsultCategory(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="" disabled>상담 주제 선택</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="text-sm">상담의 제목과 내용을 적어주세요.</label>
        <input
          type="text"
          placeholder="제목을 입력해주세요."
          maxLength={40}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="내용을 입력해주세요."
          maxLength={1000}
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm"
      >
        상담 신청하기
      </button>

      <ul className="text-xs text-gray-500 mt-4 list-disc pl-4">
        <li>최초 답변 후 추가 답변은 1회로 제한됩니다.</li>
        <li>보다 빠르고 정확한 답변을 위해 구체적으로 질문을 작성해주세요.</li>
        <li>상담이 시작되면 수정이나 삭제는 불가능합니다. 신중하게 작성해주세요.</li>
      </ul>
    </div>
  );
}
