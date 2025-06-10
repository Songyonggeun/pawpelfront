"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CommentInput from "@/components/(Inputs)/commentInput";
import CommentShow from "@/components/(application)/commentShow";
import LikeCard from "@/components/(application)/postLike";
import PopularPostsSidebar from "@/components/(application)/PopularPostsSidebar";
import CommunityMenu from "@/components/(application)/communityMenu"

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

  //페이지네이션
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  //검색창
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [filteredPosts, setFilteredPosts] = useState(allPosts);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = allPosts.filter((post) => {
      const value =
        searchType === "title"
          ? post.title
          : searchType === "content"
          ? post.content
          : post.authorName;

      return value?.toLowerCase().includes(query);
    });
    setFilteredPosts(filtered);
    setCurrentPage(0); // 검색 시 첫 페이지부터
  };

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const pagedPosts = filteredPosts.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // 게시글
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
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
            { credentials: "include" }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}/next`,
            { credentials: "include" }
          ),
        ]);

        setPrevPost(
          prevRes.ok && prevRes.status !== 204 ? await prevRes.json() : null
        );
        setNextPost(
          nextRes.ok && nextRes.status !== 204 ? await nextRes.json() : null
        );
      } catch (err) {
        console.error("이전/다음글 불러오기 실패", err);
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
          { credentials: "include" }
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
    if (!post || post.category !== "Q&A" || !post.subCategory) return;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/category/${post.category}/sub/${post.subCategory}?page=0&size=5`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setRelatedPopularPosts(data.content || []);
      } catch (err) {
        console.error("연관 인기글 불러오기 실패", err);
      }
    })();
  }, [post]);

  /* ---------- 전체 글 목록 ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts?page=0&size=100`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAllPosts(data.content || []);
      } catch (err) {
        console.error("전체 게시글 불러오기 실패", err);
        setAllPosts([]);
      }
    })();
  }, []);
  // 페이지네이션
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  //검색
  useEffect(() => {
    setFilteredPosts(allPosts);
  }, [allPosts]);

  /* ---------- 수정 / 삭제 ---------- */
  const handleEdit = () => router.push(`/community/edit/${id}`);
  const handleDelete = async () => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/posts/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error();
      alert("삭제되었습니다.");
      router.push("/community/total");
    } catch {
      alert("삭제 중 오류 발생");
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
      <main className="flex-1 min-w-0 md:max-w-[calc(100%-320px-2rem)] min-h-[800px]">
        {/* 카테고리 경로 */}
        <div className="text-sm text-blue-500 font-medium mb-1 ml-1 flex items-center">
          <span>{post.category}</span>
          {post.subCategory && (
            <>
            <CommunityMenu category={post.category} />
              <span className="mx-2 text-gray-400">{">"}</span>
              <span>{post.subCategory}</span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-2xl font-bold border-b border-gray-300 pb-3 mb-4">
          {post.title}
        </h1>

        {/* 작성자 + 펫 정보 */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-3">
            {post.pet && (
              <div className="flex items-center gap-2">
                {post.pet.imageUrl ? (
                  <img
                    src={post.pet.thumbnailUrl || post.pet.imageUrl}
                    alt={post.pet.petName}
                    className="w-full h-full object-cover"
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
          <div className="mt-10 border rounded-md p-3 shadow-sm bg-gray-50 mb-6 w-full max-w-[350px]">
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
                    : "나이 정보 없음"}
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

        {/* 이전/다음글/목록/수정/삭제 */}
        <div className="mt-70 border-t border-gray-300 divide-y divide-gray-200 text-sm text-gray-800">
          {/* 이전글 */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="font-semibold w-[60px] text-gray-600">이전글</div>
            {prevPost ? (
              <button
                onClick={() => router.push(`/community/detail/${prevPost.id}`)}
                className="flex-1 text-left text-gray-800 hover:underline truncate"
              >
                {prevPost.title}
              </button>
            ) : (
              <span className="text-gray-400 flex-1">
                이전 게시글이 없습니다.
              </span>
            )}
          </div>

          {/* 다음글 */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="font-semibold w-[60px] text-gray-600">다음글</div>
            {nextPost ? (
              <button
                onClick={() => router.push(`/community/detail/${nextPost.id}`)}
                className="flex-1 text-left text-gray-800 hover:underline truncate"
              >
                {nextPost.title}
              </button>
            ) : (
              <span className="text-gray-400 flex-1">
                다음 게시글이 없습니다.
              </span>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-center gap-2 px-4 py-4">
            <button
              onClick={() => router.push("/community/total")}
              className="px-4 py-2 border border-gray-500 text-gray-700 rounded hover:bg-gray-100"
            >
              목록으로
            </button>
            {currentUserName === post.authorName && (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white"
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
              onCommentAdded={() => setRefreshCommentsFlag((flag) => flag + 1)}
            />
          )}
          <CommentShow key={refreshCommentsFlag} postId={post.id} />
        </section>

        {/* 연관 Q&A 게시글 */}
        {post.category === "Q&A" &&
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
                          i !== list.length - 1 ? "border-b" : ""
                        }`}
                        onClick={() => router.push(`/community/detail/${r.id}`)}
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

        <div className="mt-10">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            전체 게시글 목록
          </h3>

          {/* 게시판 테이블 스타일 */}
          <div className="w-full rounded-md overflow-hidden">
            {/* 헤더 */}
            <div className="grid grid-cols-12 text-sm font-semibold bg-gray-100 px-4 py-2 text-center text-gray-700">
              <div className="col-span-1">번호</div>
              <div className="col-span-6 text-left">제목</div>
              <div className="col-span-2">글쓴이</div>
              <div className="col-span-1">등록일</div>
              <div className="col-span-1">조회</div>
              <div className="col-span-1">추천</div>
            </div>

            {/* 목록 */}
            {pagedPosts.map((item) => {
              const isCurrent = item.id === Number(id);
              const created = new Date(item.createdAt);
              const now = new Date();
              const isToday = created.toDateString() === now.toDateString();
              const formattedTime = isToday
                ? created.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : created.toLocaleDateString();

              return (
                <div
                  key={item.id}
                  onClick={() =>
                    item.id !== currentPostId &&
                    router.push(`/community/detail/${item.id}`)
                  }
                  className={`grid grid-cols-12 px-4 py-2 text-sm cursor-pointer transition-all
                ${
                  isCurrent
                    ? "bg-blue-50 font-bold text-blue-700"
                    : "hover:bg-gray-50"
                }
                items-center`}
                >
                  <div className="col-span-1 text-center text-gray-500">
                    {item.id}
                  </div>
                  <div className="col-span-6 text-left truncate">
                    <span className="text-gray-400 mr-1">
                      [{item.category}
                      {item.subCategory ? ` > ${item.subCategory}` : ""}]
                    </span>
                    <span className="hover:underline">{item.title}</span>
                    {item.commentCount > 0 && (
                      <span className="ml-1 text-red-600 font-semibold">
                        [{item.commentCount}]
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-center text-gray-700">
                    {item.authorName}
                  </div>
                  <div className="text-center text-gray-500 w-[90px]">
                    {formattedTime}
                  </div>
                  <div className="col-span-1 text-center text-gray-600">
                    {item.viewCount}
                  </div>
                  <div className="col-span-1 text-center text-gray-600">
                    {item.likeCount}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          <div className="mt-6 flex justify-center gap-2 text-sm">
            <button
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded ${
                  currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              &gt;
            </button>
          </div>

          {/* 검색창 */}
          <div className="mt-6 mb-4 flex justify-center items-center gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-gray-300 rounded px-2 py-2 text-sm"
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="authorName">작성자</option>
            </select>

            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full max-w-sm border border-gray-300 rounded px-4 py-2 text-sm"
            />

            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              검색
            </button>
          </div>
        </div>
      </main>

      {/* ---------- 오른쪽 인기글 사이드바 ---------- */}
      <div className="hidden md:block md:w-[260px] md:pl-2">
        <PopularPostsSidebar />
      </div>
    </div>
  );
}
