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
  title: 'Wakop Kemiri - Warkop Terdekat di Cijenuk, Cililin, Citalem | Kopi Pilihan dengan Suasana Nyaman',
  description: 'Temukan warkop terdekat di Cijenuk, Cililin, dan Citalem. Nikmati kopi premium di Wakop Kemiri dengan suasana yang menenangkan. Tempat nongkrong asyik dengan menu lengkap.',
  keywords: 'wakop kemiri, warkop terdekat, warkop cijenuk, cililin, citalem, kafe, kopi, coffee shop, tempat nongkrong, menu kopi, harga kopi, tempat makan, suasana tenang, pesan online',
  authors: [{ name: 'Wakop Kemiri' }],
  creator: 'Wakop Kemiri',
  publisher: 'Wakop Kemiri',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wakopkemiri.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Wakop Kemiri - Warkop Terdekat di Cijenuk, Cililin, Citalem',
    description: 'Temukan warkop terdekat di Cijenuk, Cililin, dan Citalem. Nikmati kopi premium di Wakop Kemiri dengan suasana yang menenangkan.',
    url: 'https://wakopkemiri.com',
    siteName: 'Wakop Kemiri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605468596782-502ce2012ef0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBzdGVhbSUyMHdvb2RlbiUyMHRhYmxlfGVufDB8MHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=85',
        width: 1200,
        height: 630,
        alt: 'Wakop Kemiri - Warkop Terdekat di Cijenuk, Cililin, Citalem',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wakop Kemiri - Warkop Terdekat di Cijenuk, Cililin, Citalem',
    description: 'Temukan warkop terdekat di Cijenuk, Cililin, dan Citalem. Nikmati kopi premium di Wakop Kemiri dengan suasana yang menenangkan.',
    images: ['https://images.unsplash.com/photo-1605468596782-502ce2012ef0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBzdGVhbSUyMHdvb2RlbiUyMHRhYmxlfGVufDB8MHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=85'],
    creator: '@wakopkemiri',
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
