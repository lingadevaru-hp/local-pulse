
'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Home, Search, UserCircle, LayoutDashboard, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/organizer', label: 'Dashboard', icon: LayoutDashboard },
];

const DesktopSidebar: FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-background/80 dark:bg-zinc-900/80 backdrop-blur-md border-r border-border/50 p-4 space-y-4 sticky top-0 left-0 z-30 overflow-y-auto">
      <nav className="flex-grow space-y-2 pt-16"> {/* pt-16 to account for sticky header */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md scale-105" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "" : "")} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Example settings link at bottom */}
      <div className="mt-auto">
         <Link
            href="/settings"
            className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                pathname === '/settings' ? "bg-primary text-primary-foreground" : ""
            )}
            >
            <Settings className="h-5 w-5" />
            <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
