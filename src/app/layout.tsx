
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from '@/components/ThemeProvider';
import AppHeader from '@/components/AppHeader';
// import BottomNav from '@/components/BottomNav'; // Removed
// import DesktopSidebar from '@/components/DesktopSidebar'; // Removed
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';


export const metadata: Metadata = {
  title: 'Vibrate Menux',
  description: 'Discover local events with Vibrate Menux - Karnataka Edition',
  manifest: '/manifest.json',
  appleWebAppCapable: 'yes',
  appleWebAppStatusBarStyle: 'default', 
  appleWebAppTitle: 'Vibrate Menux',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#007AFF' }, 
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' }, 
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <AppHeader />
            <div className="flex flex-1">
              {/* <DesktopSidebar /> Removed */}
              <main className="flex-grow"> {/* Removed pb-16 md:pb-0, as BottomNav is gone */}
                {children}
              </main>
            </div>
            {/* <BottomNav /> Removed */}
          </div>
          <Toaster />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
