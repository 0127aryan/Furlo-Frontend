import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white font-sans p-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-neutral-400">
          The new privacy policy page is currently in development.
        </p>
        <div className="pt-4">
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
