"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import UsernameInput from "@/components/(Inputs)/UserNameInput";
import EmailInput from "@/components/(Inputs)/EmailInput";
import NameInput from "@/components/(Inputs)/NameInput";
import PhoneInput from "@/components/(Inputs)/PhoneInput";
import PasswordInput from "@/components/(Inputs)/PasswordInput";

export default function SignUpUnified() {
  const router = useRouter();

  // 약관 동의 상태
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const isAgreed = isTermsAgreed && isPrivacyAgreed;

  // 모달
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // 입력 필드
  const [username, setUsername] = useState("");
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);

  const [email, setEmail] = useState("");
  const [emailUsername, setEmailUsername] = useState("");
  const [emailDomain, setEmailDomain] = useState("naver.com");
  const [customEmailDomain, setCustomEmailDomain] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    const domain =
      emailDomain === "custom" ? customEmailDomain.trim() : emailDomain.trim();
    if (emailUsername && domain) {
      setEmail(`${emailUsername}@${domain}`);
    } else {
      setEmail("");
    }
  }, [emailUsername, emailDomain, customEmailDomain]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isAgreed) {
    alert("모든 약관에 동의해주세요.");
    return;
  }

  if (
    !username ||
    !emailUsername ||
    (emailDomain === "custom" && !customEmailDomain.trim()) ||
    !password ||
    !confirmPassword ||
    !name.trim() ||
    !phone.trim()
  ) {
    alert("모든 항목을 입력해주세요.");
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

    try {
      // 회원가입 요청
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/permit/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: username,
            pass: password,
            socialName: name,
            email: email,
            phoneNumber: phone.replace(/-/g, "")
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
    } catch (err) {
      console.error("회원가입 실패:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        {/* <h1 className="text-2xl font-semibold mb-6 text-center">회원가입</h1> */}

        {/* 약관 동의 섹션 */}
        <div className="space-y-4 mb-6 border border-gray-300 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isTermsAgreed}
              onChange={() => setIsTermsAgreed((prev) => !prev)}
              className="mr-2"
              id="termsCheckbox"
            />
            <label htmlFor="termsCheckbox" className="text-gray-700 cursor-pointer">
              이용약관에 동의합니다.
            </label>
            <button
              onClick={() => setShowTermsModal(true)}
              className="ml-2 text-blue-500 text-sm underline"
            >
              보기
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isPrivacyAgreed}
              onChange={() => setIsPrivacyAgreed((prev) => !prev)}
              className="mr-2"
              id="privacyCheckbox"
            />
            <label htmlFor="privacyCheckbox" className="text-gray-700 cursor-pointer">
              개인정보 처리방침에 동의합니다.
            </label>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="ml-2 text-blue-500 text-sm underline"
            >
              보기
            </button>
          </div>
        </div>

        {/* 회원가입 폼 */}
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
          <button
            type="submit"
            disabled={!isAgreed}
            className={`w-full py-2 rounded-lg transition ${
              isAgreed
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            회원가입
          </button>
        </form>
      </div>

      {/* 이용약관 모달 */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">이용약관</h2>
            <p className="text-sm mb-4">
              여기에 이용약관 내용을 입력하세요.
            </p>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 개인정보처리방침 모달 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">개인정보 처리방침</h2>
            <p className="text-sm mb-4">
              여기에 개인정보 처리방침 내용을 입력하세요.
            </p>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
