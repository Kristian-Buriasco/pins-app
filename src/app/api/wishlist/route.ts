import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WishlistPin from '@/models/WishlistPin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import User from '@/models/User';

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json([], { status: 401 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json([], { status: 401 });
  }
  const wishlistPins = await WishlistPin.find({ userId: user._id });
  const pinsWithObjectId = wishlistPins.map((pin) => ({
    ...pin.toObject(),
    objectId: pin._id.toString(),
    id: pin._id.toString(),
  }));
  return NextResponse.json(pinsWithObjectId);
}

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const wishlistPin = await WishlistPin.create({ ...body, userId: user._id });
  return NextResponse.json({
    ...wishlistPin.toObject(),
    objectId: wishlistPin._id.toString(),
    id: wishlistPin._id.toString(),
  });
}

export async function DELETE(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await request.json();
  // Only allow deleting user's own wishlist pins
  await WishlistPin.deleteOne({ _id: id, userId: user._id });
  return NextResponse.json({ success: true });
}
