'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const petAvatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDIjaxxZRDpO9jBMgF3FSbZU3uql64Lur5YT3QvkLq90KCAokncXyCr8ujbB0dhPreMbuZxcFeL9fXuNPxarYPoSJ-1GQ1AH8NdrN9InxsRGtO-XG36w5-xP485-IPJ_R8Pc2nxJ52_FQST35ewcckfGK5BSsxX5cxCWAIbqB9GPBonmPtXZyEOcCU8ksvcAGBlqNKaNXuDI6GkZEuf4OFIKugAF_1BUXJmgWhaLzlCU4Y65EziHGbcQQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDToU5zqboqb3h1ertl4NkURAcuAj80TlMMmPIZbCc6QgSK9rlkWu5sEPegndLXXj0TGXrP-m_10sn8Z7JQD40WJ00lFmPfgFybbZpaF_StwIUnZ5CqZryWQ_pM2kp_K-4xdgYHWMf4lstNBBBCBeuBtk8nb70CMo-UV_4RmUDR2O5rNHL4ojuj3gJp2zxszLMjGF6HzZOlFsPU74W5P1ke5hgrLFzAlYJ2k1qaeECWUm7ZZYxhXVG-PA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAI_dMeuu5sHADNvSqy-fw8IqWCqrF-T2Fe6LWTi2s4BSYddMg4VMtg5Tx0ZQqTzAUtPkvYo49l_9iX0Y6embTu4NOGnAON-e3xPifVq7cKdX1CJmhuCeUNxSV7yFonPQJ1aJ2J2fZivZGUFDxn7c78bmxf1o3V3uOq6SJ_ffWdNRrEL172-I3I993cNXHmv9nw4eKJzRjwfx-EIbn21TOCT8X5H41NILDuWeQKxHN8GXG6F-Zg4rwXyA',
]

const brunoAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Oye_WkG3RKbUWRCa49kGJeAqMk9QhpB2en4bYUcPPhcU-L1N1mfvmKt5jS2-Z5fzEDEAiJZP7ud8W2UdgO2jBLLXK8B6LzBT8x3dyA9XHVin-B7uDugmXhCwIXyVhwWTMe1lFXTsZyioj0WtteGN9wu6wxu0VBIHq1MJd_yI3luQDBWklCm6qMMZ05hhtQp-GzZoCqTN38QRjB3WQ_0XhXMYfe2Owj3HDNiR_urWK6ZvXsEgKg3zhw'

const brunoParkPhoto =
  'https://lh3.googleusercontent.com/aida/AEtjO1XSQdsZTAXsJk27-78mhcyveRyGGh5_k1h9MU04J_QCh9rFq1gSLju3WBe4uzLnRrLXBPTeY3_gDd2lnhxFyYdJm783FPY_UCP1ZNyrhBkLiQbAJ-Rek7_f94KgmJfFqgZg30o4N1JxxNlVX6RBU8xTLUcvrHClnPhdGTUpXBBLeQWxTvtG5zhbWhuUMQcfMexF6LyDVIZ91KrJJad7FuGE-z1kbHRRX_M5Dluc6SPWsqLp9dAbfnrsZnSS'

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Run staggered entrance animation on page load
    const timer = setTimeout(() => setLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] pt-10 pb-20 lg:py-24">
      {/* Scattered Hand-drawn Paw Vector Texture (Ambient Floating Paw Layer - 4 Paws) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <svg
          className="ambient-paw-1 absolute -top-12 left-1/4 w-32 h-32 opacity-15 text-[#E8843A]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 48 48"
        >
          <path d="M24 22C20 22 17 25 17 29C17 34 21 39 24 41C27 39 31 34 31 29C31 25 28 22 24 22Z" />
          <ellipse cx="15" cy="18" rx="3.5" ry="5" transform="rotate(-15 15 18)" />
          <ellipse cx="21" cy="13" rx="3.2" ry="4.5" />
          <ellipse cx="27" cy="13" rx="3.2" ry="4.5" />
          <ellipse cx="33" cy="18" rx="3.5" ry="5" transform="rotate(15 33 18)" />
        </svg>
        <svg
          className="ambient-paw-2 absolute top-28 left-8 w-24 h-24 opacity-10 text-[#163328]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 48 48"
        >
          <path d="M24 22C20 22 17 25 17 29C17 34 21 39 24 41C27 39 31 34 31 29C31 25 28 22 24 22Z" />
          <ellipse cx="15" cy="18" rx="3.5" ry="5" />
          <ellipse cx="21" cy="13" rx="3.2" ry="4.5" />
          <ellipse cx="27" cy="13" rx="3.2" ry="4.5" />
          <ellipse cx="33" cy="18" rx="3.5" ry="5" />
        </svg>
        <svg
          className="ambient-paw-3 absolute top-8 right-16 w-36 h-36 opacity-10 text-[#163328]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 48 48"
        >
          <path d="M24 22C20 22 17 25 17 29C17 34 21 39 24 41C27 39 31 34 31 29C31 25 28 22 24 22Z" />
          <ellipse cx="15" cy="18" rx="3.5" ry="5" />
          <ellipse cx="21" cy="13" rx="3.2" ry="4.5" />
          <ellipse cx="27" cy="13" rx="3.2" ry="4.5" />
          <ellipse cx="33" cy="18" rx="3.5" ry="5" />
        </svg>
        <svg
          className="ambient-paw-4 absolute bottom-12 right-1/3 w-28 h-28 opacity-12 text-[#E8843A]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          viewBox="0 0 48 48"
        >
          <path d="M24 22C20 22 17 25 17 29C17 34 21 39 24 41C27 39 31 34 31 29C31 25 28 22 24 22Z" />
          <ellipse cx="15" cy="18" rx="3.5" ry="5" />
          <ellipse cx="21" cy="13" rx="3.2" ry="4.5" />
          <ellipse cx="27" cy="13" rx="3.2" ry="4.5" />
          <ellipse cx="33" cy="18" rx="3.5" ry="5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Copy Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tag */}
            <div
              className={`hero-element inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c9ead9] text-[#163328] text-xs font-semibold mb-6 shadow-2xs border border-[#b8dfcc] ${
                loaded ? 'visible' : ''
              }`}
              style={{ transitionDelay: '0ms' }}
            >
              <span className="material-symbols-outlined text-[16px] text-[#163328]">
                pets
              </span>
              <span>Welcome to the Neighborhood Sanctuary</span>
            </div>

            {/* Headline */}
            <h1
              className={`hero-element text-4xl sm:text-5xl lg:text-[58px] lg:leading-[1.12] tracking-tight text-[#163328] font-bold ${
                loaded ? 'visible' : ''
              }`}
              style={{ fontFamily: 'Outfit, sans-serif', transitionDelay: '60ms' }}
            >
              Where pets{' '}
              <span className="relative inline-block text-[#E8843A]">
                belong
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  fill="none"
                  height="10"
                  preserveAspectRatio="none"
                  viewBox="0 0 120 10"
                >
                  <path
                    d="M2 7C35 2 85 2 118 7"
                    stroke="#E8843A"
                    strokeLinecap="round"
                    strokeWidth="4.5"
                  />
                </svg>
              </span>
              .
            </h1>

            {/* Subheadline */}
            <p
              className={`hero-element mt-6 text-lg text-[#727974] max-w-xl leading-relaxed ${
                loaded ? 'visible' : ''
              }`}
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', transitionDelay: '120ms' }}
            >
              India&apos;s first social network built for your dog, your cat, and every tail in between. Real vet insights, local breed packs, and park playdates.
            </p>

            {/* Action Buttons */}
            <div
              className={`hero-element mt-8 flex flex-wrap items-center gap-4 ${
                loaded ? 'visible' : ''
              }`}
              style={{ transitionDelay: '180ms' }}
            >
              <Link
                href="/join"
                className="btn-press group inline-flex items-center justify-center gap-2.5 bg-[#E8843A] hover:bg-[#d9752c] text-white text-sm font-bold rounded-full px-8 py-4 shadow-sm transition-all"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                <span>Join the Pack</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
              <a
                href="#discovery-section"
                className="btn-press inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#F2ECE3] text-[#163328] text-sm font-bold border border-[#EDE8E1] hover:bg-[#EADBCC] shadow-2xs transition-colors"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                <span className="material-symbols-outlined text-[18px] text-[#E8843A]">
                  explore
                </span>
                <span>Sniff Around</span>
              </a>
            </div>

            {/* Social Proof */}
            <div
              className={`hero-element mt-10 pt-4 flex items-center gap-4 bg-[#F2ECE3]/80 backdrop-blur-sm border border-[#EDE8E1] px-5 py-3 rounded-2xl shadow-2xs ${
                loaded ? 'visible' : ''
              }`}
              style={{ transitionDelay: '240ms' }}
            >
              <div className="flex -space-x-3 overflow-hidden">
                {petAvatars.map((src, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={i}
                    src={src}
                    alt="Pet avatar"
                    className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-[#FAF7F2]"
                  />
                ))}
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E8843A] text-white text-xs font-bold ring-2 ring-[#FAF7F2]">
                  +100
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-[#E8843A] text-[17px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    pets
                  </span>
                  <span className="text-sm text-[#163328] font-bold">
                    100+ pets already here
                  </span>
                </div>
                <span className="text-xs text-[#727974]">
                  Active across pan India
                </span>
              </div>
            </div>
          </div>

          {/* Hero Visual Column: Layered Cards with Rotation */}
          <div
            className={`hero-element lg:col-span-5 flex justify-center lg:justify-end relative pt-4 pb-6 ${
              loaded ? 'visible' : ''
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="relative w-full max-w-md">
              {/* Underneath Card (Opposing rotation) */}
              <div className="absolute inset-0 bg-[#F2ECE3] rounded-3xl border border-[#EDE8E1] shadow-2xs -rotate-[2deg] scale-[1.02] transform transition-transform pointer-events-none opacity-40">
                <div className="h-full w-full p-6 flex flex-col justify-between opacity-30">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8843A]/20" />
                    <div className="h-3 w-24 rounded bg-[#163328]/20" />
                  </div>
                  <div className="h-24 rounded-2xl bg-[#163328]/5" />
                </div>
              </div>

              {/* Top Primary Bruno Card (Static rotate-[2.5deg]) */}
              <div className="relative bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-[#EDE8E1] shadow-sm rotate-[2.5deg] card-hover">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={brunoAvatar}
                        alt="Phoebe Golden Retriever"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#EDE8E1]"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#15803D] ring-2 ring-[#FAF7F2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3
                          className="text-lg text-[#163328] font-bold"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          Phoebe
                        </h3>
                        <span
                          className="material-symbols-outlined text-[#15803D] text-[17px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          title="Verified Paw"
                        >
                          verified
                        </span>
                      </div>
                      <p className="text-xs text-[#727974] font-medium">
                        Golden Retriever · Bengaluru
                      </p>
                    </div>
                  </div>
                  <button className="btn-press px-4 py-1.5 rounded-full bg-[#E8843A]/10 text-[#E8843A] text-xs font-bold hover:bg-[#E8843A] hover:text-white transition-colors">
                    Follow
                  </button>
                </div>

                {/* Post Photo */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner mb-4 group bg-[#F2ECE3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brunoParkPhoto}
                    alt="Bruno running joyfully in Cubbon park"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#011E14]/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs flex items-center gap-1.5 border border-white/10">
                    <span className="material-symbols-outlined text-[13px] text-[#E8843A]">
                      location_on
                    </span>
                    <span>Cubbon Park, 7:30 AM</span>
                  </div>
                </div>

                {/* Post Caption */}
                <p className="text-sm text-[#163328] leading-relaxed mb-4 font-normal">
                  Sunday morning at Cubbon Park. Best zoomies ever with the retriever pack! 🐾🌿
                </p>

                {/* Footer Engagement */}
                <div className="flex items-center justify-between pt-3 border-t border-[#EDE8E1]">
                  <div className="flex items-center gap-2.5">
                    <button className="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F2ECE3] hover:bg-[#EADBCC] text-[#163328] text-xs font-semibold border border-[#EDE8E1] transition-colors">
                      <span className="text-sm">🍖</span>
                      <span>124 Treats</span>
                    </button>
                    <button className="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F2ECE3] hover:bg-[#EADBCC] text-[#163328] text-xs font-semibold border border-[#EDE8E1] transition-colors">
                      <span className="material-symbols-outlined text-[15px] text-[#727974]">
                        chat_bubble
                      </span>
                      <span>18 Barks</span>
                    </button>
                  </div>
                  <button
                    className="text-[#727974] hover:text-[#E8843A] transition-colors p-1.5 rounded-full hover:bg-[#F2ECE3]"
                    title="Share Paw Print"
                  >
                    <span className="material-symbols-outlined text-[19px]">share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
