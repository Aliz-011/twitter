import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { getPostDataInclude, PostsPage } from '@/types';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: 'Unauthorized' });
    }

    const pageSize = 10;
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

    const posts = await client.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: user.id,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: pageSize,
      cursor: cursor ? { id: cursor } : undefined,
      include: getPostDataInclude(user.id),
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}
