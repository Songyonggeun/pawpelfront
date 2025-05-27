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
        const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}`, {
          credentials: 'include',
        });
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

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-10 text-red-600 font-semibold text-center">
        에러가 발생했습니다: {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-10 text-center text-gray-500">
        로딩 중입니다...
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 text-gray-900 font-sans">
      {/* 제목 */}
      <h1 className="text-2xl sm:text-3xl font-bold border-b border-gray-300 pb-3 mb-4">
        {post.title}
      </h1>

      {/* 작성자 정보 */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{post.authorName}</span>
        </div>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>

      {/* 메타 정보 */}
      <div className="flex flex-wrap text-sm text-gray-500 gap-2 border-b pb-3 mb-6">
        <span>추천 {post.likeCount || 0}</span>
        <span>|</span>
        <span>댓글 {post.commentCount || 0}</span>
        <span>|</span>
        <span>조회수 {post.viewCount}</span>
      </div>

      {/* 본문 */}
      <article
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 링크 공유 예시 */}
      {post.shareUrl && (
        <div className="mt-6 text-sm text-gray-500">
          <span>공유: </span>
          <a href={post.shareUrl} className="text-blue-600 hover:underline">
            {post.shareUrl}
          </a>
        </div>
      )}
    </main>
  );
}
