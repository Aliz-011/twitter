import { TrendsSidebar } from '@/components/trends-sidebar';
import { Notifications } from './notifications';

export const metadata = {
  title: 'Notifications',
};

const NotificationsPage = async () => {
  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-xl bg-card border p-5 shadow-sm">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default NotificationsPage;
