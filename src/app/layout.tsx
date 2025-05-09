
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
        colorPrimary: 'hsl(210, 100%, 50%)', // Apple Blue, corrected HSL format
        colorBackground: 'hsl(0, 0%, 98%)', // Light theme background, corrected HSL format
        colorText: 'hsl(240, 10%, 3.9%)', // Light theme foreground, corrected HSL format
        colorInputBackground: 'hsl(210, 20%, 90%)', // Light theme input background, corrected HSL format
        colorInputText: 'hsl(240, 10%, 3.9%)', // Light theme input text, corrected HSL format
        borderRadius: '0.75rem', // Uses the value of --radius from globals.css (12px)
      },
      elements: { // Further customization to match ShadCN/Apple style
        card: 'bg-card text-card-foreground border-border shadow-xl rounded-2xl', // More rounded like Apple modals
        formButtonPrimary:
          'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring',
        socialButtonsBlockButton:
          'border-border hover:bg-muted/50',
        dividerLine: 'bg-border',
        formFieldInput:
          'bg-input border-border focus:ring-ring focus:border-ring rounded-lg', // More rounded inputs
        footerActionLink:
          'text-primary hover:text-primary/80',
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

