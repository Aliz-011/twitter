import { TrendsSidebar } from '@/components/trends-sidebar';
import { BookmarksFeed } from './bookmarks-feed';

const BookmarksPage = async () => {
  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-xl bg-card border p-5 shadow-sm">
          <h1 className="text-2xl font-bold">Bookmarks page</h1>
        </div>
        <BookmarksFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default BookmarksPage;
