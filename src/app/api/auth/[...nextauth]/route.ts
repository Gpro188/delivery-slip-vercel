// Authentication disabled - all routes are publicly accessible
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ auth: 'disabled' });
}

export async function POST(request: Request) {
  return NextResponse.json({ auth: 'disabled' });
}
