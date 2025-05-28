'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CommentInput from '@/components/(Inputs)/commentInput';


export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null); // 로그인 사용자명 상태

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/auth/me`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('로그인 사용자 정보를 불러올 수 없습니다.');
        const userData = await res.json();
        setCurrentUserName(userData.name);
      } catch (err) {
        setCurrentUserName(null);
      }
    };
    fetchCurrentUser();
  }, []);


  const handleEdit = () => {
    router.push(`/community/edit/${id}`);
  };

  const handleDelete = async () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('삭제 실패');
        alert('삭제되었습니다.');
        router.push('/community/total');
      } catch (err) {
        alert('삭제 중 오류 발생');
        console.error(err);
      }
    }
  };

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
    <main className="w-full max-w-4xl mx-auto px-6 py-10 text-gray-900 font-sans">
      {/* 카테고리 */}
      <div className="text-sm text-blue-500 font-medium mb-1 ml-5">
        {post.category}
      </div>

      {/* 제목 */}
      <h1 className="text-2xl sm:text-3xl font-bold border-b border-gray-300 pb-3 mb-4 ml-4">
        {post.title}
      </h1>

      <div className="flex justify-between text-sm text-gray-600 mb-4">
        {/* 작성자 (왼쪽) */}
        <div className="font-medium ml-5">{post.authorName}</div>

        {/* 조회수, 댓글, 추천, 작성일 (오른쪽) */}
        <div className="flex flex-wrap items-center gap-x-2 text-right">
          <span>조회수 {post.viewCount}</span>
          <span>|</span>
          <span>댓글 {post.commentCount || 0}</span>
          <span>|</span>
          <span>추천 {post.likeCount || 0}</span>
          <span className="ml-4">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* 본문 박스 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 min-h-[300px]">
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      {/* 수정/삭제 버튼 - 작성자일 때만 노출 */}
      {currentUserName === post.authorName && (
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            삭제
          </button>
        </div>
      )}

      {/* 댓글 작성 영역 - 로그인한 사용자 모두 보여주기 */}
      {currentUserName && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">댓글 작성</h2>
          <CommentInput
            postId={post.id}
            onCommentAdded={(newComment) => {
              console.log('댓글 작성됨:', newComment);
              // TODO: 댓글 목록 갱신 시 사용
            }}
          />
        </div>
      )}
    </main>
  );
}
