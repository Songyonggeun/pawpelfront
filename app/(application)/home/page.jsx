// import React from "react";

// export default function HomePage() {
//   return (
//     <div>
//       <h1>테스트 문장</h1>
//       <p>이 페이지는 /home 경로에 표시되는 테스트 페이지입니다.</p>
//     </div>
//   );
// }



import { redirect } from 'next/navigation';

export default function HomeRedirectPage() {
  redirect('/');
}
