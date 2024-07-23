import { client } from '@/lib/database';
import { UTApi } from 'uploadthing/server';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { message: 'Invalid authorization header' },
        { status: 401 }
      );
    }

    const unusedMedia = await client.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === 'production'
          ? { createdAt: { lte: new Date(Date.now() - 1000 * 60 * 60 * 24) } }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    new UTApi().deleteFiles(
      unusedMedia.map(
        (media) =>
          media.url.split(
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
          )[1]
      )
    );

    await client.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((media) => media.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}
