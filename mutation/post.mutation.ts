import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createPost, deletePost } from '@/actions/post.actions';
import { PostData, PostsPage } from '@/types';
import { useSession } from '@/hooks/use-session';

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ['post-feed'],
        predicate(query) {
          return (
            query.queryKey.includes('for-you') ||
            (query.queryKey.includes('user-posts') &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        // @ts-ignore
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        }
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast.success('Post created');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to create post. Please try again.');
    },
  });

  return mutation;
};

export const useDeletePostMutation = (post: PostData) => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ['post-feed'] };
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) {
            return;
          }

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        }
      );

      toast.success('Post deleted!');

      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/${deletedPost.user.username}`);
      }
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(error.message);
    },
  });

  return mutation;
};
