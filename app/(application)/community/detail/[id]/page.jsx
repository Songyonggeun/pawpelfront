'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}`,
            {
        credentials: 'include',  // 쿠키 및 인증 정보 포함
      }
        );
        if (!response.ok) throw new Error('게시글을 불러오지 못했습니다.');
        const data = await response.json();
        setPost(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchPost();
  }, [id]);

  if (error) return <div className="text-red-500">에러: {error}</div>;
  if (!post) return <div>로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-black">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-6">
        {post.authorName} · {new Date(post.createdAt).toLocaleDateString()} · 조회수 {post.viewCount}
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
