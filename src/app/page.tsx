import EventFinderApp from '@/components/EventFinderApp';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <EventFinderApp />
      </main>
      <footer className="py-6 px-4 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Event Finder. All rights reserved.
      </footer>
    </div>
  );
}
