import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const body = await request.text();
  const res = await fetch('http://localhost:3001/solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return NextResponse.json(await res.json());
}
