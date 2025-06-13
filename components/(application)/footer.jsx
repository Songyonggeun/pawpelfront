
export default function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-gray-600 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0 md:items-center">
        {/* 왼쪽: 로고 및 회사 정보 */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Lifet Logo" className="w-6 h-6" />
            <span className="text-blue-500 font-bold text-lg">Lifet</span>
          </div>
          <div className="text-xs space-y-0.5">
            <p>상호: 주식회사 일레븐리터 | 대표자: 김광현 | 개인정보취급담당자: 김광현</p>
            <p>사업자등록번호: 896-81-02510</p>
            <p>주소: 서울특별시 강남구 역삼로160, 8층 801호</p>
            <p>통신판매업신고: 제2024-서울강남-07247호</p>
            <p>© Elevenliter Inc. All Rights Reserved</p>
          </div>
        </div>

        {/* 중간: 링크 */}
        <div className="space-y-1 text-xs">
          <p className="font-semibold">라이펫 소개</p>
          <div className="flex flex-wrap gap-x-4">
            <a href="#" className="hover:underline">개인정보처리방침</a>
            <a href="#" className="hover:underline">이용약관</a>
            <a href="#" className="hover:underline">의견접수</a>
          </div>
        </div>

        {/* 오른쪽: 고객센터 */}
        <div className="text-xs space-y-1">
          <p className="font-semibold text-gray-800">고객센터</p>
          <p className="text-lg text-black font-bold">070-4519-6419</p>
          <p>평일 11:00 ~ 18:00 | 점심시간 13:00 ~ 14:00<br />(주말/공휴일 휴무)</p>
          <p>문의 메일: <a href="mailto:official@elevenliter.com" className="underline">official@elevenliter.com</a></p>
        </div>

        {/* SNS 아이콘 */}
        <div className="flex space-x-2">
          <a href="#" className="w-8 h-8 flex items-center justify-center border rounded-full">
            <img src="/icons/instagram.svg" alt="Instagram" className="w-4 h-4" />
          </a>
          <a href="#" className="w-8 h-8 flex items-center justify-center border rounded-full">
            <img src="/icons/kakao.svg" alt="Kakao" className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
