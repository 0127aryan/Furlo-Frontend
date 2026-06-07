import type { Metadata } from 'next'
import { DM_Sans, Literata, Geist } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { cn } from "@/lib/utils";
import { AppShell } from '@/components/AppShell'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | ${process.env.NEXT_PUBLIC_APP_TAGLINE}`,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  keywords: ['furlo', 'pet community', 'dog community', 'pet parents india', 'bangalore pets'],
  openGraph: {
    title: `${process.env.NEXT_PUBLIC_APP_NAME} | ${process.env.NEXT_PUBLIC_APP_TAGLINE}`,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        {/* <meta name="google-site-verification" content="3sMlk6H-uzQuQLCJQ7jO7oF1XXwm-tmyQagKEH7jGis" /> 
        <meta name="google-adsense-account" content="ca-pub-9411289097087946" /> */}
      </head>
      <body className={`${dmSans.variable} ${literata.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GKGESZZQVE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-GKGESZZQVE');
          `}
        </Script> */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
