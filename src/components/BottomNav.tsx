
'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Home, Search, UserCircle, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search }, // Assuming a /search page might exist
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/organizer', label: 'Dashboard', icon: LayoutDashboard },
];

const BottomNav: FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-border/50 md:hidden z-40">
      <div className="container mx-auto h-full flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs p-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-6 w-6 mb-0.5", isActive ? "fill-primary stroke-primary-foreground dark:stroke-primary" : "")} strokeWidth={isActive ? 2.5: 2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
