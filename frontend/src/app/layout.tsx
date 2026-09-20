import type { Metadata } from 'next';
import { Roboto, Open_Sans, Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { cn } from '@/lib/utils';
import { ApolloWrapper } from '@/lib/apollo-wrapper';
import Header from '@/components/layout/header/Header';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { GlobalErrorHandler } from '@/components/ui/global-error-handler';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

const openSans = Open_Sans({
  variable: '--open-sans',
  subsets: ['latin', 'cyrillic'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Магазин мебели и аксессуаров для дома - SitDownPls',
  description: 'Магазин мебели SitDownPls',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='ru'
      className={cn(
        'h-full',
        'antialiased',
        'font-sans',
        roboto.variable,
        openSans.variable,
        playfairDisplay.variable,
      )}
    >
      <body className='min-h-full flex flex-col'>
        <ApolloWrapper>
          <GlobalErrorHandler />
          <Header />
          <ErrorBoundary>
            <main className='flex-1 w-full'>{children}</main>
          </ErrorBoundary>
          <Toaster
            position='top-center'
            richColors
            closeButton
            duration={4000}
          />
        </ApolloWrapper>
      </body>
    </html>
  );
}
