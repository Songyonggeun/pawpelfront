import React from "react";
export default function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 600 600"
      fill="white"
    >
      <title>Abstract user icon</title>
      <defs>
        <clipPath id="circular-border">
          <circle cx="300" cy="300" r="250" />
        </clipPath>
      </defs>
      <circle cx="300" cy="300" r="280" fill="black" />
      <circle cx="300" cy="230" r="100" />
      <circle cx="300" cy="550" r="190" clipPath="url(#circular-border)" />
    </svg>
  );
}