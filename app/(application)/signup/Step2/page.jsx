"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import UsernameInput from "@/components/(Inputs)/UserNameInput";
import EmailInput from "@/components/(Inputs)/EmailInput";
import NameInput from "@/components/(Inputs)/NameInput";
import PhoneInput from "@/components/(Inputs)/PhoneInput";
import BirthDateInput from "@/components/(Inputs)/BirthdateInput";
import PasswordInput from "@/components/(Inputs)/PasswordInput";

const Step2 = () => {
  const router = useRouter();

  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);

  const [email, setEmail] = useState(""); // 최종 이메일
  const [emailUsername, setEmailUsername] = useState("");
  const [emailDomain, setEmailDomain] = useState("naver.com");
  const [customEmailDomain, setCustomEmailDomain] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [name, setName] = useState("");  // 이름
  const [phone, setPhone] = useState("");  // 전화번호
  const [birthDate, setBirthDate] = useState("");  // 생년월일

  useEffect(() => {
    const isAgreed = localStorage.getItem("isAgreed");
    if (isAgreed === "true") {
      setIsAllowed(true);
    } else {
      router.replace("/");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    const domain = emailDomain === "custom" ? customEmailDomain : emailDomain;
    const fullEmail = `${emailUsername}@${domain}`;
    setEmail(fullEmail);
  }, [emailUsername, emailDomain, customEmailDomain]);

  // 각 값이 변경될 때마다 console.log를 찍는 useEffect
  useEffect(() => {
    console.log("Username changed:", username);
  }, [username]);

  useEffect(() => {
    console.log("Email changed:", email);
  }, [email]);

  useEffect(() => {
    console.log("Name changed:", name);
  }, [name]);

  useEffect(() => {
    console.log("Phone changed:", phone);
  }, [phone]);

  useEffect(() => {
    console.log("Birth Date changed:", birthDate);
  }, [birthDate]);


  useEffect(() => {
    console.log("Password changed:", password);
  }, [password]);

  useEffect(() => {
    console.log("Confirm Password changed:", confirmPassword);
  }, [confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, emailUsername, customEmailDomain, password, confirmPassword, name, phone, birthDate)
    // 유효성 검사
    if (
      !username ||
      !emailUsername ||
      !customEmailDomain ||
      !password ||
      !confirmPassword ||
      !name.trim() ||
      !phone.trim() ||
      !birthDate.trim() 
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

    // 제출 시 전체 데이터 확인
    console.log("Form data before submit:");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("Phone:", phone);
    console.log("Birth Date:", birthDate);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/permit/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: username,                         // ✅ 사용자 ID
            pass: password,                   // ✅ 비밀번호
            socialName: name,                 // 선택사항
            email: email,                     // ✅ 완성된 전체 이메일
            phoneNumber: phone.replace(/-/g, ""), // ✅ 01012345678 형식
            birthDate: birthDate              // ✅ "yyyy-MM-dd" 형식
          }),
          credentials: "include"
        }
      );

      if (response.ok) {
        alert("회원가입이 완료되었습니다.");
        localStorage.removeItem("isAgreed");
        window.location.href = "/signup/Welcome";
      } else {
        const result = await response.json();
        switch (result.message) {
          case "username_exists":
            alert("이미 사용 중인 아이디입니다.");
            break;
          case "email_exists":
            alert("이미 사용 중인 이메일입니다.");
            break;
          case "phone_exists":
            alert("이미 사용 중인 전화번호입니다.");
            break;
          case "empty_input":
            alert("입력되지 않은 항목이 있습니다.");
            break;
          default:
            alert(result.message || "회원가입에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      alert("서버와의 연결 중 오류가 발생했습니다.");
    }
  };

  if (loading || !isAllowed) return null;

  return (
    <div className="flex justify-center items-start sm:items-start min-h-screen bg-gray-100 px-4 py-8 sm:py-30">
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
          <BirthDateInput birthDate={birthDate} setBirthDate={setBirthDate} />

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
