import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900']
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Kemiri Cafe",
              "description": "Nikmati kopi premium dengan suasana yang menenangkan. Setiap cangkir diracik dengan dedikasi dan rasa yang tak terlupakan.",
              "url": "https://kemiricafe.com",
              "telephone": "(021) 1234-5678",
              "email": "info@kemiricafe.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jl. Sudirman No. 123",
                "addressLocality": "Jakarta Pusat",
                "addressRegion": "DKI Jakarta",
                "postalCode": "10270",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -6.200000,
                "longitude": 106.816666
              },
              "openingHours": [
                "Mo-Th 07:00-22:00",
                "Fr 07:00-23:00",
                "Sa-Su 08:00-23:00"
              ],
              "servesCuisine": ["Coffee", "Indonesian", "Western"],
              "priceRange": "$$",
              "image": "https://images.unsplash.com/photo-1605468596782-502ce2012ef0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBzdGVhbSUyMHdvb2RlbiUyMHRhYmxlfGVufDB8MHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=85",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "500"
              },
              "sameAs": [
                "https://www.facebook.com/kemiricafe",
                "https://www.instagram.com/kemiricafe",
                "https://wa.me/6281234567890"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
