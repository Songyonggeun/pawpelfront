'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import NameInput from '@/components/(Inputs)/NameInput';
import EmailInput from '@/components/(Inputs)/EmailInput';
import PhoneInput from '@/components/(Inputs)/PhoneInput';

export default function FindIdPage() {
  const [name, setName] = useState('');
  const [emailUsername, setEmailUsername] = useState('');
  const [emailDomain, setEmailDomain] = useState('naver.com');
  const [customEmailDomain, setCustomEmailDomain] = useState('');
  const [phone, setPhone] = useState('');

  const [email, setEmail] = useState('');
  const router = useRouter();

  // 이메일 완성
  useEffect(() => {
    const domain = emailDomain === 'custom' ? customEmailDomain : emailDomain;
    setEmail(`${emailUsername}@${domain}`);
  }, [emailUsername, emailDomain, customEmailDomain]);

  const handleFindId = async (e) => {
    e.preventDefault();

    if (!name.trim() || !emailUsername.trim() || !phone.trim()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/permit/auth/find-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phoneNumber: phone
        }),
      });

      if (!response.ok) throw new Error('일치하는 아이디가 없습니다.');

      const result = await response.json();
      router.push(`/find/resultid?page=${result.username}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">아이디 찾기</h1>

        <form onSubmit={handleFindId} className="space-y-4">
          <NameInput name={name} setName={setName} />
          <EmailInput
            emailUsername={emailUsername}
            setEmailUsername={setEmailUsername}
            emailDomain={emailDomain}
            setEmailDomain={setEmailDomain}
            customEmailDomain={customEmailDomain}
            setCustomEmailDomain={setCustomEmailDomain}
          />
          <PhoneInput phone={phone} setPhone={setPhone} />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            아이디 찾기
          </button>
        </form>
      </div>
    </div>
  );
}
