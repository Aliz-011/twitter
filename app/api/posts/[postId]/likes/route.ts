import { validateRequest } from '@/auth';
import { client } from '@/lib/database';

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await client.post.findUnique({
      where: {
        id: params.postId,
      },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 401 });
    }

    const data = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await client.like.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId: params.postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId: params.postId,
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
  { params }: { params: { postId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await client.like.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId: params.postId,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}