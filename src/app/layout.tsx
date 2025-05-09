
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from '@/components/ThemeProvider';
import AppHeader from '@/components/AppHeader';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { ClerkProvider } from '@clerk/nextjs';


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
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--background))' }, 
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--background))' },  
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
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
      variables: { 
        colorPrimary: 'hsl(var(--primary))',
        colorBackground: 'hsl(var(--background))',
        colorText: 'hsl(var(--foreground))',
        colorInputBackground: 'hsl(var(--input))',
        colorInputText: 'hsl(var(--foreground))',
        borderRadius: 'var(--radius)',
      }
    }}>
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
              <main className="flex-grow pt-20"> 
                {children}
              </main>
            </div>
            <Toaster />
            <ServiceWorkerRegistration />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
