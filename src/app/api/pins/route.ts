import { NextResponse } from 'next/server';
import { mockPins } from '@/data/mockPins';

export async function GET() {
  // In a real application, you'd fetch this from a database.
  return NextResponse.json(mockPins);
}
