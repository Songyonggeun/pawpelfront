import React, { Fragment } from 'react';
import Link from 'next/link';

export default function MenuComponents({ data = [{ title: '제목', href: '#' }] }) {
  return (
    <Fragment>
      {data.map((item, index) => {
        const isWithdraw = item.title === '회원 탈퇴'; // 강조할 메뉴

        return (
          <li key={index} className="w-full">
            <Link
              href={item.href || '#'}
              className={`block w-full text-left px-4 py-2 rounded-lg transition
                ${isWithdraw ? 'bg-red-100 text-red-600 hover:bg-red-200 font-semibold' : 'hover:bg-gray-200'}`}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </Fragment>
  );
}
