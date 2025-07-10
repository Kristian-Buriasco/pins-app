import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Pin from '@/models/Pin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';


export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json([], { status: 401 });
  }

  let pins;
  if (userId) {
    // If userId is provided, show only that user's pins
    pins = await Pin.find({ userId });
  } else {
    // Otherwise, show all pins
    pins = await Pin.find({});
  }
  const pinsWithObjectId = pins.map((pin) => ({
    ...pin.toObject(),
    objectId: pin._id.toString(),
    id: pin._id.toString(),
  }));
  return NextResponse.json(pinsWithObjectId);
}
