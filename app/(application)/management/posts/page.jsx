'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function PostPage() {
const [posts, setPosts] = useState([]);

useEffect(() => {
    fetch('http://localhost:3000/api/posts')
    .then(res => res.json())
    .then(data => setPosts(data));
}, []);

const moveToNotice = (id) => {
    fetch(`http://localhost:3000/api/posts/${id}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: '공지사항' }),
    });
};

return (
    <div>
    <h1 className="text-2xl font-bold">게시글 관리</h1>
    <ul>
        {posts.map(post => (
        <li key={post.id} className="flex justify-between">
            {post.title}
            <button onClick={() => moveToNotice(post.id)} className="text-blue-600">공지로 이동</button>
        </li>
        ))}
    </ul>
    </div>
);
}
