import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from '@/components/ThemeProvider';
import AppHeader from '@/components/AppHeader';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Local Pulse - Event Finder',
  description: 'Discover and manage events in Karnataka',
  manifest: '/manifest.json',
  themeColor: '#007AFF',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Local Pulse',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
      variables: { 
        colorPrimary: 'hsl(210 100% 50%)', // Apple Blue
        colorBackground: 'hsl(0 0% 98%)', // Light theme background
        colorText: 'hsl(240 10% 3.9%)', // Light theme foreground
        colorInputBackground: 'hsl(210 20% 90%)', // Light theme input background
        colorInputText: 'hsl(240 10% 3.9%)', // Light theme input text
        borderRadius: '0.75rem', // Uses the value of --radius from globals.css (12px)
      },
      elements: { 
        card: 'bg-card text-card-foreground border-border shadow-xl rounded-2xl', 
        formButtonPrimary:
          'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring',
        socialButtonsBlockButton:
          'border-border hover:bg-muted/50',
        dividerLine: 'bg-border',
        formFieldInput:
          'bg-input border-border focus:ring-ring focus:border-ring rounded-lg', 
        footerActionLink:
          'text-primary hover:text-primary/80',
      }
    }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#007AFF" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Local Pulse" />
        </head>
        <body className={inter.className}>
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
  )
}

