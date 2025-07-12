import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Pin from '@/models/Pin';
// import { Pin as PinType } from '@/types/pin';
import mongoose from 'mongoose';

function getIdFromUrl(url: string): string | null {
  const match = url.match(/\/pins\/([^/?#]+)/);
  return match ? match[1] : null;
}

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(request: Request) {
  const id = getIdFromUrl(request.url);
  if (!id || !isValidObjectId(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  await dbConnect();
  const pin = await Pin.findById(id);
  if (pin) {
    return NextResponse.json(pin);
  }
  return NextResponse.json({ message: 'Pin not found' }, { status: 404 });
}

export async function PUT(request: Request) {
  const id = getIdFromUrl(request.url);
  if (!id || !isValidObjectId(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }
  await dbConnect();
  const body = await request.json();

  // Remove _id if present to avoid immutable field error
  if ('_id' in body) {
    delete body._id;
  }

  // Get user session for notification
  const { getServerSession } = await import('next-auth');
  const { authOptions } = await import('@/app/api/auth/[...nextauth]/options');
  const session = await getServerSession(authOptions);

  try {
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }
    // Get previous pin state for quantity check
    const prevPin = await db.collection('pins').findOne({ _id: new mongoose.Types.ObjectId(id) });
    const result = await db.collection('pins').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: body },
      { returnDocument: 'after' }
    );
    if (result && result.value) {
      // Signal notification for kburiasco@gmail.com only, if quantity drops to 3, 2, or 1
      if (
        session?.user?.email === 'kburiasco@gmail.com' &&
        typeof prevPin?.totalCount === 'number' &&
        typeof result.value.totalCount === 'number'
      ) {
        let notificationMessage = '';
        let base64_attachments: string[] = [];
        // Attach the first pin image if available and it's a base64 data URL
        if (result.value.photos && result.value.photos.length > 0) {
          const firstPhoto = result.value.photos[0];
          if (firstPhoto.startsWith('data:image/')) {
            base64_attachments = [firstPhoto];
          }
        }
        if (prevPin.totalCount > 3 && result.value.totalCount === 3) {
          notificationMessage = `Low stock warning: ${result.value.name || result.value.title || 'Untitled Pin'} has only 3 left.`;
        } else if (prevPin.totalCount > 2 && result.value.totalCount === 2) {
          notificationMessage = `Trading advisory: ${result.value.name || result.value.title || 'Untitled Pin'} has only 2 left. Trading is not recommended.`;
        } else if (prevPin.totalCount > 1 && result.value.totalCount === 1) {
          notificationMessage = `Critical alert: ${result.value.name || result.value.title || 'Untitled Pin'} is your last one. Trading is blocked to preserve your collection.`;
        }
        if (notificationMessage) {
          try {
            await fetch('https://signal-cli-rest-api.caprover.kristianburiasco.it/v2/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: notificationMessage,
                number: '+393773042577',
                recipients: ['+393773042577'],
                notify_self: true,
                base64_attachments
              })
            });
          } catch {
            // Ignore notification errors
          }
        }
      }
      return NextResponse.json({ message: 'Pin updated successfully', pin: result.value });
    }
    return NextResponse.json({ message: 'Pin not found or no changes made' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const id = getIdFromUrl(request.url);
  if (!id || !isValidObjectId(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  await dbConnect();
  try {
    const deleted = await Pin.findByIdAndDelete(id);
    if (deleted) {
      return NextResponse.json({ message: 'Pin deleted' });
    }
    return NextResponse.json({ message: 'Pin not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
