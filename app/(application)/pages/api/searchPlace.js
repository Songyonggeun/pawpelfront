// app/api/searchPlace/route.js
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
  
    const res = await fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}`, {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
      },
    });
  
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'API 호출 실패' }), { status: res.status });
    }
  
    const data = await res.json();
    return Response.json(data);
  }
  