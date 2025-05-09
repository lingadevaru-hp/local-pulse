
import EventFinderApp from '@/components/EventFinderApp';

export default function Home() {
  return (
    <>
      {/* AppHeader is now in RootLayout */}
      <EventFinderApp />
      <footer className="py-6 px-4 text-center text-xs text-muted-foreground border-t border-border/50">
        © {new Date().getFullYear()} Vibrate Menux. All rights reserved.
      </footer>
    </>
  );
}
