'use client';

import { useEffect, useState } from 'react';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editRoles, setEditRoles] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [petData, setPetData] = useState({});
  const [searchType, setSearchType] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 사용자 데이터 가져오기
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => alert("회원 정보를 불러오지 못했습니다."));
  }, []);

  // 회원 삭제 처리
  const handleDelete = (id) => {
    if (!window.confirm('회원을 삭제하시겠습니까?')) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 204) {
          setUsers((prev) => prev.filter((user) => user.id !== id));
          alert('회원이 삭제되었습니다.');
        } else {
          alert('회원 삭제에 실패했습니다.');
        }
      })
      .catch(() => alert('서버와 통신 중 오류가 발생했습니다.'));
  };

  // 수정 시작
  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditRoles(user.roles || []);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingUserId(null);
    setEditRoles([]);
  };

  // 사용자 권한 수정
  const handleUpdate = async () => {
    if (editingUserId === null) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/roles/${editingUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roles: editRoles }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || '권한 수정 실패');
      }

      const updatedUser = await res.json();
      setUsers((prev) => prev.map((user) => user.id === editingUserId ? updatedUser : user));
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert('권한 수정 중 오류가 발생했습니다.');
    }
  };

  // 펫 정보 토글
  const togglePetInfo = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
      if (!petData[userId]) {
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${userId}/pets`, {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => setPetData((prev) => ({ ...prev, [userId]: data })));
      }
    }
  };

  // 검색 처리
  const handleSearch = () => {
    if (!searchType || !searchKeyword.trim()) {
      alert('검색 조건과 키워드를 입력해주세요.');
      return;
    }

    let url = '';
    if (searchType === 'social') {
      url = `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/social?socialName=${encodeURIComponent(searchKeyword)}`;
    } else if (searchType === 'email') {
      url = `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/email?email=${encodeURIComponent(searchKeyword)}`;
    } else if (searchType === 'name') {
      url = `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/name?name=${encodeURIComponent(searchKeyword)}`;
    }

    fetch(url, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => alert('검색에 실패했습니다.'));
  };

  return (
    <div className="p-4 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">회원 관리</h1>

      <div className="flex items-center gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
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
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          검색
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">이름</th>
              <th className="p-2 border">아이디</th>
              <th className="p-2 border">이메일</th>
              <th className="p-2 border">권한</th>
              <th className="p-2 border">가입일</th>
              <th className="p-2 border">관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2 border">{user.socialName}</td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  {editingUserId === user.id ? (
                    <div className="flex gap-2">
                      {['USER', 'ADMIN'].map((role) => (
                        <label key={role} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={editRoles.includes(role)}
                            onChange={(e) => {
                              setEditRoles((prev) =>
                                e.target.checked
                                  ? [...prev, role]
                                  : prev.filter((r) => r !== role)
                              );
                            }}
                          />
                          {role}
                        </label>
                      ))}
                    </div>
                  ) : (
                    user.roles?.join(', ')
                  )}
                </td>
                <td className="p-2 border">
                  {user.created
                    ? new Date(user.created).toLocaleDateString()
                    : '정보 없음'}
                </td>
                <td className="p-2 border">
                  {editingUserId === user.id ? (
                    <>
                      <button onClick={handleUpdate} className="text-green-600 mr-2">
                        저장
                      </button>
                      <button onClick={cancelEdit} className="text-gray-600">
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(user)}
                        className="text-blue-600 mr-2"
                      >
                        권한 수정
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 mr-2"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => togglePetInfo(user.id)}
                        className="text-indigo-600 mr-2"
                      >
                        {expandedUserId === user.id ? '펫 닫기' : '펫 보기'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
