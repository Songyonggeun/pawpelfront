import { NextResponse } from 'next/server';

export async function GET(req) {
  const query = req.nextUrl.searchParams.get('query');
  if (!query) return NextResponse.json({ error: 'Query missing' }, { status: 400 });

  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Missing Naver API credentials' }, { status: 500 });
  }

  const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=10&start=1&sort=random`;

  const response = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Naver API Error:', text);
    return NextResponse.json({ error: 'Naver API failed', detail: text }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
