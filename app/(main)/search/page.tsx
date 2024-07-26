import { TrendsSidebar } from '@/components/trends-sidebar';
import { SearchResults } from './search-results';

export const generateMetadata = ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  return {
    title: `Search results for "${searchParams.q}"`,
  };
};

const SearchPage = ({ searchParams }: { searchParams: { q: string } }) => {
  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-xl bg-card border p-5 shadow-sm">
          <h1 className="text-2xl font-bold line-clamp-2 break-all">
            Search results for &quot;{searchParams.q}&quot;
          </h1>
        </div>
        <SearchResults query={searchParams.q} />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default SearchPage;
