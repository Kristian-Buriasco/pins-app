import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Pin from '@/models/Pin';

export async function GET() {
  await dbConnect();
  const pins = await Pin.find({});
  // Always return _id as string and as objectId for frontend compatibility
  const pinsWithObjectId = pins.map((pin) => ({
    ...pin.toObject(),
    objectId: pin._id.toString(),
    id: pin._id.toString(),
  }));
  return NextResponse.json(pinsWithObjectId);
}
