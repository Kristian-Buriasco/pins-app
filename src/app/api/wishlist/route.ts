import { NextResponse } from 'next/server';
import { mockWishlist } from '@/data/mockWishlist';

export async function GET() {
  // In a real application, you'd fetch this from a database.
  return NextResponse.json(mockWishlist);
}
