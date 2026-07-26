import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata = {
  title: 'About Us | Furlo — Where Pets Belong',
  description: "Learn about Furlo's mission: India's first community-first social network where pets are the primary citizens of the internet.",
}

export default function AboutPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#fef9f3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden border-b border-[#dbc1b3]/30">
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(circle, #ffb688 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full pointer-events-none opacity-15"
            style={{ background: 'radial-gradient(circle, #adcebe 0%, transparent 70%)' }}
          />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-widest mb-6"
              style={{ background: 'rgba(232,132,58,0.15)', color: '#974900' }}
            >
              Our Story &amp; Vision
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-[#2D4A3E] leading-tight mb-6"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Where pets are the identity, not their humans.
            </h1>
            <p className="text-lg md:text-xl text-[#554338] leading-relaxed max-w-2xl mx-auto mb-10">
              Furlo is India&apos;s first community-first social network built specifically for your dog, your cat, and every tail in between.
            </p>
            <div className="flex justify-center">
              <Link
                href="/join"
                className="bg-[#E8843A] text-white px-8 py-3.5 rounded-full text-[16px] font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#E8843A]/25"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Join the Pack →
              </Link>
            </div>
          </div>
        </section>

        {/* Why Furlo Exists */}
        <section className="py-16 px-4 md:px-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#974900] block mb-2">
                Why We Built This
              </span>
              <h2
                className="text-3xl font-bold text-[#2D4A3E] mb-4 leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Pet parents in India deserve a home of their own.
              </h2>
              <p className="text-[#554338] leading-relaxed mb-4 text-[15px]">
                Today, pet owners are scattered across fragmented tools — from generic photo apps to noisy messaging groups. No platform was built specifically to give pets their own dedicated voice and identity.
              </p>
              <p className="text-[#554338] leading-relaxed text-[15px]">
                Furlo changes that. We built a platform where pets are primary citizens of the internet. Publicly, your pet is the actor — posting moments, making friends, and joining local packs.
              </p>
            </div>

            <div
              className="p-8 rounded-3xl border shadow-sm relative overflow-hidden"
              style={{ background: '#FFFBF7', borderColor: '#ede8e1' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[32px] text-[#E8843A]">pets</span>
                <div>
                  <h3 className="font-bold text-[18px] text-[#1d1b18]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    The Pets-as-Actors Model
                  </h3>
                  <p className="text-[12px] text-[#887366]">How Furlo works differently</p>
                </div>
              </div>

              <ul className="space-y-4 text-[14px] text-[#554338]">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#476558] mt-0.5">check_circle</span>
                  <span><strong>Bruno posts photos:</strong> You manage the profile, but Bruno is the star.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#476558] mt-0.5">check_circle</span>
                  <span><strong>Mochi joins local packs:</strong> Connect with neighborhood dog and cat groups.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#476558] mt-0.5">check_circle</span>
                  <span><strong>Treats &amp; Barks:</strong> Pet-themed interactions replacing generic likes and comments.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 px-4 md:px-6 bg-[#f7f1ea] border-y border-[#dbc1b3]/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#974900] block mb-2">
                What Guides Us
              </span>
              <h2
                className="text-3xl font-bold text-[#2D4A3E]"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Our Core Principles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="p-6 rounded-2xl border bg-white flex flex-col gap-3"
                style={{ borderColor: '#ede8e1' }}
              >
                <div className="w-12 h-12 rounded-full bg-[#ffdbc7] flex items-center justify-center text-[#974900]">
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                </div>
                <h3 className="font-bold text-[18px] text-[#2D4A3E]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Warm &amp; Cozy
                </h3>
                <p className="text-[14px] text-[#554338] leading-relaxed">
                  We design for comfort and belonging, avoiding hyper-stimulating algorithms and aggressive notifications.
                </p>
              </div>

              <div
                className="p-6 rounded-2xl border bg-white flex flex-col gap-3"
                style={{ borderColor: '#ede8e1' }}
              >
                <div className="w-12 h-12 rounded-full bg-[#c9ead9] flex items-center justify-center text-[#476558]">
                  <span className="material-symbols-outlined text-[24px]">groups</span>
                </div>
                <h3 className="font-bold text-[18px] text-[#2D4A3E]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Pack Community
                </h3>
                <p className="text-[14px] text-[#554338] leading-relaxed">
                  Every community is built around shared breeds, locations, and interests so pet parents find true utility and support.
                </p>
              </div>

              <div
                className="p-6 rounded-2xl border bg-white flex flex-col gap-3"
                style={{ borderColor: '#ede8e1' }}
              >
                <div className="w-12 h-12 rounded-full bg-[#fce7f3] flex items-center justify-center text-[#be185d]">
                  <span className="material-symbols-outlined text-[24px]">shield</span>
                </div>
                <h3 className="font-bold text-[18px] text-[#2D4A3E]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Privacy First
                </h3>
                <p className="text-[14px] text-[#554338] leading-relaxed">
                  Fully compliant with India&apos;s DPDPA 2023 guidelines. We never sell your data or display intrusive ads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2D4A3E] mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Ready to give your pet a Paw Print?
            </h2>
            <p className="text-[#554338] mb-8 text-[16px]">
              Join thousands of pet parents building memories together on Furlo.
            </p>
            <Link
              href="/join"
              className="inline-block bg-[#974900] text-white px-9 py-4 rounded-full text-[16px] font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#974900]/20"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Create Your Pet&apos;s Profile →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
