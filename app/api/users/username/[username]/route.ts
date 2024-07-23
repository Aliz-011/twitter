import { NextRequest } from 'next/server';

import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { getUserDataSelect } from '@/types';

export async function GET(
  req: NextRequest,
  { params: { username } }: { params: { username: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    console.log(username);

    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await client.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      select: getUserDataSelect(loggedInUser.id),
    });

    console.log(user);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}
