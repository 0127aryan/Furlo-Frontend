import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Use NEXT_PUBLIC_SITE_URL if defined, fallback to vercel deployment URL, or default to furlo.in
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'https://furlo.in')

  return [
    {
      // New landing page (currently a dev placeholder, will be replaced)
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      // Original waitlist landing page, still live during development
      url: `${baseUrl}/waitlist-users`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      // Privacy policy — old design, still the canonical privacy doc
      url: `${baseUrl}/old-privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]
}
