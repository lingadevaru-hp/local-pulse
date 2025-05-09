
import EventFinderApp from '@/components/EventFinderApp';

export default function Home() {
  return (
    <>
      <EventFinderApp />
      <footer className="py-6 px-4 text-center text-xs text-muted-foreground border-t border-border/50 mt-8">
        © {new Date().getFullYear()} Vibrate Menux. All rights reserved.
      </footer>
    </>
  );
}
