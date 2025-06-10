'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import CommentInput from '@/components/(Inputs)/commentInput';
import CommentShow from '@/components/(application)/commentShow';
import LikeCard from '@/components/(application)/postLike';
import PopularPostsSidebar from '@/components/(application)/PopularPostsSidebar';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null); 
  const [refreshCommentsFlag, setRefreshCommentsFlag] = useState(0);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [relatedPopularPosts, setRelatedPopularPosts] = useState([]);

 // 게시글 
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}`,
          { credentials: 'include' },
        );
        if (!res.ok) throw new Error('게시글을 불러오지 못했습니다.');
        setPost(await res.json());
        setError(null);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id]);

  /* ---------- 이전·다음 글 ---------- */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [prevRes, nextRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}/previous`,
            { credentials: 'include' },
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}/next`,
            { credentials: 'include' },
          ),
        ]);

        setPrevPost(prevRes.ok && prevRes.status !== 204 ? await prevRes.json() : null);
        setNextPost(nextRes.ok && nextRes.status !== 204 ? await nextRes.json() : null);
      } catch (err) {
        console.error('이전/다음글 불러오기 실패', err);
        setPrevPost(null);
        setNextPost(null);
      }
    })();
  }, [id]);

  /* ---------- 로그인 사용자 ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/auth/me`,
          { credentials: 'include' },
        );
        if (!res.ok) throw new Error();
        const user = await res.json();
        setCurrentUserName(user.name);
      } catch {
        setCurrentUserName(null);
      }
    })();
  }, []);

  /* ---------- 같은 Q&A 서브카테고리 인기글 ---------- */
  useEffect(() => {
    if (!post || post.category !== 'Q&A' || !post.subCategory) return;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/category/${post.category}/sub/${post.subCategory}?page=0&size=5`,
          { credentials: 'include' },
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setRelatedPopularPosts(data.content || []);
      } catch (err) {
        console.error('연관 인기글 불러오기 실패', err);
      }
    })();
  }, [post]);

  /* ---------- 전체 글 목록 ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts?page=0&size=100`,
          { credentials: 'include' },
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAllPosts(data.content || []);
      } catch (err) {
        console.error('전체 게시글 불러오기 실패', err);
        setAllPosts([]);
      }
    })();
  }, []);

  /* ---------- 수정 / 삭제 ---------- */
  const handleEdit = () => router.push(`/community/edit/${id}`);
  const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}`,
        { method: 'DELETE', credentials: 'include' },
      );
      if (!res.ok) throw new Error();
      alert('삭제되었습니다.');
      router.push('/community/total');
    } catch {
      alert('삭제 중 오류 발생');
    }
  };

  /* ---------- 렌더 ---------- */
  if (error)
    return (
      <div className="max-w-3xl mx-auto p-6 mt-10 text-center text-red-600 font-semibold">
        에러가 발생했습니다: {error}
      </div>
    );
  if (!post)
    return (
      <div className="max-w-3xl mx-auto p-6 mt-10 text-center text-gray-500">
        로딩 중입니다...
      </div>
    );

  return (
    /* flex 컨테이너로 메인 + 사이드바 배치 */
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1300px] mx-auto px-6 py-10 text-gray-900 font-sans">
      {/* ---------- 메인 영역 ---------- */}
      <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)]">
        {/* 카테고리 경로 */}
        <div className="text-sm text-blue-500 font-medium mb-1 ml-1 flex items-center">
          <span>{post.category}</span>
          {post.subCategory && (
            <>
              <span className="mx-2 text-gray-400">{'>'}</span>
              <span>{post.subCategory}</span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold border-b border-gray-300 pb-3 mb-4">
          {post.title}
        </h1>

        {/* 작성자 + 펫 정보 */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-3">
            {post.pet && (
              <div className="flex items-center gap-2">
                {post.pet.imageUrl ? (
                  <img
                    src={post.pet.imageUrl}
                    alt={post.pet.petName}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border text-gray-400">
                    🐾
                  </div>
                )}
              </div>
            )}
            <span className="font-medium">{post.authorName}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 text-right">
            <span>조회수 {post.viewCount || 0}</span>
            <span>|</span>
            <span>댓글 {post.commentCount || 0}</span>
            <span>|</span>
            <span>추천 {post.likeCount || 0}</span>
            <span className="ml-4">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 펫 카드 */}
        {post.pet && (
          <div className="border rounded-md p-3 shadow-sm bg-gray-50 mb-6 w-full max-w-[350px]">
            <div className="flex items-center gap-4">
              {post.pet.imageUrl ? (
                <img
                  src={post.pet.imageUrl}
                  alt={post.pet.petName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                  🐾
                </div>
              )}
              <div>
                <div className="font-semibold text-lg truncate">
                  {post.pet.petName}
                </div>
                <div className="text-sm text-gray-600">
                  {post.pet.petGender}
                </div>
                <div className="text-sm text-gray-600">
                  {post.pet.petAge !== null
                    ? `${post.pet.petAge}년생`
                    : '나이 정보 없음'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 본문 */}
        <article
          className="prose prose-lg max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* 이전/다음 + 목록/수정/삭제 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            {prevPost ? (
              <button
                onClick={() => router.push(`/community/detail/${prevPost.id}`)}
                className="text-blue-600 hover:underline whitespace-nowrap mr-4"
              >
                ← 이전글
              </button>
            ) : (
              <span className="text-gray-400 whitespace-nowrap mr-4">
                ← 이전글 없음
              </span>
            )}
            {nextPost ? (
              <button
                onClick={() => router.push(`/community/detail/${nextPost.id}`)}
                className="text-blue-600 hover:underline whitespace-nowrap"
              >
                다음글 →
              </button>
            ) : (
              <span className="text-gray-400 whitespace-nowrap">
                다음글 없음 →
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/community/total')}
              className="px-3 py-1.5 border border-gray-500 text-gray-700 rounded hover:bg-gray-200"
            >
              목록
            </button>
            {currentUserName === post.authorName && (
              <>
                <button
                  onClick={handleEdit}
                  className="px-3 py-1.5 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        {/* 좋아요 */}
        <LikeCard
          postId={post.id}
          initialLikeCount={post.likeCount}
          initialIsLiked={post.isLiked}
          onLikeCountChange={(cnt, liked) =>
            setPost((p) => ({ ...p, likeCount: cnt, isLiked: liked }))
          }
        />

        {/* 댓글 */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4">댓글</h2>
          {currentUserName && (
            <CommentInput
              postId={post.id}
              onCommentAdded={() =>
                setRefreshCommentsFlag((flag) => flag + 1)
              }
            />
          )}
          <CommentShow key={refreshCommentsFlag} postId={post.id} />
        </section>

        {/* 연관 Q&A 게시글 */}
        {post.category === 'Q&A' &&
          post.subCategory &&
          (() => {
            const list = relatedPopularPosts.filter((p) => p.id !== post.id);
            if (!list.length) return null;
            return (
              <div className="mt-12">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  연관 게시글
                </h3>
                <table className="w-full text-sm text-left text-gray-700">
                  <tbody>
                    {list.map((r, i) => (
                      <tr
                        key={r.id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          i !== list.length - 1 ? 'border-b' : ''
                        }`}
                        onClick={() =>
                          router.push(`/community/detail/${r.id}`)
                        }
                      >
                        <td className="py-2 px-3 w-1/2 font-medium text-gray-900">
                          [{r.subCategory}] {r.title}
                        </td>
                        <td className="py-2 px-2">{r.authorName}</td>
                        <td className="py-2 px-2">조회 {r.viewCount}</td>
                        <td className="py-2 px-2">좋아요 {r.likeCount}</td>
                        <td className="py-2 px-2">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}

        {/* 전체 게시글 목록 */}
        <div className="mt-12">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            전체 게시글 목록
          </h3>
          <table className="w-full text-sm text-left text-gray-700">
            <tbody>
              {allPosts.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    idx !== allPosts.length - 1 ? 'border-b' : ''
                  }`}
                  onClick={() =>
                    item.id !== post.id &&
                    router.push(`/community/detail/${item.id}`)
                  }
                >
                  <td className="py-2 px-3 w-1/2">
                    {item.id === post.id ? (
                      <strong>
                        [{item.category}
                        {item.subCategory ? ` > ${item.subCategory}` : ''}]{' '}
                        {item.title}
                      </strong>
                    ) : (
                      <>
                        [{item.category}
                        {item.subCategory ? ` > ${item.subCategory}` : ''}]{' '}
                        {item.title}
                      </>
                    )}
                  </td>
                  <td className="py-2 px-2">{item.authorName}</td>
                  <td className="py-2 px-2">조회 {item.viewCount}</td>
                  <td className="py-2 px-2">좋아요 {item.likeCount}</td>
                  <td className="py-2 px-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ---------- 오른쪽 인기글 사이드바 ---------- */}
      <div className="hidden md:block md:w-[260px] md:pl-2">
        <PopularPostsSidebar />
      </div>
    </div>
  );
}
