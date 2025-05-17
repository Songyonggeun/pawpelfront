"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import UsernameInput from "@/components/(Inputs)/UserNameInput";
import EmailInput from "@/components/(Inputs)/EmailInput";
import NameInput from "@/components/(Inputs)/NameInput";
import PhoneInput from "@/components/(Inputs)/PhoneInput";
import GenderInput from "@/components/(Inputs)/GenderInput";
import AddressInput from "@/components/(Inputs)/AddressInput";
import BirthDateInput from "@/components/(Inputs)/BirthdateInput";
import PasswordInput from "@/components/(Inputs)/PasswordInput";

const Step2 = () => {
  const router = useRouter();

  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);

  // 이메일 관련 상태
  const [email, setEmail] = useState(""); // 최종 이메일
  const [emailUsername, setEmailUsername] = useState("");
  const [emailDomain, setEmailDomain] = useState("naver.com");
  const [customEmailDomain, setCustomEmailDomain] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState(""); // 성별 상태 추가
  const [address, setAddress] = useState("");

  // ✅ 약관 동의 확인
  useEffect(() => {
    const isAgreed = localStorage.getItem("isAgreed");
    if (isAgreed === "true") {
      setIsAllowed(true);
    } else {
      router.replace("/home");
    }
    setLoading(false);
  }, [router]);

  // ✅ 비밀번호 일치 확인
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  // ✅ 이메일 상태 조합
  useEffect(() => {
    const domain = emailDomain === "custom" ? customEmailDomain : emailDomain;
    const fullEmail = `${emailUsername}@${domain}`;

    setEmail(fullEmail); // 최종 이메일 상태 저장
  }, [emailUsername, emailDomain, customEmailDomain]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (
      !username ||
      !trimmedEmail ||
      !password ||
      !confirmPassword ||
      !name.trim() ||
      !phone.trim() ||
      !birthDate.trim() ||
      !gender.trim() ||  // 성별도 확인
      !address.trim()
    ) {
      alert("모든 필드를 작성해주세요.");
      return;
    }

    if (!isUsernameChecked) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        name,
        email: trimmedEmail, // ✅ 이미 조합된 email 값
        password,
        phone,
        birthDate,
        gender, // 성별 포함
        address,
      }),
    });

    if (response.ok) {
      alert("회원가입이 완료되었습니다.");
      localStorage.removeItem("isAgreed");
      router.push("/signup/Welcome");
    } else {
      alert("회원가입에 실패했습니다.");
    }
  };

  if (loading || !isAllowed) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-16">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UsernameInput
            username={username}
            setUsername={setUsername}
            isChecked={isUsernameChecked}
            setIsChecked={setIsUsernameChecked}
          />

          <PasswordInput
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordError={passwordError}
          />

          <EmailInput
            email={email}
            setEmail={setEmail}
            emailUsername={emailUsername}
            setEmailUsername={setEmailUsername}
            emailDomain={emailDomain}
            setEmailDomain={setEmailDomain}
            customEmailDomain={customEmailDomain}
            setCustomEmailDomain={setCustomEmailDomain}
          />

          <NameInput name={name} setName={setName} />
          <PhoneInput phone={phone} setPhone={setPhone} />
          <GenderInput gender={gender} setGender={setGender} /> 
          <BirthDateInput birthDate={birthDate} setBirthDate={setBirthDate} />
          <AddressInput address={address} setAddress={setAddress} />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step2;
