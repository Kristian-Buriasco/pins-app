import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WishlistPin from '@/models/WishlistPin';

export async function GET() {
  await dbConnect();
  const wishlistPins = await WishlistPin.find({});
  const pinsWithObjectId = wishlistPins.map((pin) => ({
    ...pin.toObject(),
    objectId: pin._id.toString(),
    id: pin._id.toString(),
  }));
  return NextResponse.json(pinsWithObjectId);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const wishlistPin = await WishlistPin.create(body);
  return NextResponse.json({
    ...wishlistPin.toObject(),
    objectId: wishlistPin._id.toString(),
    id: wishlistPin._id.toString(),
  });
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  await WishlistPin.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
