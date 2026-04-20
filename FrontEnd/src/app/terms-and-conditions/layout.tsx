import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Asia Drone Store',
  description: 'Read the terms and conditions for using Asia Drone Store services. Our legal agreement covers drone safety, regulations, shipping, and more.',
  keywords: ['drone terms','DGCA','drone activities','drone regulations India', 'Asia Drone Store terms', 'drone safety guidelines','drone rules','drone laws'],
  openGraph: {
    title: 'Terms and Conditions | Asia Drone Store',
    description: 'Understand your rights and responsibilities when using Asia Drone Store.',
    url: 'https://asiadronestore.online/terms-and-conditions',
    siteName: 'Asia Drone Store',
    images: [
      {
        url: 'https://asiadronestore.online/log-ads.png',
        width: 1200,
        height: 630,
        alt: 'Asia Drone Store Terms and Conditions',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms and Conditions | Asia Drone Store',
    description: 'Read the legal terms for using Asia Drone Store.',
    images: ['/log-ads.png'],
  },
  robots:{
    index:true,
    follow:true,
    googleBot:{
      index:true,
      follow:true,
      'max-video-preview':-1,
      'max-image-preview':'large',
      'max-snippet':-1,
    },
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
