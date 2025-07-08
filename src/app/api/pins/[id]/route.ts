import { NextResponse } from 'next/server';
import { mockPins } from '@/data/mockPins';
import { Pin } from '@/types/pin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const pin = mockPins.find((p) => p.id === params.id);
  if (pin) {
    return NextResponse.json(pin);
  }
  return NextResponse.json({ message: 'Pin not found' }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = mockPins.findIndex((p) => p.id === params.id);
  if (index !== -1) {
    const updatedPin: Pin = await request.json();
    mockPins[index] = updatedPin;
    return NextResponse.json(updatedPin);
  }
  return NextResponse.json({ message: 'Pin not found' }, { status: 404 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = mockPins.findIndex((p) => p.id === params.id);
  if (index !== -1) {
    mockPins.splice(index, 1);
    return NextResponse.json({ message: 'Pin deleted' });
  }
  return NextResponse.json({ message: 'Pin not found' }, { status: 404 });
}
