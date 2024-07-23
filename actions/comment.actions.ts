'use server';

import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { createCommentSchema } from '@/lib/validation';
import { getCommentDataInclude, PostData } from '@/types';

export const createComment = async ({
  content,
  post,
}: {
  post: PostData;
  content: string;
}) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { content: commentValidated } = createCommentSchema.parse({ content });

  const newComment = await client.comment.create({
    data: {
      content: commentValidated,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  });

  return newComment;
};

export const deleteComment = async (commentId: string) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const comment = await client.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) throw new Error('Comment not found');

  if (comment.userId !== user.id) throw new Error('Unauthorized');

  const deletedComment = await client.comment.delete({
    where: { id: commentId },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
};
