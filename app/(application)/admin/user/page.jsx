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

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user/roles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId: selectedUserId,
        roles: [selectedRole]
      }),
    })
      .then(async res => {
        if (!res.ok) throw new Error('권한 변경 실패');
        // 204 또는 본문이 비어 있으면 json 파싱 생략
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then(() => {
        return fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user`, {
          credentials: 'include'
        });
      })
      .then(async res => {
        if (!res.ok) throw new Error('회원 목록 불러오기 실패');
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        setUsers(Array.isArray(data) ? data : []);
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
    <div className="flex-1 overflow-x-auto">

      <h1 className="text-2xl font-bold mb-4">회원 관리</h1>

      <div className="flex justify-center items-center gap-2 mb-4">
        <select
          className="border p-2 rounded w-32"
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
          className="border p-2 rounded w-64"
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

      
      <table className="w-full text-xs table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-300 border-b border-gray-200">
            <th className="px-3 py-2 text-center whitespace-nowrap">이름</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">아이디</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">이메일</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">권한</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">가입일</th>
            <th className="px-3 py-2 text-center whitespace-nowrap">관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t border-gray-200">
              <td className="px-3 py-2 text-center whitespace-nowrap">{user.socialName}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{user.name}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{user.email}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{user.roles?.join(', ')}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">
                {user.created ? new Date(user.created).toLocaleDateString() : '정보 없음'}
              </td>
              <td className="px-3 py-2 text-center whitespace-nowrap">
                <button onClick={() => openRoleModal(user)} className="text-purple-600 mr-2">권한수정</button>
                <button onClick={() => openPetModal(user.id)} className="text-indigo-600 mr-2">펫 보기</button>
                <button onClick={() => openInfoModal(user.id)} className="text-green-600">정보 보기</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 권한 수정 모달 */}
      {showRoleModal && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">권한 수정</h2>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
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

      {/* 펫 정보 모달 */}
      {showPetModal && expandedUserId && petData[expandedUserId] && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-lg bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-4">펫 정보</h2>
          <p>
            {petData[expandedUserId].length > 0 ?
              petData[expandedUserId].map((pet, index) => (
                <span key={index}>{pet.petName} ({pet.petType}, {pet.petAge}살){index < petData[expandedUserId].length - 1 ? ', ' : ''}</span>
              )) : '등록된 펫이 없습니다.'}
          </p>
          <div className="flex justify-end mt-4">
            <button onClick={closePetModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">닫기</button>
          </div>
        </div>
      )}

      {/* 상세 정보 모달 */}
      {showInfoModal && expandedInfoUserId && userDetailData[expandedInfoUserId] && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-lg bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-4">회원 상세 정보</h2>
          <p><strong>전화번호:</strong> {userDetailData[expandedInfoUserId].phoneNumber || '정보 없음'}</p>
          <p><strong>생년월일:</strong> {userDetailData[expandedInfoUserId].birthDate || '정보 없음'}</p>
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
