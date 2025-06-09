// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import CommunityMenu from '@/components/(application)/communityMenu';
// import HealthCareMenu from '@/components/(application)/healthCare';

// export default function Header() {
//   const [showCommunityMenu, setShowCommunityMenu] = useState(false);
//   const [showHealthCareMenu, setShowHealthCareMenu] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRoles, setUserRoles] = useState([]);
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const router = useRouter();

//   const goTo = (path) => () => {
//     router.push(path);
//   };

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
//           credentials: 'include',
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setUserRoles(data.roles || []);
//           setIsLoggedIn(true);
//         } else {
//           setIsLoggedIn(false);
//           setUserRoles([]);
//         }
//       } catch (err) {
//         console.error('유저 정보 조회 실패:', err);
//         setIsLoggedIn(false);
//       }
//     };

//     fetchUserInfo();
//   }, []);

//   const toggleCommunityMenu = () => {
//     setShowCommunityMenu(prev => !prev);
//     setShowHealthCareMenu(false);
//   };

//   const toggleHealthCareMenu = () => {
//     setShowHealthCareMenu(prev => !prev);
//     setShowCommunityMenu(false);
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(prev => !prev);
//     if (mobileMenuOpen) {
//       setShowCommunityMenu(false);
//       setShowHealthCareMenu(false);
//     }
//   };

//   const handleSearchInputChange = (e) => {
//     setSearchKeyword(e.target.value);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchKeyword.trim()) {
//       router.push(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`, {
//         method: 'POST',
//         credentials: 'include',
//       });

//       setIsLoggedIn(false);
//       setUserRoles([]);
//       window.location.href = '/';
//     } catch (err) {
//       console.error('로그아웃 실패:', err);
//       alert('로그아웃 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <header className="w-full border-b bg-white">
//       <div className="w-4/5 mx-auto px-6 py-6 flex items-center justify-between">
//         <div className="flex items-center space-x-2 cursor-pointer" onClick={goTo('/')}>
//           <span className="text-blue-500 text-4xl font-bold">✓</span>
//           <span className="text-4xl font-bold text-blue-500">Pawple</span>
//         </div>

//         <nav className="hidden md:flex text-gray-700 text-base font-bold items-center space-x-12 ml-10">
//           <button onClick={toggleCommunityMenu} className="hover:text-blue-500">
//             커뮤니티
//           </button>
//           <button onClick={toggleHealthCareMenu} className="hover:text-blue-500">
//             건강관리
//           </button>
//         </nav>

//         <div className="hidden md:flex items-center space-x-6 ml-auto">
//           <div className="relative">
//             <form onSubmit={handleSearchSubmit}>
//               <input
//                 type="text"
//                 placeholder="검색어를 입력해주세요."
//                 value={searchKeyword}
//                 onChange={handleSearchInputChange}
//                 className="border border-gray-300 rounded-full px-4 py-1.5 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <button type="submit" className="absolute right-3 top-1.5 text-gray-500">🔍</button>
//             </form>
//           </div>

//           {isLoggedIn ? (
//             userRoles.length === 0 ? null : (
//               <div className="flex items-center space-x-3">
//                 {userRoles.includes('ADMIN') ? (
//                   <button onClick={goTo('/admin')} className="p-1 rounded hover:bg-gray-100 text-lg">
//                     관리자페이지
//                   </button>
//                 ) : (
//                   <button onClick={goTo('/myPage')} className="p-1 rounded hover:bg-gray-100 text-lg">
//                     마이페이지
//                   </button>
//                 )}
//                 <button onClick={handleLogout} className="p-1 rounded hover:bg-gray-100 text-lg">
//                   로그아웃
//                 </button>
//               </div>
//             )
//           ) : (
//             <button onClick={goTo('/login')} className="p-1 rounded hover:bg-gray-100 text-lg">
//               로그인
//             </button>
//           )}
//         </div>

//         <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={toggleMobileMenu} aria-label="모바일 메뉴 토글">
//           <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//             {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
//           </svg>
//         </button>
//       </div>

//       {showCommunityMenu && (
//         <div className="w-4/5 mx-auto px-4 border-t border-gray-200 md:block hidden">
//           <CommunityMenu visible={showCommunityMenu} />
//         </div>
//       )}

//       {showHealthCareMenu && (
//         <div className="w-4/5 mx-auto px-4 border-t border-gray-200 md:block hidden">
//           <HealthCareMenu />
//         </div>
//       )}

//       {mobileMenuOpen && (
//         <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-4">
//           <button onClick={toggleCommunityMenu} className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500">
//             커뮤니티
//           </button>
//           {showCommunityMenu && <CommunityMenu visible={showCommunityMenu} />}

//           <button onClick={toggleHealthCareMenu} className="block w-full text-left text-gray-700 font-semibold hover:text-blue-500">
//             건강관리
//           </button>
//           {showHealthCareMenu && <HealthCareMenu />}

//           <div className="flex flex-col space-y-2 text-sm">
//             {!isLoggedIn ? (
//               <button onClick={goTo('/login')} className="text-left p-1 rounded hover:bg-gray-100">
//                 로그인
//               </button>
//             ) : (
//               <div className="flex flex-col space-y-2">
//                 {userRoles.includes('ADMIN') ? (
//                   <button onClick={goTo('/admin')} className="text-left p-1 rounded hover:bg-gray-100">
//                     관리자페이지
//                   </button>
//                 ) : (
//                   <button onClick={goTo('/myPage')} className="text-left p-1 rounded hover:bg-gray-100">
//                     마이페이지
//                   </button>
//                 )}
//                 <button onClick={handleLogout} className="text-left p-1 rounded hover:bg-gray-100">
//                   로그아웃
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
