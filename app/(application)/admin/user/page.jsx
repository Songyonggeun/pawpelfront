'use client';

import { useEffect, useState } from 'react';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [petData, setPetData] = useState({});
  const [searchType, setSearchType] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedInfoUserId, setExpandedInfoUserId] = useState(null);
  const [userDetailData, setUserDetailData] = useState({});
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [showPetModal, setShowPetModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setCurrentPage(1); // 검색 시 페이지 초기화
      })
      .catch(() => {
        alert("회원 정보를 불러오지 못했습니다.");
      });
  };

  const openRoleModal = (user) => {
    setSelectedUserId(user.id);
    setSelectedRole(user.roles?.[0] || 'USER');
    setShowRoleModal(true);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUserId(null);
    setSelectedRole('');
  };

  const openPetModal = (userId) => {
    setExpandedUserId(userId);
    setShowPetModal(true);
    if (!petData[userId]) {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${userId}/pets`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setPetData(prev => ({ ...prev, [userId]: data }));
        });
    }
  };

  const closePetModal = () => {
    setShowPetModal(false);
    setExpandedUserId(null);
  };

  const openInfoModal = (userId) => {
    setExpandedInfoUserId(userId);
    setShowInfoModal(true);
    if (!userDetailData[userId]) {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/${userId}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setUserDetailData(prev => ({ ...prev, [userId]: data }));
        });
    }
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setExpandedInfoUserId(null);
  };

  const handleRoleChange = () => {
    if (!selectedUserId || !selectedRole) return;

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/roles/${selectedUserId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId: selectedUserId,
        roles: [selectedRole]
      }),
    })
      .then(res => res.ok ? res.text() : Promise.reject('권한 변경 실패'))
      .then(() => fetchUsers())
      .then(() => {
        closeRoleModal();
        alert('권한이 수정되었습니다.');
      })
      .catch((error) => {
        console.error('권한 수정 중 오류:', error);
        alert('권한 수정 중 오류가 발생했습니다.');
        closeRoleModal();
      });
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
        setUsers(Array.isArray(data) ? data : []);
        setCurrentPage(1);
      })
      .catch(() => alert('검색에 실패했습니다.'));
  };

  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">회원 관리</h1>

      <div className="flex justify-center items-center gap-2 mb-4">
        <select className="border p-2 rounded w-32" value={searchType} onChange={e => setSearchType(e.target.value)}>
          <option value="">검색 조건</option>
          <option value="social">이름</option>
          <option value="email">이메일</option>
          <option value="name">아이디</option>
        </select>
        <input
          type="text"
          className="border p-2 rounded w-64"
          placeholder="검색어 입력"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-3 py-2 rounded">검색</button>
      </div>

      <table className="w-full text-xs table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-300 border-b border-gray-200">
            <th className="px-3 py-2 text-center">이름</th>
            <th className="px-3 py-2 text-center">아이디</th>
            <th className="px-3 py-2 text-center">이메일</th>
            <th className="px-3 py-2 text-center">권한</th>
            <th className="px-3 py-2 text-center">가입일</th>
            <th className="px-3 py-2 text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(user => (
            <tr key={user.id} className="border-t border-gray-200">
              <td className="px-3 py-2 text-center">{user.socialName}</td>
              <td className="px-3 py-2 text-center">{user.name}</td>
              <td className="px-3 py-2 text-center">{user.email}</td>
              <td className="px-3 py-2 text-center">{user.roles?.join(', ')}</td>
              <td className="px-3 py-2 text-center">{user.created ? new Date(user.created).toLocaleDateString() : '정보 없음'}</td>
              <td className="px-3 py-2 text-center">
                <button onClick={() => openRoleModal(user)} className="text-purple-600 mr-2">권한수정</button>
                <button onClick={() => openPetModal(user.id)} className="text-indigo-600 mr-2">펫 보기</button>
                <button onClick={() => openInfoModal(user.id)} className="text-green-600">정보 보기</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 UI */}
      <div className="flex justify-center mt-6 space-x-2 text-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 border rounded disabled:opacity-30"
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span className="px-3 py-1 text-gray-600">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 border rounded disabled:opacity-30"
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>


      {/* 모달들 유지 */}
      {showRoleModal && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">권한 수정</h2>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full border p-2 rounded mb-4">
              <option value="USER">USER</option>
              <option value="VET">VET</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={closeRoleModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">취소</button>
              <button onClick={handleRoleChange} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">확인</button>
            </div>
          </div>
        </div>
      )}

      {showPetModal && expandedUserId && petData[expandedUserId] && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-lg bg-white p-6 rounded shadow-lg overflow-y-auto max-h-[70vh]">
          <h2 className="text-xl font-semibold mb-4">펫 정보</h2>
          {petData[expandedUserId].length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {petData[expandedUserId].map((pet, index) => (
                <div key={pet.id ?? `${pet.petName}-${index}`} className="flex flex-col items-center border p-2 rounded w-36">
                  {pet.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${pet.thumbnailUrl || pet.imageUrl}`}
                      alt={pet.petName}
                      className="w-20 h-20 object-cover rounded-full mb-2"
                      onError={(e) => { e.currentTarget.src = "/default-pet.png"; }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-400 rounded-full mb-2">이미지 없음</div>
                  )}
                  <span className="text-sm font-medium text-center">{pet.petName}</span>
                  <span className="text-xs text-gray-600 text-center">({pet.petBreed},{(2025 - pet.petAge)}살)</span>
                </div>
              ))}
            </div>
          ) : (
            <p>등록된 펫이 없습니다.</p>
          )}
          <div className="flex justify-end mt-4">
            <button onClick={closePetModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">닫기</button>
          </div>
        </div>
      )}

      {showInfoModal && expandedInfoUserId && userDetailData[expandedInfoUserId] && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-lg bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-4">회원 상세 정보</h2>
          <p><strong>전화번호:</strong> {userDetailData[expandedInfoUserId].phoneNumber || '정보 없음'}</p>
          <p><strong>생년월일:</strong> {userDetailData[expandedInfoUserId].birthDate || '정보 없음'}</p>
          <p><strong>포인트:</strong> {userDetailData[expandedInfoUserId].point || '정보 없음'}</p>
          {userDetailData[expandedInfoUserId].attr && Object.keys(userDetailData[expandedInfoUserId].attr).length > 0 && (
            <div>
              <strong>속성:</strong>
              <ul className="list-disc ml-5 text-gray-600">
                {Object.entries(userDetailData[expandedInfoUserId].attr).map(([key, value]) => (
                  <li key={key}>{key}: {String(value)}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button onClick={closeInfoModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
