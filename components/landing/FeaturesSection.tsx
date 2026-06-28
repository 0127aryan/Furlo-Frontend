'use client'

import { useEffect, useRef } from 'react'

const simbaImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDedpeMHVixZwfr88jFoB7gOgkFxINNOFhHDQGHbOl2-AEgYb-Ebzgihw3Jxx_88C1epfPRj1qEnlQwiig51jkQYU_WrK80jmqO7lS_iQGYIg2S6_4etgkNNX830QUhtdcm_IC_tNmyEa49cGR3gMvML3qn7YDze93BSMwXOY7eeb7l9RWoRe4ezmjuAIdAEC8Mrgo1id0O0L3_iHVIbW__4sqMJybQfc28nHzHFoS_Pvo2G82rGfaEFDATZM4d6akB90EcAfUMJbw'

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const reveals = sectionRef.current?.querySelectorAll('.section-reveal')
    reveals?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="features" className="py-20" style={{ background: '#fef9f3' }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Section header */}
        <h2
          className="text-[28px] md:text-[36px] font-bold text-center mb-16 section-reveal"
          style={{ fontFamily: 'Outfit, sans-serif', color: '#1c2329' }}
        >
          Built around your pet,{' '}
          <span style={{ color: '#2D4A3E', opacity: 0.8 }}>not the other way around.</span>
        </h2>

        {/* ── Row 1: Paw Print ── */}
        <div className="flex flex-col md:flex-row items-center gap-10 py-12 border-b border-[#dbc1b3]/40 section-reveal">
          <div className="flex-1">
            <span
              className="inline-block bg-[#2D4A3E]/10 text-[#2D4A3E] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Paw Print
            </span>
            <h3
              className="text-[28px] md:text-[32px] font-bold mb-4"
              style={{ fontFamily: 'Outfit, sans-serif', color: '#1c2329' }}
            >
              Your pet gets their own identity.
            </h3>
            <p
              className="text-[18px] leading-relaxed text-[#554338] max-w-[460px]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Every pet on Furlo has a unique Paw Print. Share their favorite treats, park spots, and daily milestones with a dedicated social presence.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="bg-[#f2ede7] rounded-xl p-6 border border-[#dbc1b3] max-w-[500px] mx-auto shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-[#dbc1b3]/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={simbaImage} alt="Simba" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4
                    className="text-[18px] font-semibold text-[#1c2329]"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Simba the Brave
                  </h4>
                  <p
                    className="text-[14px] text-[#554338] italic"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    &quot;I love snow and squeaky chickens.&quot;
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-3 rounded-lg border border-[#dbc1b3]/20">
                  <span className="block text-[10px] uppercase font-bold text-[#887366] mb-1">Breed</span>
                  <span className="text-[14px] font-medium text-[#1c2329]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Siberian Husky</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#dbc1b3]/20">
                  <span className="block text-[10px] uppercase font-bold text-[#887366] mb-1">Favorite Toy</span>
                  <span className="text-[14px] font-medium text-[#1c2329]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Rubber Bone</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: The Yard ── */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10 py-12 border-b border-[#dbc1b3]/40 section-reveal">
          <div className="flex-1">
            <span
              className="inline-block bg-[#2D4A3E]/10 text-[#2D4A3E] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              The Yard
            </span>
            <h3
              className="text-[28px] md:text-[32px] font-bold mb-4"
              style={{ fontFamily: 'Outfit, sans-serif', color: '#1c2329' }}
            >
              Find your breed, find your people.
            </h3>
            <p
              className="text-[18px] leading-relaxed text-[#554338] max-w-[460px]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              The Yard is your localized neighborhood feed. Discuss vet recommendations, organize playdates, or just share a cute tail-wagging video.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="bg-[#f2ede7] rounded-xl p-6 border border-[#dbc1b3] max-w-[500px] mx-auto shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-[#1c2329]" style={{ fontFamily: 'Outfit, sans-serif' }}>#RetrieverPack Mumbai</span>
                <span className="bg-[#E8843A] text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold">Active</span>
              </div>
              <div className="space-y-2">
                <div className="bg-white/80 backdrop-blur p-3 rounded-lg border border-[#dbc1b3]/20 flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-[#c9ead9] flex-shrink-0" />
                  <span className="text-[14px] font-medium text-[#1c2329]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Join the playdate at Juhu Beach this Sunday?
                  </span>
                </div>
                <div className="bg-white/80 backdrop-blur p-3 rounded-lg border border-[#dbc1b3]/20 flex gap-3 items-center opacity-60">
                  <div className="w-8 h-8 rounded-full bg-[#dce3eb] flex-shrink-0" />
                  <span className="text-[14px] font-medium text-[#1c2329]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Anyone know a good groomer in Bandra?
                  </span>
                </div>
              </div>
              <div className="mt-4 flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#f2ede7] bg-[#ece7e2]" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#f2ede7] bg-[#2D4A3E] flex items-center justify-center text-[10px] text-white font-bold">+42</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Sniff Around ── */}
        <div className="flex flex-col md:flex-row items-center gap-10 py-12 section-reveal">
          <div className="flex-1">
            <span
              className="inline-block bg-[#2D4A3E]/10 text-[#2D4A3E] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Sniff Around
            </span>
            <h3
              className="text-[28px] md:text-[32px] font-bold mb-4"
              style={{ fontFamily: 'Outfit, sans-serif', color: '#1c2329' }}
            >
              Discover what&apos;s near your paws.
            </h3>
            <p
              className="text-[18px] leading-relaxed text-[#554338] max-w-[460px]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              From dog-friendly cafes to 24/7 clinics, find every pet-centric spot in your city verified by the pack.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="bg-[#f2ede7] rounded-xl p-6 border border-[#dbc1b3] max-w-[500px] mx-auto shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#E8843A]/10 rounded-lg flex-shrink-0">
                    <span className="material-symbols-outlined text-[#E8843A]">restaurant</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1c2329]" style={{ fontFamily: 'Outfit, sans-serif' }}>The Barking Deer Cafe</h5>
                    <p className="text-[12px] text-[#554338]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>4.2 km • Pet Friendly • treats available</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-t border-[#dbc1b3]/20 pt-4">
                  <div className="p-2 bg-[#2D4A3E]/10 rounded-lg flex-shrink-0">
                    <span className="material-symbols-outlined text-[#2D4A3E]">park</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1c2329]" style={{ fontFamily: 'Outfit, sans-serif' }}>Cubbon Park Pet Zone</h5>
                    <p className="text-[12px] text-[#554338]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>1.5 km • Off-leash Zone • Open now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
