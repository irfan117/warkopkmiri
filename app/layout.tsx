import './globals.css';
import type { Metadata } from 'next';
import { Fredoka, Quicksand } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['300', '400', '500', '600', '700']
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Kemiri Cafe - Setiap Tegukan Menyimpan Cerita',
  description: 'Nikmati kopi premium dengan suasana yang menenangkan di Kemiri Cafe. Setiap cangkir diracik dengan dedikasi dan rasa yang tak terlupakan. Pesan online sekarang!',
  keywords: 'kafe, kopi, coffee shop, pesan online, cafe jakarta, kopi premium, makanan ringan, suasana tenang',
  authors: [{ name: 'Kemiri Cafe' }],
  creator: 'Kemiri Cafe',
  publisher: 'Kemiri Cafe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kemiricafe.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kemiri Cafe - Setiap Tegukan Menyimpan Cerita',
    description: 'Nikmati kopi premium dengan suasana yang menenangkan. Setiap cangkir diracik dengan dedikasi dan rasa yang tak terlupakan.',
    url: 'https://kemiricafe.com',
    siteName: 'Kemiri Cafe',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605468596782-502ce2012ef0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBzdGVhbSUyMHdvb2RlbiUyMHRhYmxlfGVufDB8MHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=85',
        width: 1200,
        height: 630,
        alt: 'Kemiri Cafe - Premium Coffee Experience',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kemiri Cafe - Setiap Tegukan Menyimpan Cerita',
    description: 'Nikmati kopi premium dengan suasana yang menenangkan. Setiap cangkir diracik dengan dedikasi dan rasa yang tak terlupakan.',
    images: ['https://images.unsplash.com/photo-1605468596782-502ce2012ef0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBzdGVhbSUyMHdvb2RlbiUyMHRhYmxlfGVufDB8MHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=85'],
    creator: '@kemiricafe',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${quicksand.variable} ${fredoka.variable} font-sans bg-[#FDF6F0]`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
