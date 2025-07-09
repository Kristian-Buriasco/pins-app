import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Pin from '@/models/Pin';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const filter = userId ? { userId } : {};
  const pins = await Pin.find(filter);
  const pinsWithObjectId = pins.map((pin) => ({
    ...pin.toObject(),
    objectId: pin._id.toString(),
    id: pin._id.toString(),
  }));
  return NextResponse.json(pinsWithObjectId);
}
