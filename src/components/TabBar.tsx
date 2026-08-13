import { NavLink } from 'react-router-dom';
import { BarChart3, Users, Settings } from 'lucide-react';

const TAB_ITEMS = [
  { path: '/', label: '统计', Icon: BarChart3, end: true },
  { path: '/records', label: '记录', Icon: Users, end: false },
  { path: '/settings', label: '设置', Icon: Settings, end: false },
];

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[70px] border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-full max-w-md items-center justify-around px-4">
        {TAB_ITEMS.map(item => {
          const Icon = item.Icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center gap-1 transition-opacity active:opacity-60 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              <Icon className="h-6 w-6" strokeWidth={1.8} />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
