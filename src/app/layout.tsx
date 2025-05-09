
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from '@/components/ThemeProvider';
import AppHeader from '@/components/AppHeader';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';


export const metadata: Metadata = {
  title: 'Local Pulse',
  description: 'Discover local events in Karnataka with Local Pulse',
  manifest: '/manifest.json',
  appleWebAppCapable: 'yes',
  appleWebAppStatusBarStyle: 'default', 
  appleWebAppTitle: 'Local Pulse',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#007AFF' }, 
    { media: '(prefers-color-scheme: dark)', color: '#0A0A' }, 
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
            <main className="flex-grow pt-20"> {/* Added pt-20 for fixed header */}
              {children}
            </main>
          </div>
          <Toaster />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
