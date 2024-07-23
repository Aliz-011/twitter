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

    const bookmark = await client.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId: params.postId,
        },
      },
    });

    if (!bookmark) {
      return Response.json({ error: 'Bookmark not found' }, { status: 401 });
    }

    const data = {
      isBookmarkedByUser: !!bookmark,
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

    await client.bookmark.upsert({
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

    await client.bookmark.deleteMany({
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
