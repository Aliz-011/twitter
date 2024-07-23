import { Post } from '@/components/post';

import { validateRequest } from '@/auth';
import { getPost } from '@/lib/queries';
import { UserInfoSidebar } from './user-info-sidebar';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const generateMetadata = async ({
  params,
}: {
  params: { statusId: string };
}) => {
  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost(params.statusId, user.id);

  return {
    title: `${user.displayName}: ${post.content.slice(0, 50)}...`,
  };
};

const StatusDetailPage = async ({
  params,
}: {
  params: { statusId: string };
}) => {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        You are not authorized to view this page.
      </p>
    );
  }

  const post = await getPost(params.statusId, user.id);

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden md:block lg:w-80 w-72 h-fit flex-none space-y-5">
        <Suspense
          fallback={<Loader2 className="animate-spin size-4 mx-auto" />}
        >
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
};

export default StatusDetailPage;
