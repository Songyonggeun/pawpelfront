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
  const [isAuthChecked, setIsAuthChecked] = useState(false); 
  const [detailModalRecord, setDetailModalRecord] = useState(null); 

  const DEDUCTION_SCORES = {
    '심장': ["심장박동이 불규칙해요", "숨이 가빠요", "기절한 적이 있어요", "쉽게 지쳐요", "없어요"],
    '위/장': ["구토를 자주 해요", "설사를 자주 해요", "밥을 잘 안 먹거나 식욕이 줄었어요", "변 상태가 자주 물처럼 묽어요", "없어요"],
    '피부/귀': ["피부에서 냄새가 나요", "귀에서 분비물이 나와요", "피부가 빨개요", "가려워서 자주 긁어요", "없어요"],
    '신장/방광': ["소변을 자주 봐요", "소변 냄새가 강해요", "소변을 볼 때 힘들어하거나 자주 실수해요", "소변 색이 평소보다 진하거나 붉어요", "없어요"],
    '면역력/호흡기': ["기침을 자주 해요", "콧물이 나고 코를 자주 문질러요", "열이 있어요", "숨이 차서 헐떡거려요", "없어요"],
    '치아': ["입에서 냄새가 나요", "딱딱한 사료를 잘 못 씹어요", "이가 흔들리거나 빠졌어요", "잇몸이 붓고 피가 나요", "없어요"],
    '뼈/관절': ["다리를 절뚝거려요", "계단을 오르기 힘들어해요", "일어나기 힘들어해요", "산책을 싫어해요", "없어요"],
    '눈': ["눈꼽이 많이 껴요", "눈이 빨개요", "빛에 민감하게 반응해요", "눈이 뿌옇게 보여요", "없어요"],
    '행동': ["기운이 없어요", "짖는 횟수가 줄었어요", "숨는 일이 많아졌어요", "혼자 있으려고 해요", "없어요"],
    '체중 및 비만도': ["최근 강아지의 체중이 눈에 띄게 늘었거나 줄었어요", "허리 라인이 잘 안 보이거나 만져지지 않아요", "배를 만졌을 때 갈비뼈가 잘 느껴지지 않아요", "예전보다 덜 움직이고, 활동량이 줄었거나 쉽게 지쳐해요", "없어요"]
  };

  const getDeductionScore = (category, option) => {
    const cleanCat = category.replace(/^\d+\.\s*/, '').trim();
    const cleanOpt = option.trim();

    const list = DEDUCTION_SCORES[cleanCat] || [];
    const index = list.indexOf(cleanOpt);

    if (cleanOpt === '없어요') return 0;
    return index >= 0 ? 4 - index : 0;
  };

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

  const formatDate = (dateInput) => {
    const date = new Date(dateInput); // 문자열이어도 Date 객체로 변환됨
    if (isNaN(date)) return '날짜 형식 오류';
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
        router.push(`/myPage/consult/`);
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
            {pets.map((pet) => {
              const species = pet.petType?.toLowerCase() || '';
              const isCat = species.includes('cat') || species.includes('고양이') || species.includes('냥');
              const defaultImage = isCat ? '/images/profile/default_cat.jpeg' : '/images/profile/default_dog.jpeg';
              const isDefaultImage = !pet.imageUrl;

              return (
              <div
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className={`w-35 h-50 border border-gray-300 rounded-lg flex flex-col items-center justify-center shadow-sm cursor-pointer
                  ${selectedPetId === pet.id ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-100'}`}
              >
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-white flex items-center justify-center mb-5">
                    <img
                      src={
                        pet.thumbnailUrl || pet.imageUrl
                          ? (pet.thumbnailUrl || pet.imageUrl).startsWith("/images/profile/")
                              ? pet.thumbnailUrl || pet.imageUrl
                              : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/uploads${pet.thumbnailUrl || pet.imageUrl}`
                          : defaultImage
                      }
                      alt={pet.petName}
                      className={`w-full h-full ${
                        isDefaultImage
                          ? isCat
                            ? 'object-contain p-[10px] filter grayscale brightness-110 opacity-60'
                            : 'object-contain p-1 filter grayscale brightness-110 opacity-60'
                          : 'object-cover'
                      }`}
                    />
                  </div>
                  <div className="text-sm font-medium text-center">{pet.petName}</div>
<div className="text-[11px] text-gray-500 text-center mt-1">
  {pet.latestHealthCheckDate && pet.healthRecords?.length > 0 ? (
    <button
      onClick={() => {
        const sorted = pet.healthRecords.slice().sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt));
        const latest = sorted[0];
        setDetailModalRecord(latest);
      }}
      className="underline text-blue-500 hover:text-blue-600"
    >
      {formatDate(pet.latestHealthCheckDate)}
    </button>
  ) : (
    "건강체크 기록 없음"
  )}
</div>
                </div>
              )
            })}
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


      {detailModalRecord && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">건강검진 상세 결과</h3>
            <p className="mb-2"><strong>검진일:</strong> {formatDate(detailModalRecord.checkedAt)}</p>
            <p className="mb-4"><strong>총점:</strong> {detailModalRecord.totalScore}점 / <strong>결과:</strong> {detailModalRecord.resultStatus}</p>

            <table className="w-full table-auto text-sm border border-gray-300 [&_*]:border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1 text-left">항목</th>
                  <th className="border px-2 py-1 text-left">선택한 보기</th>
                  <th className="border px-2 py-1 text-center">점수</th>
                </tr>
              </thead>
              <tbody>
                {detailModalRecord.details?.map((detail, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1 align-top">{detail.category}</td>
                    <td className="border px-2 py-1 align-top whitespace-pre-line">
                      {detail.selectedOptions?.length > 0
                        ? detail.selectedOptions.map((opt) => `• ${opt}`).join('\n')
                        : '없음'}
                    </td>
                    <td className="border px-2 py-1 align-top text-center whitespace-pre-line">
                      {detail.selectedOptions?.length > 0
                        ? detail.selectedOptions
                            .map((opt) => `${getDeductionScore(detail.category, opt)}점`)
                            .join('\n')
                        : '0점'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-right">
              <button
                onClick={() => setDetailModalRecord(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
