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

      // Signal notification for kburiasco@gmail.com only
      if (session.user.email === 'kburiasco@gmail.com') {
        try {
          await fetch('https://signal-cli-rest-api.caprover.kristianburiasco.it/v2/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `New pin added: ${pinObj.name || pinObj.title || 'Untitled Pin'}`,
              number: '+393773042577',
              recipients: ['+393773042577']
            })
          });
        } catch {
          // Ignore notification errors
        }
      }
      return NextResponse.json(pinObj, { status: 201 });
    }
    return NextResponse.json({ message: 'Insert failed' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
