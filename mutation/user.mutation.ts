import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { updateUser } from '@/actions/user.actions';
import { useUploadThing } from '@/lib/uploadthing';
import { UpdateUserFormValues } from '@/lib/validation';
import { PostsPage } from '@/types';

export const useUpdateUserMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { startUpload } = useUploadThing('avatar');

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserFormValues;
      avatar?: File;
    }) => {
      return Promise.all([updateUser(values), avatar && startUpload([avatar])]);
    },
    async onSuccess([updatedUser, uploadResult]) {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;
      const queryFilter: QueryFilters = {
        queryKey: ['post-feed'],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((p) => {
                if (p.user.id === updatedUser.id) {
                  return {
                    ...p,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }

                return p;
              }),
            })),
          };
        }
      );
      router.refresh();
      toast.success('Profile updated!');
    },
    onError(error, variables, context) {
      console.error(error);

      toast.error(error.message);
    },
  });

  return mutation;
};
