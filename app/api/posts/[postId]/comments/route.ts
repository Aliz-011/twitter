import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { CommentsPage, getCommentDataInclude } from '@/types';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

    const pageSize = 5;

    const comments = await client.comment.findMany({
      where: {
        postId: params.postId,
      },
      include: getCommentDataInclude(loggedInUser.id),
      orderBy: {
        createdAt: 'asc',
      },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const previousCursor = comments.length > pageSize ? comments[0].id : null;

    const data: CommentsPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}
