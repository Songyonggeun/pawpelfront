// app/vet-profile/page.jsx
import Image from 'next/image';
import React from 'react';

export default function VetProfilePage() {
  return (
    <div className="flex flex-col lg:flex-row bg-white p-8 max-w-screen-xl mx-auto">
      {/* Left: Text Content */}
      <div className="lg:w-1/2 space-y-6">
        <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          동물의료센터 노원점
        </div>

        <h1 className="text-3xl font-bold">
          김닥터 <span className="font-medium text-gray-700">대표원장</span>
        </h1>

        <br/>
        <div>
          <h2 className="text-xl font-semibold border-b pb-2 mb-2">학력 및 경력</h2>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>- △△대학교 수의과대학 졸업</li>
            <li>- △△대학교 수의외과학 석사 수료</li>
            <li>- 現 베스트펫 동물병원 내과 과장</li>
            <li>- 現 반려동물 행동클리닉 협회 자문위원</li>
            <li>- 現 △△동물암센터 대표원장</li>
            <li>- 現 반려동물 심초음파 연구소 연구원</li>
            <li>- 前 △△대학교 수의학과 겸임교수</li>
            <li>- 前 한국동물심장학회 정회원</li>
            <li>- 前 주식회사 Pawple 대표이사</li>
            <li>- 前 Pawple 동물병원 원장</li>
          </ul>
        </div>
      </div>

      {/* Right: Image */}
      <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
        <Image
          src="/images/vet-consult.jpg" // public 폴더 기준 경로
          alt="대표원장 김닥터"
          width={400}
          height={500}
          className="rounded-lg shadow-lg object-cover"
        />
      </div>
    </div>
  );
}
