import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { FollowerInfo } from '@/types';

export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' });
    }

    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' });
    }

    await client.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      },
      create: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' });
    }

    await client.follow.deleteMany({
      where: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}
