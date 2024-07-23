import { unstable_cache } from 'next/cache';
import { client } from './database';
import { cache } from 'react';
import { getPostDataInclude, getUserDataSelect } from '@/types';
import { notFound } from 'next/navigation';

export const getTrendingTropics = unstable_cache(
  async () => {
    const result = await client.$queryRaw<{ hashtag: string; count: bigint }[]>`
      SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count 
      FROM posts 
      GROUP BY (hashtag) 
      ORDER BY count DESC, hashtag ASC 
      LIMIT 5
    `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ['trending_tropics'],
  {
    revalidate: 3 * 60 * 60,
  }
);

export const getUser = cache(
  async (username: string, loggedInUserId: string) => {
    const user = await client.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      select: getUserDataSelect(loggedInUserId),
    });

    if (!user) {
      notFound();
    }

    return user;
  }
);

export const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await client.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) {
    notFound();
  }

  return post;
});
