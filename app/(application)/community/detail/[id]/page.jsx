'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CommentInput from '@/components/(Inputs)/commentInput';
import CommentShow from '@/components/(application)/commentShow';
import LikeCard from '@/components/(application)/postLike';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);

  const [refreshCommentsFlag, setRefreshCommentsFlag] = useState(0);

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
      } catch {
        setCurrentUserName(null);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleEdit = () => {
    router.push(`/community/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

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
      <div className="text-sm text-blue-500 font-medium mb-1 ml-5 flex items-center">
        <span>{post.category}</span>
        {post.subCategory && (
          <>
            <span className="mx-2 text-gray-400">{'>'}</span>
            <span>{post.subCategory}</span>
          </>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold border-b border-gray-300 pb-3 mb-4 ml-4">
        {post.title}
      </h1>

      {/* 작성자 + 펫 정보 표시 */}
      <div className="flex justify-between text-sm text-gray-600 mb-4 ml-5">
        <div className="flex items-center gap-3">
          {post.pet && (
            <div className="flex items-center gap-2">
              {post.pet.imageUrl ? (
                <img
                  src={post.pet.imageUrl}
                  className="w-8 h-8 rounded-full object-cover border"
                  alt={post.pet.petName}
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 border">
                  🐾
                </div>
              )}
            </div>
          )}
          <div className="font-medium">{post.authorName}</div>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 text-right">
          <span>조회수 {post.viewCount || 0}</span>
          <span>|</span>
          <span>댓글 {post.commentCount || 0}</span>
          <span>|</span>
          <span>추천 {post.likeCount || 0}</span>
          <span className="ml-4">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* 펫 카드 */}
      {post.pet && (
        <div
          className="
            border rounded-md p-3 shadow-sm bg-gray-50 ml-5
            w-[90%] max-w-[350px]
            sm:w-[70%] sm:max-w-[400px]
            md:w-[50%] md:max-w-[350px]
          "
        >
          <div className="flex items-center gap-4 flex-wrap">
            {post.pet.imageUrl ? (
              <img
                src={post.pet.imageUrl}
                alt={post.pet.petName}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                🐾
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-lg truncate">{post.pet.petName}</div>
              <div className="text-sm text-gray-600">{post.pet.petGender}</div>
              <div className="text-sm text-gray-600">
                {post.pet.petAge !== null ? `${post.pet.petAge}년생생` : '나이 정보 없음'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 본문 */}
      <div className="bg-transparent border-none p-2 mb-6 min-h-[300px] ml-5 w-[90%] max-w-4xl">
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* 수정/삭제 버튼 (작성자만 표시) */}
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

      {/* 좋아요 + 댓글 */}
      {post?.id && (
        <section className="mt-2 border-t pt-6 max-w-4xl mx-auto w-full">
          <div className="flex justify-start mb-4">
            <LikeCard
              postId={post.id}
              initialLikeCount={post.likeCount}
              initialIsLiked={post.isLiked}
              onLikeCountChange={(newCount, newIsLiked) => {
                setPost((prev) => ({
                  ...prev,
                  likeCount: newCount,
                  isLiked: newIsLiked,
                }));
              }}
            />
          </div>

          <h2 className="text-lg font-semibold mb-4 ml-1">댓글</h2>

          {currentUserName && (
            <div className="mb-1">
              <CommentInput
                postId={post.id}
                onCommentAdded={() => setRefreshCommentsFlag((flag) => flag + 1)}
              />
            </div>
          )}

          <div className="mt-1">
            <CommentShow key={refreshCommentsFlag} postId={post.id} />
          </div>
        </section>
      )}
    </main>
  );
}
