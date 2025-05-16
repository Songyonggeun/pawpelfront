'use client';
import { useEffect, useState } from 'react';

export default function UserPage() {
const [users, setUsers] = useState([]);

useEffect(() => {
    fetch('http://localhost:4000/api/users')
    .then(res => res.json())
    .then(data => setUsers(data));
}, []);

const handleDelete = (id) => {
    fetch(`http://localhost:4000/api/users/${id}`, { method: 'DELETE' })
    .then(() => setUsers(prev => prev.filter(user => user.id !== id)));
};

return (
    <div>
    <h1 className="text-2xl font-bold">회원 관리</h1>
    <ul>
        {users.map(user => (
        <li key={user.id} className="flex justify-between">
            {user.name}
            <button onClick={() => handleDelete(user.id)} className="text-red-600">삭제</button>
        </li>
        ))}
    </ul>
    </div>
    );
}
