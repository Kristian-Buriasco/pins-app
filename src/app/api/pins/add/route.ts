import { NextResponse } from 'next/server';
import { mockPins } from '@/data/mockPins';
import { Pin } from '@/types/pin';

export async function POST(request: Request) {
  const newPin: Pin = await request.json();
  newPin.id = Date.now().toString(); // Assign a unique ID
  mockPins.push(newPin);
  return NextResponse.json(newPin, { status: 201 });
}
