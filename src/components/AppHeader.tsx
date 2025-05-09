
'use client';
import type { FC } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppHeader: FC = () => {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
          Vibrate Menux
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/notifications" passHref legacyBehavior>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="w-10 h-10 rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

