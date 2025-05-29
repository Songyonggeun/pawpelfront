'use client';

import { useEffect, useState } from 'react';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [petData, setPetData] = useState({});
  const [searchType, setSearchType] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedInfoUserId, setExpandedInfoUserId] = useState(null);
  const [userDetailData, setUserDetailData] = useState({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        alert("회원 정보를 불러오지 못했습니다.");
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('회원을 삭제하시겠습니까?')) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 204) {
          setUsers(prev => prev.filter(user => user.id !== id));
          alert('회원이 삭제되었습니다.');
        } else if (res.status === 404) {
          alert('삭제할 회원을 찾을 수 없습니다.');
        } else {
          alert('회원 삭제에 실패했습니다.');
        }
      })
      .catch(() => alert('서버와 통신 중 오류가 발생했습니다.'));
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.socialName);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditName('');
  };

  const handleUpdate = () => {
    if (editingUserId === null) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${editingUserId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ socialName: editName }),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(updatedUser => {
        setUsers(prev =>
          prev.map(user => user.id === editingUserId ? updatedUser : user)
        );
        cancelEdit();
      })
      .catch(() => alert('회원 정보 수정 중 오류가 발생했습니다.'));
  };

  const togglePetInfo = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
      if (!petData[userId]) {
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${userId}/pets`, {
          credentials: 'include'
        })
          .then(res => res.json())
          .then(data => {
            setPetData(prev => ({ ...prev, [userId]: data }));
          });
      }
    }
  };

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
    } else {
      alert('잘못된 검색 조건입니다.');
      return;
    }

    fetch(url, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          alert('검색 결과가 배열이 아닙니다.');
          setUsers([]);
        } else {
          setUsers(data);
        }
      })
      .catch(() => alert('검색에 실패했습니다.'));
  };

  const toggleUserInfo = (userId) => {
    if (expandedInfoUserId === userId) {
      setExpandedInfoUserId(null);
    } else {
      setExpandedInfoUserId(userId);
      if (!userDetailData[userId]) {
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${userId}`, {
          credentials: 'include'
        })
          .then(res => res.json())
          .then(data => {
            setUserDetailData(prev => ({ ...prev, [userId]: data }));
          })
          .catch(() => {
            alert('회원 상세 정보를 불러오는 중 오류가 발생했습니다.');
          });
      }
    }
  };

  return (
    <div className="p-4 max-w-full mx-auto">
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
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-2 border">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    user.socialName
                  )}
                </td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.roles?.join(', ')}</td>
                <td className="p-2 border">
                  {user.created ? new Date(user.created).toLocaleDateString() : '정보 없음'}
                </td>
                <td className="p-2 border">
                  {editingUserId === user.id ? (
                    <>
                      <button onClick={handleUpdate} className="text-green-600 mr-2">저장</button>
                      <button onClick={cancelEdit} className="text-gray-600">취소</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(user)} className="text-blue-600 mr-2">수정</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 mr-2">삭제</button>
                      <button onClick={() => togglePetInfo(user.id)} className="text-indigo-600 mr-2">
                        {expandedUserId === user.id ? '펫 닫기' : '펫 보기'}
                      </button>
                      <button onClick={() => toggleUserInfo(user.id)} className="text-green-600">
                        {expandedInfoUserId === user.id ? '정보 닫기' : '정보 보기'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {/* 펫 정보 행 */}
            {users.map(user => (
              expandedUserId === user.id && petData[user.id] && (
                <tr key={`${user.id}-pets`} className="bg-white border-t">
                  <td colSpan={6} className="p-3 text-sm text-gray-700">
                    <strong>펫 정보:</strong>{' '}
                    {petData[user.id].length > 0
                      ? petData[user.id].map((pet, index) => (
                          <span key={index}>{pet.petName} ({pet.petType}, {pet.petAge}살){index < petData[user.id].length - 1 ? ', ' : ''}</span>
                        ))
                      : '등록된 펫이 없습니다.'}
                  </td>
                </tr>
              )
            ))}

            {/* 상세 정보 행 */}
            {users.map(user => (
              expandedInfoUserId === user.id && userDetailData[user.id] && (
                <tr key={`${user.id}-info`} className="bg-white border-t">
                  <td colSpan={6} className="p-3 text-sm text-gray-800">
                    <div className="space-y-1">
                      <p><strong>전화번호:</strong> {userDetailData[user.id].phoneNumber || '정보 없음'}</p>
                      <p><strong>생년월일:</strong> {userDetailData[user.id].birthDate || '정보 없음'}</p>
                      {userDetailData[user.id].attr && Object.keys(userDetailData[user.id].attr).length > 0 && (
                        <div>
                          <strong>속성:</strong>
                          <ul className="list-disc ml-5 text-gray-600">
                            {Object.entries(userDetailData[user.id].attr).map(([key, value]) => (
                              <li key={key}>{key}: {String(value)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
