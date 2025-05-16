"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Step1 = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const agreementStatus = localStorage.getItem("isAgreed");
    if (agreementStatus === "true") {
      setIsAgreed(true);
    }
  }, []);

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleNext = () => {
    if (isAgreed) {
      localStorage.setItem("isAgreed", "true");
      router.push("/signup/step2"); // step2로 이동
    } else {
      alert("약관에 동의해야 합니다.");
    }
  };

  return (
    <div>
      <h1>약관 동의</h1>
      <div>
        <input
          type="checkbox"
          checked={isAgreed}
          onChange={handleAgreeChange}
        />
        <label>약관에 동의합니다.</label>
      </div>
      <button onClick={handleNext}>다음</button>
    </div>
  );
};

export default Step1;
