'use client'; // 이 파일이 클라이언트 컴포넌트임을 명시 (Next.js App Router에서 필요)

import { useEffect, useState } from 'react'; // React의 상태 및 생명주기 훅 사용

export default function UserPage() {
  // 사용자 목록 상태
const [users, setUsers] = useState([]);

  // 수정 중인 사용자 ID
const [editingUserId, setEditingUserId] = useState(null);

  // 수정 중인 사용자 이름
const [editName, setEditName] = useState('');

  // 확장된 사용자 ID (펫 정보 표시 여부 판단용)
const [expandedUserId, setExpandedUserId] = useState(null);

  // 사용자별 펫 정보 저장 객체
const [petData, setPetData] = useState({});

  // 페이지 로드 시 사용자 목록 가져오기
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user`)
    .then(res => res.json())
      .then(data => setUsers(data)); // 가져온 사용자 목록 저장
}, []);

  // 사용자 삭제 함수
const handleDelete = (id) => {
    // 삭제 확인창 표시
    const confirmed = window.confirm('회원을 삭제하시겠습니까?');
    if (!confirmed) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${id}`, { method: 'DELETE' })
      .then(() => {
        setUsers(prev => prev.filter(user => user.id !== id));
    });
};

  // 이름 수정 시작
  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingUserId(null);
    setEditName('');
  };

  // 수정 저장
  const handleUpdate = () => {
    if (editingUserId === null) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${editingUserId}`, {
      method: 'PATCH', //  PATCH로 수정
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName }), // 수정할 이름 전송
    })
      .then(res => res.json())
      .then(updatedUser => {
        // 수정된 사용자 정보로 목록 갱신
        setUsers(prev =>
          prev.map(user => user.id === editingUserId ? updatedUser : user)
        );
        cancelEdit(); // 수정 모드 종료
      });
  };

  // 펫 정보 보기/닫기 토글
  const togglePetInfo = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null); // 이미 열려있으면 닫기
    } else {
      setExpandedUserId(userId); // 새로운 사용자 선택

      // 해당 사용자 펫 정보가 없으면 API 요청
      if (!petData[userId]) {
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${userId}/pets`)
          .then(res => res.json())
          .then(data => {
            setPetData(prev => ({ ...prev, [userId]: data })); // 펫 데이터 저장
          });
      }
    }
  };

  //  검색 기능
  const handleSearch = () => {
    if (!searchType || !searchKeyword.trim()) {
      alert('검색 조건과 키워드를 입력해주세요.');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/search?${searchType}=${searchKeyword}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => alert('검색에 실패했습니다.'));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* 페이지 제목 */}
      <h1 className="text-2xl font-bold mb-4">회원 관리</h1>

      {/* 사용자 목록 렌더링 */}
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user.id} className="bg-gray-100 p-3 rounded shadow">
            {/* 수정 모드일 때 입력창 표시 */}
            {editingUserId === user.id ? (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)} // 이름 입력값 갱신
                  className="border p-1 rounded flex-1"
                />
                <button onClick={handleUpdate} className="text-green-600">저장</button>
                <button onClick={cancelEdit} className="text-gray-600">취소</button>
              </div>
            ) : (
              <>
                {/* 사용자 기본 정보 및 액션 버튼 */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span><strong>이름:</strong> {user.name}</span>
                    <span className="text-sm text-gray-700">
                      <strong>아이디:</strong> {user.userId}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(user)} className="text-blue-600">이름 수정</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600">회원 삭제</button>
                    <button onClick={() => togglePetInfo(user.id)} className="text-indigo-600">
                      {expandedUserId === user.id ? '펫 정보 닫기' : '펫 정보 보기'}
                    </button>
                  </div>
                </div>

                {/* 확장된 사용자에 대해 펫 정보 표시 */}
                {expandedUserId === user.id && (
                  <div className="mt-2 pl-4 border-l-4 border-indigo-300 bg-white rounded p-2">
                    {/* 로딩 또는 데이터 유무에 따른 조건 렌더링 */}
                    {petData[user.id] ? (
                      petData[user.id].length > 0 ? (
                        <ul className="list-disc ml-4 text-sm text-gray-800">
                          {/* 펫 목록 표시 */}
                          {petData[user.id].map((pet, index) => (
                            <li key={index}>
                              <strong>{pet.name}</strong> ({pet.type}, {pet.age}살)
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">등록된 펫 정보가 없습니다.</p>
                      )
                    ) : (
                      <p className="text-sm text-gray-400">펫 정보를 불러오는 중...</p>
                    )}
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
