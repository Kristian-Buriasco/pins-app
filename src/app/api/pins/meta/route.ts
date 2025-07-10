import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Pin from '@/models/Pin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ countries: [], events: [], categories: [], locations: [], types:[] }, { status: 401 });
  }

  // Get all unique countries, events, categories, and locations
  const countries = await Pin.distinct('countryOfOrigin');
  const events = await Pin.distinct('eventOfOrigin');
  const categories = await Pin.distinct('category');
  const locations = await Pin.distinct('locationFound');
  const types = await Pin.distinct('type');

  return NextResponse.json({ countries, events, categories, locations, types });
}
