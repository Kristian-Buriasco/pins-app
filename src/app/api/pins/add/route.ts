import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Pin from '@/models/Pin';

export async function POST(request: Request) {
  const body = await request.json();
  await dbConnect();
  // Use insertOne to bypass all validation for POST
  try {
    const result = await Pin.collection.insertOne(body);
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
