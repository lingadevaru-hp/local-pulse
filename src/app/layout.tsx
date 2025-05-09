
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from '@/components/ThemeProvider';
import AppHeader from '@/components/AppHeader'; // Renamed Header to AppHeader
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';


export const metadata: Metadata = {
  title: 'Vibrate Menux',
  description: 'Discover local events with Vibrate Menux',
  manifest: '/manifest.json',
  appleWebAppCapable: 'yes',
  appleWebAppStatusBarStyle: 'default', // or 'black-translucent'
  appleWebAppTitle: 'Vibrate Menux',
  // Add more PWA related meta tags if needed
  // icons: {
  //   apple: '/apple-touch-icon.png', // Example
  // },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#007AFF' }, // Primary blue for light
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' }, // Dark background for dark
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
              <DesktopSidebar />
              <main className="flex-grow pb-16 md:pb-0"> {/* Padding bottom for mobile nav */}
                {children}
              </main>
            </div>
            <BottomNav />
          </div>
          <Toaster />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
