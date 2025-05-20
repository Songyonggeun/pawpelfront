'use client';

import React from 'react';

const FemaleIcon = ({ size = 24, color = '#8B0000' }) => {
  return (
    <svg
      xmlns="https://www.svgrepo.com/show/103896/gender.svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 24 24"
    >
      <path d="M12 2a7 7 0 1 0 4.95 11.95A7 7 0 0 0 12 2zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm1 11.93V18h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H9a1 1 0 1 1 0-2h2v-2.07a7 7 0 0 0 2 0z" />
    </svg>
  );
};

export default FemaleIcon;
