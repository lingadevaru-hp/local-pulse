
'use client';
import type { FC } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { Home, Search, UserCircle, LayoutDashboard, Settings, PlusCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  href: string;
  label: string;
  icon: FC<React.SVGProps<SVGSVGElement>>; // Allow any Lucide icon
  ariaLabel: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, ariaLabel: 'Go to Home page' },
  { href: '/search', label: 'Search', icon: Search, ariaLabel: 'Go to Search page' },
  { href: '/profile', label: 'Profile', icon: UserCircle, ariaLabel: 'Go to Profile page' },
  { href: '/organizer', label: 'Dashboard', icon: LayoutDashboard, ariaLabel: 'Go to Organizer Dashboard' },
];

const AppHeader: FC = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left: App Title */}
        <Link href="/" className="text-2xl font-semibold tracking-tight text-foreground whitespace-nowrap">
          Local Pulse
        </Link>

        {/* Center: Navigation Icons */}
        <nav className="hidden md:flex flex-grow justify-center items-center space-x-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} passHref legacyBehavior>
                <a
                  aria-label={item.ariaLabel}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl w-20 h-16 transition-all",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("h-6 w-6 mb-0.5", isActive ? "text-primary" : "")} />
                  <span className="text-xs font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Right: Action Buttons & Toggles */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full px-3 py-1 text-sm" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-full px-3 py-1 text-sm" asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
           <Button variant="default" size="sm" className="rounded-full px-3 py-1 text-sm" asChild>
            <Link href="/events/create">
              <PlusCircle className="h-4 w-4 mr-1.5" /> Create Event
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
      {/* Mobile Bottom Nav (or alternative nav pattern) - showing main icons for mobile for now */}
      <nav className="md:hidden flex fixed bottom-0 left-0 right-0 glass-effect border-t h-16 justify-around items-center">
         {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label + "-mobile"} href={item.href} passHref legacyBehavior>
                <a
                  aria-label={item.ariaLabel}
                  className={cn(
                    "flex flex-col items-center justify-center p-1 rounded-lg w-16 h-14 transition-all",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
          <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center p-1 rounded-lg w-16 h-14 text-muted-foreground hover:text-foreground hover:bg-muted/50" asChild>
            <Link href="/auth/signin">
                <UserCircle className="h-5 w-5 mb-0.5" />
                <span className="text-[10px] font-medium">Sign In</span>
            </Link>
          </Button>
      </nav>
    </header>
  );
};

export default AppHeader;
