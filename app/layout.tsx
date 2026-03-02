import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';
import { UserProvider } from '@/context/user-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Onyx',
  description: 'A minimalist black and white chat messenger.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Onyx',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-black text-white antialiased selection:bg-white selection:text-black overflow-x-hidden overscroll-behavior-y-none">
        <UserProvider>
          <main className="flex flex-col min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))]">
            {children}
          </main>
          <BottomNav />
        </UserProvider>
      </body>
    </html>
  );
}
