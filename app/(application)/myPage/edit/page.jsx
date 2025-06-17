'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [name, setName] = useState('');
  const [emailUsername, setEmailUsername] = useState('');
  const [customEmailDomain, setCustomEmailDomain] = useState('');
  const [emailDomain, setEmailDomain] = useState('naver.com');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
        credentials: 'include',
      });
      const data = await res.json();
      setUser(data);
      setUsername(data.name || '');
      setBirthDate(data.birthDate || '');
      setName(data.socialName || '');

      const [userPart, domainPart] = (data.email || '').split('@');
      setEmailUsername(userPart || '');
      setCustomEmailDomain(domainPart || '');
      setEmailDomain(domainPart === 'naver.com' || domainPart === 'daum.com' || domainPart === 'google.com' ? domainPart : '');

      const phoneParts = (data.phoneNumber || '').split('-');
      setPhone2(phoneParts[1] || '');
      setPhone3(phoneParts[2] || '');
    };
    fetchUser();
  }, []);

  useEffect(() => {
    setPhone(`010-${phone2}-${phone3}`);
  }, [phone2, phone3]);

  useEffect(() => {
    const domain = emailDomain || customEmailDomain;
    setEmail(`${emailUsername}@${domain}`);
  }, [emailUsername, customEmailDomain, emailDomain]);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);

  const handlePhoneChange = (e, part) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      setPhoneError('숫자만 입력해주세요.');
      return;
    }

    if ((part === 'second' && value.length > 0 && value.length !== 4) ||
        (part === 'third' && value.length > 0 && value.length !== 4)) {
      setPhoneError('전화번호는 숫자 4자리씩 정확히 입력해주세요.');
    } else {
      setPhoneError('');
    }

    if (part === 'second') setPhone2(value);
    else if (part === 'third') setPhone3(value);
  };

  const handleEmailDomainChange = (e) => {
    const selected = e.target.value;
    setEmailDomain(selected);
    if (selected !== '') {
      setCustomEmailDomain(selected);
    } else {
      setCustomEmailDomain('');
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!/^[0-9]{4}$/.test(phone2) || !/^[0-9]{4}$/.test(phone3)) {
      setPhoneError('전화번호는 숫자 4자리씩 정확히 입력해주세요.');
      return;
    }

    const updatedFields = {};
    if (name.trim()) updatedFields.name = name;
    if (phone.trim()) updatedFields.phone = phone;
    if (birthDate.trim()) updatedFields.birthDate = birthDate;
    if (email.trim()) updatedFields.email = email;
    if (password.trim()) updatedFields.pass = password;

    if (Object.keys(updatedFields).length === 0) {
      alert('수정할 내용이 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(updatedFields)], { type: 'application/json' }));
    // 이미지 업로드를 하려면 아래 코드 추가 (없으면 생략 가능)
    // formData.append('image', file); // <== input type="file"에서 선택한 파일 객체가 필요

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/update`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        alert('회원 정보가 수정되었습니다.');
        router.push('/myPage');
      } else {
        alert('수정 실패');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류');
    }
  };

  const handleWithdraw = async () => {
    const confirmed = confirm('정말 탈퇴하시겠습니까? 탈퇴 후에는 계정 정보가 삭제됩니다.');
    if (!confirmed) return;

    try {
      // ✅ 1. 회원탈퇴 먼저 실행
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/withdraw`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        alert('회원 탈퇴에 실패했습니다.');
        return;
      }

      // ✅ 2. 탈퇴 성공 후 로그아웃 요청
      await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      alert('회원 탈퇴가 완료되었습니다.');
      window.location.href = '/';

    } catch (error) {
      console.error('탈퇴 중 오류 발생:', error);
      alert('서버 오류로 탈퇴에 실패했습니다.');
    }
  };

  if (!user) return <div className="text-center mt-10">로딩 중...</div>;

  return (
      <>


        {/* 오른쪽 본문 영역 */}
        <main className="flex justify-center items-start min-h-screen pt-10">
          <div className="bg-white p-8 rounded-lg border border-gray-300 shadow-sm w-full max-w-xl">
            <h1 className="text-2xl font-semibold mb-6 text-center">회원 정보 수정</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
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
              <label className="block mb-1 text-gray-700 font-medium">전화번호</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value="010"
                  className="w-1/4 px-3 py-2 border rounded-md text-center bg-gray-100 text-gray-500"
                  disabled
                />
                <span className="self-center">-</span>
                <input
                  type="text"
                  value={phone2}
                  onChange={(e) => handlePhoneChange(e, 'second')}
                  maxLength={4}
                  className="w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                  placeholder="1234"
                />
                <span className="self-center">-</span>
                <input
                  type="text"
                  value={phone3}
                  onChange={(e) => handlePhoneChange(e, 'third')}
                  maxLength={4}
                  className="w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                  placeholder="5678"
                />
              </div>
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">이메일</label>
              <div className="flex items-center gap-1">
                <input
                  name="email1"
                  type="text"
                  value={emailUsername}
                  onChange={(e) => setEmailUsername(e.target.value)}
                  required
                  className="w-2/5 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="아이디를 입력하세요"
                />
                <span>@</span>
                <input
                  name="email2"
                  type="text"
                  value={customEmailDomain}
                  onChange={(e) => setCustomEmailDomain(e.target.value)}
                  className="w-1/3 px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="도메인 입력"
                  disabled={emailDomain !== ''}
                />
                <select
                  value={emailDomain}
                  onChange={handleEmailDomainChange}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/3"
                >
                  <option value="naver.com">naver.com</option>
                  <option value="daum.com">daum.com</option>
                  <option value="google.com">google.com</option>
                  <option value="">직접 입력</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                수정하기
              </button>

              <button
                type="button"
                onClick={handleWithdraw}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                회원탈퇴
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
