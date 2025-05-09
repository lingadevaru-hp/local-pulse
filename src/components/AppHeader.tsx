
'use client';
import type { FC } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { Home, Search, UserCircle, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/organizer', label: 'Dashboard', icon: LayoutDashboard },
];

const AppHeader: FC = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* Left: App Title */}
        <div className="flex-none w-1/3 flex justify-start">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-foreground whitespace-nowrap">
            Vibrate Menux
          </Link>
        </div>

        {/* Center: Navigation Icons */}
        <nav className="flex-grow flex justify-center items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} passHref legacyBehavior>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label={item.label}
                  className={cn(
                    "w-10 h-10 rounded-full",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", isActive ? "text-primary" : "")} />
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle */}
        <div className="flex-none w-1/3 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
