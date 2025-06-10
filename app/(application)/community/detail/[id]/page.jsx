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
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

  // Q&A 같은 서브카테고리 인기글 5개
  const [relatedPopularPosts, setRelatedPopularPosts] = useState([]);

  // 게시글 fetch
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
    if (!id) return;

    const fetchPrevNextPosts = async () => {
      try {
        const [prevRes, nextRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}/previous`, { credentials: 'include' }),
          fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}/next`, { credentials: 'include' }),
        ]);

        if (prevRes.ok && prevRes.status !== 204) {
          const prevData = await prevRes.json();
          setPrevPost(prevData);
        } else {
          setPrevPost(null);
        }

        if (nextRes.ok && nextRes.status !== 204) {
          const nextData = await nextRes.json();
          setNextPost(nextData);
        } else {
          setNextPost(null);
        }
      } catch (err) {
        console.error('이전/다음글 불러오기 실패', err);
        setPrevPost(null);
        setNextPost(null);
      }
    };

    fetchPrevNextPosts();
  }, [id]);

  // 로그인 사용자 정보 fetch
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

  // Q&A 인기글 fetch (같은 서브카테고리)
  useEffect(() => {
    const fetchRelatedPopularPosts = async () => {
      if (!post || post.category !== 'Q&A' || !post.subCategory) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/category/${post.category}/sub/${post.subCategory}?page=0&size=5`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('인기글 불러오기 실패');
        const data = await res.json();
        setRelatedPopularPosts(data.content || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRelatedPopularPosts();
  }, [post]);

  

  // 모든 게시글 목록 fetch (댓글과 연관 게시글 아래에 표시할 전체 게시글)
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts?page=0&size=100`, { credentials: 'include' });
        if (!res.ok) throw new Error('전체 게시글 불러오기 실패');
        const data = await res.json();
        setAllPosts(data.content || []);
      } catch (error) {
        console.error(error);
        setAllPosts([]);
      }
    };

    fetchAllPosts();
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
                {post.pet.petAge !== null ? `${post.pet.petAge}년생` : '나이 정보 없음'}
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

      {/* 좋아요 + 댓글 영역 */}
      {post?.id && (
        <section className="mt-2 border-t pt-6 max-w-4xl mx-auto w-full">

          {/* 이전글/다음글 및 목록/수정/삭제 버튼을 좋아요 위로 이동 */}
          <div className="flex justify-between items-center mb-4">
            {/* 왼쪽: 이전글/다음글 버튼 */}
            <div>
              {prevPost ? (
                <button
                  onClick={() => router.push(`/community/detail/${prevPost.id}`)}
                  className="text-blue-600 hover:underline whitespace-nowrap mr-4"
                >
                  ← 이전글
                </button>
              ) : (
                <span className="text-gray-400 whitespace-nowrap mr-4">← 이전글 없음</span>
              )}

              {nextPost ? (
                <button
                  onClick={() => router.push(`/community/detail/${nextPost.id}`)}
                  className="text-blue-600 hover:underline whitespace-nowrap"
                >
                  다음글 →
                </button>
              ) : (
                <span className="text-gray-400 whitespace-nowrap">다음글 없음 →</span>
              )}
            </div>

            {/* 오른쪽: 목록 버튼 항상, 수정/삭제는 작성자만 */}
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/community/total')}
                className="px-3 py-1.5 border border-gray-500 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                목록
              </button>

              {currentUserName === post.authorName && (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1.5 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors duration-200"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 좋아요 */}
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

          <div id="comments" className="mt-4">
            <CommentShow key={refreshCommentsFlag} postId={post.id} />
          </div>

          {post.category === 'Q&A' && post.subCategory && (() => {
            const filteredPosts = relatedPopularPosts.filter((relatedPost) => relatedPost.id !== post.id);

            if (filteredPosts.length === 0) return null;

            return (
              <div className="mt-10 pt-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">연관 게시글</h3>
                <table className="w-full text-sm text-left text-gray-700">
                  <tbody>
                    {filteredPosts.map((relatedPost, index) => (
                      <tr
                        key={relatedPost.id}
                        className={`hover:bg-gray-50 cursor-pointer ${index !== filteredPosts.length - 1 ? 'border-b' : ''}`}
                        onClick={() => router.push(`/community/detail/${relatedPost.id}`)}
                      >
                        <td className="py-2 px-3 w-1/2">
                          <span className="font-medium text-gray-900">
                            [{relatedPost.subCategory}] {relatedPost.title}
                          </span>
                        </td>
                        <td className="py-2 px-2">{relatedPost.authorName}</td>
                        <td className="py-2 px-2">조회 {relatedPost.viewCount}</td>
                        <td className="py-2 px-2">좋아요 {relatedPost.likeCount}</td>
                        <td className="py-2 px-2">{new Date(relatedPost.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
          {/* 전체 게시글 목록 - 현재 글은 bold 처리 */}
          <div className="mt-10 pt-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">전체 게시글 목록</h3>
            <table className="w-full text-sm text-left text-gray-700">
              <tbody>
                {allPosts.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 cursor-pointer ${idx !== allPosts.length - 1 ? 'border-b' : ''}`}
                    onClick={() => {
                      if (item.id !== post.id) {
                        router.push(`/community/detail/${item.id}`);
                      }
                    }}
                  >
                    <td className="py-2 px-3 w-1/2">
                      {item.id === post.id ? (
                        <strong>[{item.category}{item.subCategory ? ` > ${item.subCategory}` : ''}] {item.title}</strong>
                      ) : (
                        <>
                          [{item.category}{item.subCategory ? ` > ${item.subCategory}` : ''}] {item.title}
                        </>
                      )}
                    </td>
                    <td className="py-2 px-2">{item.authorName}</td>
                    <td className="py-2 px-2">조회 {item.viewCount}</td>
                    <td className="py-2 px-2">좋아요 {item.likeCount}</td>
                    <td className="py-2 px-2">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
