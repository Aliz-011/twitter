'use server';

import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { postSchema } from '@/lib/validation';
import { postDataInclude } from '@/types';

export const createPost = async (value: string) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { content } = postSchema.parse({ content: value });

  const newPost = await client.post.create({
    data: {
      userId: user.id,
      content,
    },
    include: postDataInclude,
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
    include: postDataInclude,
  });

  return deletedPost;
};
