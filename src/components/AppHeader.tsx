
'use client';
import type { FC } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { Home, UserCircle, LayoutDashboard, Settings, PlusCircle, LogIn, UserPlus, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton, useClerk } from '@clerk/nextjs';

interface NavItem {
  href: string;
  label: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  ariaLabel: string;
}

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, ariaLabel: 'Go to Home page' },
  { href: '/profile', label: 'Profile', icon: UserCircle, ariaLabel: 'Go to Profile page' },
  { href: '/organizer', label: 'Dashboard', icon: LayoutDashboard, ariaLabel: 'Go to Organizer Dashboard' },
];

const AppHeader: FC = () => {
  const pathname = usePathname();
  const { openSignIn, openSignUp } = useClerk();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left: App Title */}
        <Link href="/" className="text-2xl font-semibold tracking-tight text-foreground whitespace-nowrap">
          Local Pulse
        </Link>

        {/* Center: Main Navigation Icons */}
        <nav className="flex-grow flex justify-center items-center space-x-1 sm:space-x-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} passHref legacyBehavior>
                <a
                  aria-label={item.ariaLabel}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl w-20 h-16 transition-all text-xs sm:text-sm",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 sm:h-6 sm:w-6 mb-0.5", isActive ? "text-primary" : "")} />
                  <span className="font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
            <SignedIn>
                {/* UserButton will show avatar and manage profile/sign out */}
            </SignedIn>
            <SignedOut>
                 {/* The Sign In/Up button that was here has been removed as per user request. 
                     The Sign In and Sign Up buttons in the "Right: Action Buttons & Toggles" section remain. 
                 */}
            </SignedOut>
        </nav>

        {/* Right: Action Buttons & Toggles */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 sm:w-10 sm:h-10"}}} />
            <Button variant="default" size="sm" className="rounded-full px-3 py-1 text-sm" asChild>
                <Link href="/events/create">
                <PlusCircle className="h-4 w-4 mr-1 sm:mr-1.5" /> Create
                </Link>
            </Button>
          </SignedIn>
          <SignedOut>
             <Button variant="default" size="sm" className="hidden sm:inline-flex rounded-full px-3 py-1 text-sm" onClick={() => openSignIn()}>
                Sign In / Sign Up
             </Button>
          </SignedOut>
          
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 sm:w-10 sm:h-10" aria-label="Settings">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
