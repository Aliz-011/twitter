import dynamic from 'next/dynamic';

import { TrendsSidebar } from '@/components/trends-sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ForYouFeed } from './for-you-feed';
import { FollowingFeed } from './following-feed';

const Editor = dynamic(() => import('../../components/post/editor'), {
  ssr: false,
});

export default async function Home() {
  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Editor />

        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
