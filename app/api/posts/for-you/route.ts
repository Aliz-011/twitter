import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { getPostDataInclude, PostsPage } from '@/types';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await client.post.findMany({
      include: getPostDataInclude(user.id),
      orderBy: {
        createdAt: 'desc',
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ erorr: 'Internal error' }, { status: 500 });
  }
}
