import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

import { QueryProvider } from '@/components/providers/query-provider';
import { SessionProvider } from '@/components/providers/session-provider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'AB Medical CRM - Sales Tracking',
  description: 'CRM Sales Tracking',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={cn('h-full', 'antialiased', poppins.variable, 'font-sans')}
    >
      <body className='min-h-full flex flex-col'>
        <SessionProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
