'use client';

import React from 'react';

const MaleIcon = ({ size = 30, color = '#2563eb' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="10" cy="14" r="5" />
    <path d="M19 5l-5 5M19 5h-4M19 5v4" />
  </svg>
);

export default MaleIcon;
