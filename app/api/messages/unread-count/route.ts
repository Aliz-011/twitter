import { validateRequest } from '@/auth';
import streamServerClient from '@/lib/stream';

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { total_unread_count } = await streamServerClient.getUnreadCount(
      user.id
    );

    const data = { unreadCount: total_unread_count };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ erorr: 'Internal error' }, { status: 500 });
  }
}
