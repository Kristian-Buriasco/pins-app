import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Pin from '@/models/Pin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import User from '@/models/User';

export async function POST(request: Request) {
  const body = await request.json();
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  // Find the user's _id
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Attach userId to the pin
    const result = await Pin.collection.insertOne({ ...body, userId: user._id });
    const insertedPin = await Pin.findById(result.insertedId);
    if (insertedPin) {
      const pinObj = insertedPin.toObject();
      pinObj.objectId = insertedPin._id.toString();
      pinObj.id = insertedPin._id.toString();
      return NextResponse.json(pinObj, { status: 201 });
    }
    return NextResponse.json({ message: 'Insert failed' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
