export default function TestErrorPage() {
  // 의도적으로 에러 던지기
  throw new Error("서버 에러 테스트용 에러 발생!");

  // return <div>이 코드는 절대 도달하지 않습니다.</div>
}