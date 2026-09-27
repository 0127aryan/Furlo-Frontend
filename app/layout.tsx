import type { Metadata } from 'next'
import { DM_Sans, Literata, Geist, Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";
import { AnalyticsProviders } from '@/components/AnalyticsProviders'
import { AppShell } from '@/components/AppShell'
import { AdSenseGate } from '@/components/ads/AdSenseGate'
import { GoogleAnalyticsGate } from '@/components/GoogleAnalyticsGate'

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

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

const gaId = process.env.NEXT_PUBLIC_GA_ID
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

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
  ...(googleVerification && {
    verification: {
      google: googleVerification,
    },
  }),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                        mutation.target.removeAttribute('bis_skin_checked');
                      }
                    });
                  });
                  observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['bis_skin_checked'] });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${literata.variable} ${outfit.variable} ${plusJakartaSans.variable} font-sans antialiased`} suppressHydrationWarning>
        {gaId ? <GoogleAnalyticsGate gaId={gaId} /> : null}
        {adsenseClientId ? <AdSenseGate clientId={adsenseClientId} /> : null}

        <AnalyticsProviders>
          <AppShell>{children}</AppShell>
        </AnalyticsProviders>
      </body>
    </html>
  )
}
