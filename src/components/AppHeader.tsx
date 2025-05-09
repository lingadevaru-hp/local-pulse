
'use client';
import type { FC } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

const AppHeader: FC = () => {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
          Vibrate Menux
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
