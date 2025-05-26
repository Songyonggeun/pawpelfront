
'use client';

import { useEffect, useState } from 'react';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [petData, setPetData] = useState({});

  //  검색 상태
  const [searchType, setSearchType] = useState(''); // social, email, name
  const [searchKeyword, setSearchKeyword] = useState('');

  // 전체 사용자 목록 가져오기 (초기 렌더 시)
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/user`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleDelete = (id) => {
    const confirmed = window.confirm('회원을 삭제하시겠습니까?');
    if (!confirmed) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/user/${id}`, { method: 'DELETE' })
      .then(() => {
        setUsers(prev => prev.filter(user => user.id !== id));
      });
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditName('');
  };

  const handleUpdate = () => {
    if (editingUserId === null) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/user/${editingUserId}`, {
      method: 'PATCH', //  PATCH로 수정
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName }),
    })
      .then(res => res.json())
      .then(updatedUser => {
        setUsers(prev =>
          prev.map(user => user.id === editingUserId ? updatedUser : user)
        );
        cancelEdit();
      });
  };

  const togglePetInfo = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
      if (!petData[userId]) {
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/user/${userId}/pets`)
          .then(res => res.json())
          .then(data => {
            setPetData(prev => ({ ...prev, [userId]: data }));
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

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/user/search?${searchType}=${searchKeyword}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => alert('검색에 실패했습니다.'));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">회원 관리</h1>

      <div className="flex items-center gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
        >
          <option value="">검색 조건</option>
          <option value="social">이름</option>
          <option value="email">이메일</option>
          <option value="name">아이디</option>
        </select>
        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="검색어 입력"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          검색
        </button>
      </div>

      <ul className="space-y-4">
        {users.map(user => (
          <li key={user.id} className="bg-gray-100 p-3 rounded shadow">
            {editingUserId === user.id ? (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border p-1 rounded flex-1"
                />
                <button onClick={handleUpdate} className="text-green-600">저장</button>
                <button onClick={cancelEdit} className="text-gray-600">취소</button>
              </div>
            ) : (
              <>
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

                {expandedUserId === user.id && (
                  <div className="mt-2 pl-4 border-l-4 border-indigo-300 bg-white rounded p-2">
                    {petData[user.id] ? (
                      petData[user.id].length > 0 ? (
                        <ul className="list-disc ml-4 text-sm text-gray-800">
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
