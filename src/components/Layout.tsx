import { Outlet, useLocation } from 'react-router-dom';
import TabBar from './TabBar';

const TAB_PATHS = ['/', '/records', '/settings'];

export const Layout = () => {
  const location = useLocation();
  const showTabBar = TAB_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className={`mx-auto w-full max-w-md ${showTabBar ? 'pb-[80px]' : ''}`}>
        <Outlet />
      </main>
      {showTabBar && <TabBar />}
    </div>
  );
};
