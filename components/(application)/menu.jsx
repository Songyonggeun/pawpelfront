import React, { Fragment } from 'react';
import Link from 'next/link';

export default function MenuComponents({ data = [{ title: '제목', href: '#' }] }) {
  return (
    <Fragment>
      {data.map((v, i) => {

        return (
          <li key={i} className="w-full">
            <Link
              href={v.href || '#'}
              className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              {v.title}
            </Link>
          </li>
        );
      })}
    </Fragment>
  );
}
