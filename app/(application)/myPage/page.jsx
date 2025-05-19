import React from 'react';

const MyPage = () => {
  const userInfo = {
    username: '귀여운홍삼12',
    healthCheckCount: 1,
    insurance: false,
    pets: [
      { id: 111, name: '고양이' }
    ]
  };

  const menuItems = [
    { title: '회원 정보 수정' },
    { title: '반려동물 관리' },
    { title: '건강 체크 기록' },
    { title: '상담 내역' },
  ];

  return (
    <div className="flex max-w-7xl mx-auto py-10 px-6 gap-10">
      {/* Sidebar 메뉴 */}
      <aside className="w-60">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2" />
          <div className="text-center font-semibold">{userInfo.username}</div>
        </div>
        <nav>
          <ul className="space-y-3">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* 요약 카드 */}
        <div className="bg-gray-100 p-6 rounded-xl grid grid-cols-2 text-center gap-4 shadow-sm mb-10">
          <div>
            <div className="text-sm text-gray-500">건강체크</div>
            <div className="text-lg font-bold">{userInfo.healthCheckCount}회</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">다음 예방접종까지 남은 날짜</div>
            <div className="text-lg font-bold">D-{userInfo.consultTickets}</div>
          </div>
        </div>

        {/* 반려동물 카드 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">나의 반려동물</h2>
            <button className="text-blue-500 text-sm hover:underline">+ 반려동물 등록</button>
          </div>
          <div className="flex gap-4">
            {userInfo.pets.map((pet) => (
              <div
                key={pet.id}
                className="w-32 h-40 border border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white shadow-sm"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
                <div className="text-sm font-medium">{pet.name}</div>
                <div className="text-xs text-gray-500 mt-1">ID: {pet.id}</div>
              </div>
            ))}
            {/* 프로필 추가 */}
            <div className="w-32 h-40 border border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
              <span className="text-2xl text-gray-400">+</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyPage;
