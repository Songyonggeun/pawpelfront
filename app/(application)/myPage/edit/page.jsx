'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
        credentials: 'include'
      });
      const data = await res.json();
      setUser(data);
      setUsername(data.name || '');
      setPhone(data.phoneNumber || '');
      setBirthDate(data.birthDate || '');
      setName(data.socialName || '');
      setEmail(data.email || '');
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);

  const handleUpdate = async () => {
    if (password && password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, phone, birthDate, email, pass: password }),
    });

    if (res.ok) {
      alert('회원 정보가 수정되었습니다.');
      router.push('/myPage');
    } else {
      alert('수정 실패');
    }
  };

  if (!user) return <div className="text-center mt-10">로딩 중...</div>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">회원 정보 수정</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">아이디</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
            value={username}
            disabled
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">이름</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">새 비밀번호 (선택)</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">비밀번호 확인</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">전화번호</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">생년월일</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">이메일</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          onClick={handleUpdate}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
