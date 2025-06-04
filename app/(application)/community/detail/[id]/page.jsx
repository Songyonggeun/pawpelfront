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
  const [followingIds, setFollowingIds] = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);

  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const [refreshCommentsFlag, setRefreshCommentsFlag] = useState(0);

  const handleLikeCountChange = (newCount) => {
    setPost((prev) => ({ ...prev, likeCount: newCount }));
  };

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('로그인 사용자 정보를 불러올 수 없습니다.');
        const userData = await res.json();
        setCurrentUserName(userData.name);
        setFollowingIds(userData.followingIds || []);
        setBlockedIds(userData.blockedIds || []);
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

  const handleAuthorClick = (event, authorName) => {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    setPopoverPosition({ x: rect.left, y: rect.bottom + window.scrollY });
    setSelectedAuthor(authorName);
    setShowPopover((prev) => !prev);
  };

  const handleFollow = async () => {
    try {
      if (blockedIds.includes(post.authorId)) {
        const confirmResult = confirm('팔로우하면 차단이 해제됩니다. 계속하시겠습니까?');
        if (!confirmResult) return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/follow/${post.authorId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('팔로우 실패');

      alert('팔로우 완료');
      setFollowingIds((prev) => [...prev, post.authorId]);
      setBlockedIds((prev) => prev.filter((id) => id !== post.authorId));
      setShowPopover(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/unfollow/${post.authorId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('언팔로우 실패');
      alert('언팔로우 완료');
      setFollowingIds((prev) => prev.filter((id) => id !== post.authorId));
      setShowPopover(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleBlock = async () => {
    try {
      if (followingIds.includes(post.authorId)) {
        const confirmResult = confirm('차단하기를 하면 언팔로우 됩니다. 계속하시겠습니까?');
        if (!confirmResult) return; 
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/block/${post.authorId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('차단 실패');

      alert('차단 완료');
      setBlockedIds((prev) => [...prev, post.authorId]);
      setFollowingIds((prev) => prev.filter((id) => id !== post.authorId));
      setShowPopover(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleUnblock = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/unblock/${post.authorId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('차단 해제 실패');
      alert('차단 해제 완료');
      setBlockedIds((prev) => prev.filter((id) => id !== post.authorId));
      setShowPopover(false);
    } catch (e) {
      alert(e.message);
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

      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <div className="font-medium ml-5">
          <span
            onClick={(e) => handleAuthorClick(e, post.authorName)}
            className="cursor-pointer hover:underline text-blue-600"
          >
            {post.authorName}
          </span>
        </div>

        {showPopover && (
          <div
            className="absolute bg-white border shadow-md rounded-md p-3 z-50"
            style={{ top: popoverPosition.y + 8, left: popoverPosition.x }}
          >
            <div className="text-sm font-semibold mb-2">{selectedAuthor}</div>

            {currentUserName && (
              <>
                {followingIds.includes(post.authorId) ? (
                  <button
                    onClick={handleUnfollow}
                    className="block w-full text-left py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  >
                    언팔로우 하기
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className="block w-full text-left py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  >
                    팔로우 하기
                  </button>
                )}

                {blockedIds.includes(post.authorId) ? (
                  <button
                    onClick={handleUnblock}
                    className="block w-full text-left py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  >
                    차단 해제 하기
                  </button>
                ) : (
                  <button
                    onClick={handleBlock}
                    className="block w-full text-left py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  >
                    차단 하기
                  </button>
                )}
              </>
            )}

            {/* <button
              onClick={() => {
                router.push(`/community/author/${post.authorId}`);
                setShowPopover(false);
              }}
              className="block w-full text-left py-1 px-2 hover:bg-gray-100 cursor-pointer"
            >
              작성 글 보기
            </button> */}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-2 text-right">
          <span>조회수 {post.viewCount}</span>
          <span>|</span>
          <span>댓글 {post.commentCount || 0}</span>
          <span>|</span>
          <span>추천 {post.likeCount || 0}</span>
          <span className="ml-4">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-transparent border-none p-2 mb-6 min-h-[300px] ml-5">
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

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

      {post?.id && (
        <section className="mt-2 border-t pt-6 max-w-4xl mx-auto w-full">
          <LikeCard
            postId={post.id}
            initialLikeCount={post.likeCount}
            initialIsLiked={post.isLiked}
            onLikeCountChange={handleLikeCountChange}
          />

          <h2 className="text-lg font-semibold mb-4 ml-1">댓글</h2>

          {currentUserName && (
            <div className="mb-1">
              <CommentInput
                postId={post.id}
                onCommentAdded={() => setRefreshCommentsFlag(flag => flag + 1)}
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
