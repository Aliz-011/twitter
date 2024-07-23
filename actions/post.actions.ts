'use server';

import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { postSchema } from '@/lib/validation';
import { getPostDataInclude } from '@/types';

export const createPost = async (values: {
  content: string;
  mediaIds: string[];
}) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { content, mediaIds } = postSchema.parse(values);

  const newPost = await client.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
};

export const deletePost = async (id: string) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const post = await client.post.findUnique({ where: { id } });

  if (!post) {
    throw new Error('Not found');
  }

  if (post.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  const deletedPost = await client.post.delete({
    where: { id },
    include: getPostDataInclude(user.id),
  });

  return deletedPost;
};
