import { Outfit } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Puf Örgü - El Yapımı Örgü Ürünleri',
  description: 'El emeği, göz nuru örgü tasarımlar. El yapımı puflar, sepetler ve dekoratif örgü ürünleri. Kişiye özel üretim ile hayalinizdeki örgü ürünleri.',
  keywords: 'el örgüsü, puf, sepet, makrome, el yapımı, örgü ürünleri, dekoratif, ev dekorasyonu',
  authors: [{ name: 'Puf Örgü' }],
  creator: 'Puf Örgü',
  openGraph: {
    title: 'Puf Örgü - El Yapımı Örgü Ürünleri',
    description: 'El emeği, göz nuru örgü tasarımlar. El yapımı puflar, sepetler ve dekoratif örgü ürünleri.',
    url: 'https://puforgu.com',
    siteName: 'Puf Örgü',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Puf Örgü - El Yapımı Örgü Ürünleri',
    description: 'El emeği, göz nuru örgü tasarımlar.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={outfit.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#FAF7F2" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
