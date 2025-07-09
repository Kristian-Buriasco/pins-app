import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from './dbConnect';

async function fetchUserFromDatabaseByEmail(email: string): Promise<{ _id: string } | null> {
    // Get the user from your database using the email directly
    dbConnect();
    const User = (await import('@/models/User')).default; // Dynamically import User model
    const user = await User.findOne<{ _id: string }>({ email }).select('_id').lean();
    return user ? { _id: user._id as string } : null;
}

export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) return null;
  // You may need to fetch the user from DB to get their _id if not in session
  // Fetch the user from the database to get their _id if not in session
  const user = await fetchUserFromDatabaseByEmail(session.user.email);
  return user?._id || session.user.email;
}
