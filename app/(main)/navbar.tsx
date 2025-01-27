import Link from 'next/link';

import { SearchField } from '@/components/search-field';
import { UserButton } from '@/components/user-button';
import { Twitter } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 bg-card border-b shadow-sm">
      <div className="max-w-screen-xl mx-auto flex items-center justify-center flex-wrap gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-sky-500 fill-sky-500">
          <Twitter />
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
};
