
'use client';
import type { FC } from 'react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { Home, UserCircle, LayoutDashboard, Settings, PlusCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton, useClerk, useUser } from '@clerk/nextjs';
import SettingsPanel from './SettingsPanel'; 

interface NavItem {
  href: string;
  label: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  ariaLabel: string;
  protected?: boolean; 
}

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, ariaLabel: 'Go to Home page' },
  { href: '/profile', label: 'Profile', icon: UserCircle, ariaLabel: 'Go to Profile page', protected: true },
  { href: '/organizer', label: 'Dashboard', icon: LayoutDashboard, ariaLabel: 'Go to Organizer Dashboard', protected: true },
];

// Prop type for AppHeader if it needs to control CreateEventModal on parent
interface AppHeaderProps {
  onOpenCreateEventModal?: () => void;
}

const AppHeader: FC<AppHeaderProps> = ({ onOpenCreateEventModal }) => {
  const pathname = usePathname();
  const { openSignIn, signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const handleCreateEventClick = () => {
    if (user) {
      if (onOpenCreateEventModal) {
        onOpenCreateEventModal();
      } else {
        // Fallback or direct navigation if prop not provided
        // For this setup, we assume parent (page.tsx) handles modal state
        console.warn("onOpenCreateEventModal not provided to AppHeader");
      }
    } else {
      openSignIn({redirectUrl: pathname});
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-foreground whitespace-nowrap">
            Local Pulse
          </Link>

          <nav className="flex-grow flex justify-center items-center space-x-1 sm:space-x-2">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              const linkContent = (
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
              );

              if (item.protected) {
                return (
                  <SignedIn key={item.label}>
                    <Link href={item.href} passHref legacyBehavior>
                      {linkContent}
                    </Link>
                  </SignedIn>
                );
              }
              return (
                <Link key={item.label} href={item.href} passHref legacyBehavior>
                  {linkContent}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{ 
                  elements: { 
                    userButtonAvatarBox: "w-9 h-9 sm:w-10 sm:h-10 shadow-md",
                    userButtonPopoverCard: "glass-effect", 
                  }
                }} 
              />
              <Button variant="default" size="sm" className="rounded-full px-3 py-1 text-sm shadow-md" onClick={handleCreateEventClick}>
                  <PlusCircle className="h-4 w-4 mr-1 sm:mr-1.5" /> Create
              </Button>
            </SignedIn>
            <SignedOut>
              <Button 
                  variant="default" 
                  size="sm" 
                  className="rounded-full px-3 py-1.5 text-sm shadow-md" 
                  onClick={() => openSignIn({redirectUrl: pathname})}
                >
                  Sign In / Up
              </Button>
            </SignedOut>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-9 h-9 sm:w-10 sm:h-10 shadow-sm" 
              aria-label="Settings"
              onClick={() => setIsSettingsPanelOpen(true)}
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <SettingsPanel isOpen={isSettingsPanelOpen} onClose={() => setIsSettingsPanelOpen(false)} />
    </>
  );
};

export default AppHeader;
