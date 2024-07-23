import { validateRequest } from '@/auth';
import { client } from '@/lib/database';

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const unreadCount = await client.notification.count({
      where: {
        recipientId: user.id,
        isRead: false,
      },
    });

    const data = {
      unreadCount,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ erorr: 'Internal error' }, { status: 500 });
  }
}
