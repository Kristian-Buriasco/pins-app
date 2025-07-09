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

  try {
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }
    const result = await db.collection('pins').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: body },
      { returnDocument: 'after' }
    );
    if (result && result.value) {
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
