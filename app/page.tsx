import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white font-sans p-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
          Furlo
        </h1>
        <p className="text-neutral-400 text-lg">
          Where Pets Belong. The new landing page is currently in development.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/waitlist-users"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/10"
          >
            View Waitlist Page
          </Link>
          <Link
            href="/old-privacy-policy"
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-medium transition-all"
          >
            View Old Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
