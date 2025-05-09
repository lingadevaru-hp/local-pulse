
'use client';
import type { FC } from 'react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { Home, UserCircle, LayoutDashboard, Settings, PlusCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter
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

interface AppHeaderProps {
  onOpenCreateEventModal?: () => void; // This prop might not be easily usable if AppHeader is in RootLayout
}

const AppHeader: FC<AppHeaderProps> = ({ onOpenCreateEventModal }) => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize useRouter
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const handleCreateEventClick = () => {
    if (user) {
      // If onOpenCreateEventModal is provided (e.g. if AppHeader was rendered by Home page directly)
      if (onOpenCreateEventModal) {
        onOpenCreateEventModal();
      } else {
        // Fallback: navigate to home page with a query param to trigger modal
        // This is useful if AppHeader is in a global layout
        if (pathname === '/') { // If already on home page
          // Try to directly trigger via a custom event or signal (more complex)
          // For simplicity with current setup, we'll rely on page.tsx listening to this specific query param
          const params = new URLSearchParams(window.location.search);
          if (params.get('createEvent') !== 'true') {
             router.push('/?createEvent=true', { scroll: false });
          } else {
            // If param is already there, it means Home page should be handling it or has handled it.
            // To re-trigger, we might need a different mechanism or let Home page manage.
            // For now, if already on home with param, assume modal is/was handled.
            // A better way would be a global state for the modal.
             window.dispatchEvent(new CustomEvent('openCreateEventModal'));
          }

        } else {
          router.push('/?createEvent=true');
        }
      }
    } else {
      openSignIn({redirectUrl: pathname === '/' ? '/?createEvent=trueAfterSignIn' : '/?createEvent=trueAfterSignIn' });
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
                <div // Changed from <a> to <div> for Link child compatibility if needed
                  aria-label={item.ariaLabel}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl w-20 h-16 transition-all text-xs sm:text-sm cursor-pointer",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 sm:h-6 sm:w-6 mb-0.5", isActive ? "text-primary" : "")} />
                  <span className="font-medium">{item.label}</span>
                </div>
              );

              if (item.protected) {
                return (
                  <SignedIn key={item.label}>
                    <Link href={item.href} passHref legacyBehavior={false}>
                      {linkContent}
                    </Link>
                  </SignedIn>
                );
              }
              return (
                <Link key={item.label} href={item.href} passHref legacyBehavior={false}>
                  {linkContent}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <SignedIn>
               <Button variant="default" size="sm" className="rounded-full px-3 py-1 text-sm shadow-md hidden sm:flex" onClick={handleCreateEventClick}>
                  <PlusCircle className="h-4 w-4 mr-1 sm:mr-1.5" /> Create
              </Button>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{ 
                  elements: { 
                    userButtonAvatarBox: "w-9 h-9 sm:w-10 sm:h-10 shadow-md",
                    userButtonPopoverCard: "glass-effect", 
                  }
                }} 
              />
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
             {/* "Create Event" button visible on mobile when signed in, if above is hidden by sm:flex */}
            <SignedIn>
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 sm:w-10 sm:h-10 shadow-sm sm:hidden" onClick={handleCreateEventClick} aria-label="Create Event">
                    <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
            </SignedIn>
            
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
