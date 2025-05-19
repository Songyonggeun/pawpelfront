'use client';

import { useEffect, useState } from 'react';

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
    fetch('http://192.168.3.118:localhost:9999/api/users')
    .then(res => res.json())
    .then(data => setUsers(data));
}, []);

const handleDelete = (id) => {
    fetch(`http://192.168.3.118:localhost:9999/api/users/${id}`, { method: 'DELETE' })
    .then(() => {
        setUsers(prev => prev.filter(user => user.id !== id));
    });
};

const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
};

const cancelEdit = () => {
    setEditingUserId(null);
    setEditName('');
};

const handleUpdate = () => {
    if (editingUserId === null) return;

    fetch(`http://192.168.3.118:localhost:9999/api/users/${editingUserId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: editName }),
    })
    .then(res => res.json())
    .then(updatedUser => {
        setUsers(prev =>
        prev.map(user => user.id === editingUserId ? updatedUser : user)
        );
        cancelEdit();
    });
};

return (
    <div className="p-4 max-w-xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">회원 관리</h1>
    <ul className="space-y-2">
        {users.map(user => (
        <li key={user.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
            {editingUserId === user.id ? (
            <div className="flex gap-2 w-full">
                <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-1 rounded flex-1"
                />
                <button onClick={handleUpdate} className="text-green-600">저장</button>
                <button onClick={cancelEdit} className="text-gray-600">취소</button>
            </div>
            ) : (
            <>
                <span>{user.name}</span>
                <div className="flex gap-2">
                <button onClick={() => startEdit(user)} className="text-blue-600">수정</button>
                <button onClick={() => handleDelete(user.id)} className="text-red-600">삭제</button>
                </div>
            </>
            )}
        </li>
        ))}
    </ul>
    </div>
);
}
