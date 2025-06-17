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

// ESC 키 감지 추가
useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setShowTermsModal(false);
      setShowPrivacyModal(false);
    }
  };
  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, []);


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
            className={`w-full py-2 rounded-lg transition ${isAgreed
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
          onClick={() => setShowTermsModal(false)} // 배경 클릭 시 닫힘
        >
          <div
            className="bg-white p-6 rounded-lg w-11/12 max-w-lg"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 닫힘 방지
          >
            <h2 className="text-xl font-semibold mb-4">이용약관</h2>

            <p className="text-sm mb-4" style={{ whiteSpace: 'pre-wrap', maxHeight: '60vh', overflowY: 'auto' }}>
              {`제1조 (목적)
본 약관은 pawpel(이하 "회사")이 제공하는 애완동물 커뮤니티, 건강관리 서비스 및 스토어 서비스(이하 "서비스")의 이용조건 및 절차에 관한 사항과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (약관의 효력 및 변경)
1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
2. 회사는 관련 법령을 위반하지 않는 범위 내에서 본 약관을 변경할 수 있으며, 변경 시 최소 7일 전에 공지합니다.
3. 이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.

제3조 (서비스 이용계약의 성립)
1. 서비스 이용계약은 이용자가 본 약관에 동의하고 회원가입 절차를 완료함으로써 성립됩니다.
2. 회사는 다음 각 호에 해당하는 이용신청에 대해서는 승낙을 거부할 수 있습니다.
  1) 타인의 명의를 도용한 경우
  2) 이용 신청 시 필요한 정보를 허위로 기재한 경우
  3) 기타 회사가 정한 이용신청 요건을 충족하지 못한 경우

제4조 (이용자의 의무)
이용자는 다음 행위를 하여서는 안 됩니다.
1. 타인의 개인정보, 계정, 콘텐츠 등을 도용하거나 무단 사용
2. 불법, 음란, 폭력, 차별, 명예훼손, 욕설 등 부적절한 내용 게시
3. 서비스 운영을 방해하거나 시스템에 해를 끼치는 행위
4. 회사의 승인 없이 영리 목적으로 서비스를 이용하는 행위

제5조 (개인정보 보호)
회사는 이용자의 개인정보 보호를 위해 관련 법령 및 개인정보처리방침에 따라 적절히 처리하며, 이용자의 동의 없이 제3자에게 제공하지 않습니다.

제6조 (게시물의 권리 및 책임)
1. 이용자가 작성한 게시물의 저작권은 이용자에게 귀속됩니다.
2. 회사는 서비스 운영을 위해 게시물을 사전 통지 없이 수정, 이동, 삭제할 수 있습니다.
3. 이용자가 게시한 게시물 내용에 대한 법적 책임은 게시자 본인에게 있습니다.

제7조 (서비스 이용 제한 및 해지)
1. 회사는 이용자가 본 약관을 위반하거나 불법행위를 하는 경우 사전 통지 없이 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.
2. 이용자는 언제든지 회원 탈퇴를 신청할 수 있으며, 탈퇴 즉시 서비스 이용이 중단됩니다.

제8조 (면책조항)
1. 회사는 천재지변, 불가항력적 사유로 인한 서비스 장애에 대해 책임을 지지 않습니다.
2. 회사는 이용자의 귀책사유로 발생한 손해에 대해 책임을 지지 않습니다.
3. 서비스 내 상품 구매, 배송, 환불 등 거래와 관련된 문제는 관련 법령 및 개별 판매자의 정책에 따릅니다.

제9조 (분쟁 해결)
1. 본 약관과 관련한 분쟁에 대해 소송이 제기될 경우 회사 소재지를 관할하는 법원을 1심 관할법원으로 합니다.
2. 본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.

위 약관의 내용을 모두 읽고 이해하였으며, 이에 동의합니다.`}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
          onClick={() => setShowPrivacyModal(false)} // 배경 클릭 시 닫힘
        >
          <div
            className="bg-white p-6 rounded-lg w-11/12 max-w-lg"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 닫힘 방지
          >
            <h2 className="text-xl font-semibold mb-4">개인정보 처리방침</h2>
            <p className="text-sm mb-4" style={{ whiteSpace: 'pre-wrap', maxHeight: '60vh', overflowY: 'auto' }}>
              {`개인정보 처리방침

pawpel(이하 "회사")는 이용자의 개인정보 보호를 매우 중요시하며, 관련 법령을 준수하여 개인정보를 처리합니다. 본 개인정보 처리방침은 회사가 수집하는 개인정보의 항목, 수집 및 이용 목적, 보유 및 이용 기간, 제3자 제공 등에 관한 내용을 안내합니다.

1. 수집하는 개인정보 항목
- 회원가입 시: 이름, 이메일 주소, 연락처, 생년월일 등 필수정보
- 서비스 이용 과정에서 자동으로 수집되는 정보: 접속 로그, 쿠키, 접속 IP 정보 등
- 건강관리 및 커뮤니티 서비스 이용 시 입력하는 건강정보 및 반려동물 정보

2. 개인정보 수집 및 이용 목적
- 서비스 제공 및 회원관리
- 맞춤형 건강관리 서비스 제공
- 상품 구매 및 배송, 결제 처리
- 고객 상담 및 불만 처리
- 마케팅 및 광고에의 활용 (이용자 동의 시)

3. 개인정보 보유 및 이용 기간
- 회원 탈퇴 시까지 개인정보를 보유하며, 관련 법령에 따라 일정 기간 보관 후 파기합니다.
- 단, 거래 내역 등 법령에서 정한 보존 기간은 별도로 준수합니다.

4. 개인정보의 제3자 제공
- 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
- 단, 법령에 의거하거나 이용자의 생명·신체 보호를 위해 긴급히 필요한 경우 예외로 합니다.

5. 이용자의 권리 및 행사 방법
- 언제든지 개인정보 열람, 수정, 삭제를 요구할 수 있습니다.
- 동의 철회 및 회원 탈퇴 요청 시 지체 없이 처리합니다.

6. 개인정보 보호를 위한 기술적·관리적 대책
- 개인정보 접근 권한 제한 및 내부 관리 계획 수립
- 개인정보 암호화, 보안서버 운영 등 안전성 확보 조치 시행

7. 개인정보 처리방침 변경
- 법령 및 회사 정책에 따라 본 방침은 변경될 수 있으며, 변경 시 사전 공지합니다.

본 방침에 대한 문의는 고객센터를 통해 연락해 주시기 바랍니다.

2025년 6월 17일
pawpel 개인정보 보호 책임자
`}
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
