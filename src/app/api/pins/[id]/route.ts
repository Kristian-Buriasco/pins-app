import { NextResponse } from 'next/server';
import { mockPins } from '@/data/mockPins';
import { Pin } from '@/types/pin';

function getIdFromUrl(url: string): string | null {
  const match = url.match(/\/pins\/([^/?#]+)/);
  return match ? match[1] : null;
}

export async function GET(request: Request) {
  const id = getIdFromUrl(request.url);
  if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  const pin = mockPins.find((p) => p.id === id);
  if (pin) {
    return NextResponse.json(pin);
  }
  return NextResponse.json({ message: 'Pin not found' }, { status: 404 });
}

export async function PUT(request: Request) {
  const id = getIdFromUrl(request.url);
  if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  const index = mockPins.findIndex((p) => p.id === id);
  if (index !== -1) {
    const updatedPin: Pin = await request.json();
    mockPins[index] = updatedPin;
    return NextResponse.json(updatedPin);
  }
  return NextResponse.json({ message: 'Pin not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const id = getIdFromUrl(request.url);
  if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  const index = mockPins.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockPins.splice(index, 1);
    return NextResponse.json({ message: 'Pin deleted' });
  }
  return NextResponse.json({ message: 'Pin not found' }, { status: 404 });
}
