'use client'

const simbaAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAb2a7v9VnuHF3ej526exgZy4BArCzHeAA-8knw5KRxL1-MgAvsMsMnL9bzUkCgt_Ahk5t0UAvBXfRyAc8EVW95fI_ad2wwlMVsg2SuJ82x6ycUP37sH8HHMmh1_Gm5AsTMZl9zS47hYKA7T2fQb0GtkBtoqUI1RXNX81YHxyWwQxMvdwD_rDYfjQRKyv3NI_XRYh8ciOPrlEtpQXi9U33UmflItRy_ymbruJor4gV7yePLeGsL_WUQ9g'

const rockyPhoto =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC-drczo_KA2IF4nnXjb5pKq-YNwON9R7UDcMF8QelqP0Wmr2cWBFnfv3md7xz0a1Csrs05rjwu1SRKM2jy10aX5ZHbZRuD5vfDILAWoY44XlZg1PgsKzbPQNjedv6ido-T9icwGSclHylHb6kWSEptz4tKIcWMvNP1T_4huK-YR9PjqbnYtmiLnPoEB3-3E8gb5sbNgwnw10i98HubWEnED2EmOMpKnsldqT7u044vc1BLOY8uhKmhaw'

export function FeaturesSection() {
  return (
    <div className="w-full">
      {/* ── CORE FEATURES SECTION (4-Card Bento Grid) ── */}
      <section className="w-full bg-[#F5EFE6]/60 py-20 lg:py-28 border-t border-[#EDE8E1] relative overflow-hidden">
        {/* Ambient Background Paws for Bento Grid Section (4 Paws) */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
          <svg
            className="ambient-paw-1 absolute top-12 left-6 w-32 h-32 opacity-12 text-[#163328]"
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
            className="ambient-paw-2 absolute top-20 right-8 w-28 h-28 opacity-12 text-[#163328]"
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
            className="ambient-paw-3 absolute bottom-16 right-10 w-36 h-36 opacity-12 text-[#E8843A]"
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
          <svg
            className="ambient-paw-4 absolute bottom-24 left-10 w-30 h-30 opacity-12 text-[#163328]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
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
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 scroll-reveal">
            <span className="inline-block font-body text-xs uppercase tracking-widest text-[#E8843A] font-bold px-3.5 py-1 rounded-full bg-[#E8843A]/10 mb-3 border border-[#E8843A]/20">
              CORE PLATFORM
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#163328] leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Built around your pet,{' '}
              <span className="text-[#E8843A]">not the other way around.</span>
            </h2>
            <p className="mt-3.5 text-base text-[#727974]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Purpose-built primitives tailored to pet sociology, hyper-local companionship, and collective wisdom.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CARD 1: THE YARD (DARK EMERALD ANCHOR - Spans 8 cols) */}
            <div className="lg:col-span-8 bg-[#163328] text-white rounded-3xl p-7 lg:p-9 border border-[#163328]/60 shadow-sm flex flex-col justify-between scroll-reveal card-hover relative overflow-hidden">
              <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#15803D]/20 blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8843A] text-white text-xs font-bold tracking-wide uppercase">
                    <span className="material-symbols-outlined text-[14px]">fence</span>
                    THE YARD
                  </span>
                  <span className="text-xs text-[#c9ead9]/80 font-medium">Hyperlocal Feed</span>
                </div>
                <h3 className="text-2xl lg:text-3xl text-white font-bold mb-2.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Find your breed, find your people.
                </h3>
                <p className="text-sm lg:text-base text-[#c9ead9]/75 max-w-xl mb-7 leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  The Yard is your localized neighborhood feed. Discuss vet recommendations, organize playdates, or just share a cute tail-wagging video with nearby dog and cat parents.
                </p>
              </div>

              {/* Mini Feed Preview Card nested in White surface */}
              <div className="relative z-10 bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 text-[#163328] shadow-sm space-y-3.5 border border-[#EDE8E1]">
                {/* Feed Item 1: Meetup Alert */}
                <div className="bg-[#F2ECE3]/80 border border-[#EDE8E1] p-3.5 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#E8843A]/15 flex items-center justify-center text-[#E8843A] shrink-0">
                      <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                    </div>
                    <div className="min-w-0 truncate">
                      <h4 className="text-sm text-[#163328] font-bold truncate">Cubbon Park Meetup at 4 PM</h4>
                      <p className="text-xs text-[#727974] truncate">14 retrievers &amp; indies confirmed</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#c9ead9] text-[#163328] text-xs font-bold shrink-0">
                    In 2 hours
                  </span>
                </div>

                {/* Feed Item 2: Quick Community Video Post */}
                <div className="bg-[#F2ECE3]/80 border border-[#EDE8E1] p-3.5 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rockyPhoto}
                      alt="Indie dog fetch"
                      className="w-10 h-10 rounded-lg object-cover shrink-0 ring-1 ring-[#EDE8E1]"
                    />
                    <div className="min-w-0 truncate">
                      <h4 className="text-sm text-[#163328] font-bold truncate">Rocky just learned to fetch high balls!</h4>
                      <p className="text-xs text-[#727974] truncate">Shared by Ananya &amp; Rocky · Indiranagar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#E8843A] text-xs font-bold shrink-0 bg-[#E8843A]/10 px-2 py-1 rounded-md">
                    <span>🍖</span>
                    <span>86</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: MY PAW PRINT (SPOTLIGHT CARD - Spans 4 cols) */}
            <div className="lg:col-span-4 bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border-2 border-[#E8843A]/40 shadow-2xs flex flex-col justify-between scroll-reveal card-hover relative overflow-hidden">
              {/* Corner Stamp Ribbon */}
              <div className="absolute -top-1 -right-1">
                <span className="inline-flex items-center gap-1 bg-[#E8843A] text-white text-[10px] font-bold tracking-wider px-3.5 py-1 rounded-bl-xl uppercase shadow-2xs">
                  <span className="material-symbols-outlined text-[13px]">verified_user</span> Verified ID
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9ead9] text-[#163328] text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">badge</span>
                    MY PAW PRINT
                  </span>
                </div>
                <h3 className="text-2xl text-[#163328] font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Your pet gets their own identity.
                </h3>
                <p className="text-sm text-[#727974] mb-6 leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Every pet on Furlo holds a distinguished Paw Print passport. Record habits, health milestones, quirks, and play preferences.
                </p>
              </div>

              {/* Pet ID Passport Simulation */}
              <div className="bg-[#F2ECE3] rounded-2xl p-4 sm:p-5 border border-[#EDE8E1] space-y-4 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={simbaAvatar}
                      alt="Simba the Siberian Husky"
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#E8843A]/40"
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#E8843A] text-white flex items-center justify-center shadow-2xs">
                      <span className="material-symbols-outlined text-[13px]">pets</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base text-[#163328] font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Simba the Brave
                    </h4>
                    <p className="text-xs italic text-[#727974]">
                      &quot;I love snow and squeaky chickens.&quot;
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-mono text-[#E8843A] font-bold">
                      ID: #FL-9042
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EDE8E1] text-xs">
                  <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#EDE8E1]">
                    <span className="text-[10px] uppercase font-bold text-[#727974] block tracking-wider">
                      Breed
                    </span>
                    <span className="font-bold text-[#163328]">Siberian Husky</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#EDE8E1]">
                    <span className="text-[10px] uppercase font-bold text-[#727974] block tracking-wider">
                      Favorite Toy
                    </span>
                    <span className="font-bold text-[#163328]">Rubber Bone</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: PACKS (TINTED OUTLINE CARD - Spans 5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] flex flex-col justify-between scroll-reveal card-hover">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8843A]/10 text-[#E8843A] text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">groups</span>
                    PACKS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8843A] text-white text-[11px] font-bold uppercase">
                    Active
                  </span>
                </div>
                <h3 className="text-2xl text-[#163328] font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Your breed&apos;s local crew, always active.
                </h3>
                <p className="text-sm text-[#727974] mb-6 leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Curated circles by breed, neighborhood, and energy levels. Connect directly with parents who understand your breed&apos;s quirks.
                </p>
              </div>

              {/* Graphic Pack Panel */}
              <div className="bg-[#F2ECE3] rounded-2xl p-4 sm:p-5 border border-[#EDE8E1] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E1]">
                  <span className="text-sm font-bold text-[#163328]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    #RetrieverPack Mumbai
                  </span>
                  <div className="flex items-center -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#c9ead9] border border-[#FAF7F2]" />
                    <div className="w-6 h-6 rounded-full bg-[#E8843A]/30 border border-[#FAF7F2]" />
                    <span className="w-6 h-6 rounded-full bg-[#c9ead9] text-[#163328] text-[10px] font-bold flex items-center justify-center ring-2 ring-[#FAF7F2]">
                      +42
                    </span>
                  </div>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE8E1] text-xs space-y-1">
                  <p className="font-bold text-[#163328]">
                    &quot;Join the playdate at Juhu Beach this Sunday?&quot;
                  </p>
                  <p className="text-[#727974] text-[11px]">Posted 20m ago by Maya &amp; Cooper</p>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE8E1] text-xs space-y-1">
                  <p className="font-bold text-[#163328]">
                    &quot;Anyone know a good groomer in Bandra?&quot;
                  </p>
                  <p className="text-[#727974] text-[11px]">7 replies from pack guardians</p>
                </div>
              </div>
            </div>

            {/* CARD 4: QA HUB (WHITE ASYMMETRIC CARD - Spans 7 cols) */}
            <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-2xs flex flex-col justify-between scroll-reveal card-hover">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9ead9] text-[#163328] text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">help_center</span>
                    QA HUB
                  </span>
                  <span className="text-xs text-[#727974] font-medium">Crowdsourced &amp; Verified</span>
                </div>
                <h3 className="text-2xl text-[#163328] font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Real answers from real pet parents.
                </h3>
                <p className="text-sm text-[#727974] mb-6 leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Skip the generic search engines. Ask about food allergies, behavioral quirks, or emergency clinic recommendations with fast community replies.
                </p>
              </div>

              {/* Asymmetric Internal composition */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
                {/* Left weighted question card */}
                <div className="sm:col-span-7 bg-[#FAF7F2] rounded-2xl p-4 border border-[#EDE8E1] space-y-2 shadow-2xs">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-[#E8843A]">
                    Question
                  </span>
                  <p className="text-sm sm:text-base font-bold text-[#163328] leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    &quot;Best hypoallergenic food for a Labrador with skin itching?&quot;
                  </p>
                  <p className="text-[#727974] text-xs">Bengaluru Lab Pack · 18 replies</p>
                </div>

                {/* Offset lower right preview answer card */}
                <div className="sm:col-span-5 bg-[#FFFBF7] rounded-2xl p-4 border border-[#EDE8E1] space-y-2 shadow-2xs relative sm:-translate-y-2">
                  <div className="flex items-center gap-1 text-[#15803D] text-xs font-bold">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    <span>Dr. Priya (Vet)</span>
                  </div>
                  <p className="text-xs text-[#727974] line-clamp-3">
                    Transition to salmon single-protein kibble or steamed pumpkin &amp; fish, avoiding chicken meal.
                  </p>
                  <div className="pt-2 border-t border-[#EDE8E1]/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#E8843A] font-bold">🐾 Helpful Paw · 48</span>
                    <span className="text-[#727974]">Answered in 12 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCOVERY SECTION: "Sniff Around" with Vector Map ── */}
      <section className="w-full bg-[#FAF7F2] py-20 lg:py-24 relative overflow-hidden" id="discovery-section">
        {/* Ambient Background Paws for Discovery Section (4 Paws) */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
          <svg
            className="ambient-paw-2 absolute top-16 right-10 w-32 h-32 opacity-12 text-[#163328]"
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
            className="ambient-paw-4 absolute top-28 left-12 w-28 h-28 opacity-12 text-[#163328]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            viewBox="0 0 48 48"
          >
            <path d="M24 22C20 22 17 25 17 29C17 34 21 39 24 41C27 39 31 34 31 29C31 25 28 22 24 22Z" />
            <ellipse cx="15" cy="18" rx="3.5" ry="5" />
            <ellipse cx="21" cy="13" rx="3.2" ry="4.5" />
            <ellipse cx="27" cy="13" rx="3.2" ry="4.5" />
            <ellipse cx="33" cy="18" rx="3.5" ry="5" />
          </svg>
          <svg
            className="ambient-paw-1 absolute bottom-12 left-8 w-30 h-30 opacity-12 text-[#E8843A]"
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
          <svg
            className="ambient-paw-3 absolute bottom-20 right-14 w-36 h-36 opacity-12 text-[#163328]"
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
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 lg:px-8">
          {/* Discovery Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 scroll-reveal">
            <div>
              <span className="inline-block text-xs uppercase tracking-widest text-[#E8843A] font-bold px-3 py-1 rounded-full bg-[#E8843A]/10 mb-3 border border-[#E8843A]/20">
                SNIFF AROUND
              </span>
              <h2
                className="text-3xl sm:text-4xl lg:text-[40px] text-[#163328] font-bold leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Discover what&apos;s near your paws.
              </h2>
              <p className="mt-2 text-base text-[#727974] max-w-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                From dog-friendly cafes to 24/7 clinics, find every pet-centric spot in your city verified by the pack.
              </p>
            </div>

            {/* Selector Pill */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F2ECE3] text-[#163328] text-xs font-bold border border-[#EDE8E1] shadow-2xs">
                <span className="material-symbols-outlined text-[16px] text-[#E8843A]">near_me</span>
                <span>Bengaluru Central</span>
                <span className="material-symbols-outlined text-[16px] text-[#727974]">expand_more</span>
              </div>
            </div>
          </div>

          {/* Stylized Map Canvas Container */}
          <div className="relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-[#F0EBE1] border border-[#EDE8E1] shadow-2xs overflow-hidden mb-8 scroll-reveal">
            {/* Vector Map Background Art */}
            <svg
              className="absolute inset-0 w-full h-full object-cover"
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 1000 450"
            >
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5DED2" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="#F3ECE1" />
              <rect width="100%" height="100%" fill="url(#grid-pattern)" opacity="0.6" />
              {/* Green Park Zones */}
              <path d="M 120 80 Q 240 40, 360 90 T 420 250 Q 300 320, 180 270 Z" fill="#C9EAD9" opacity="0.85" />
              <path d="M 680 180 Q 820 120, 940 190 T 960 380 Q 820 420, 710 320 Z" fill="#D6EDDF" opacity="0.7" />
              {/* Roads */}
              <path d="M -20 220 C 200 230, 450 170, 700 240 S 950 200, 1020 180" fill="none" stroke="#FAF7F2" strokeWidth="14" strokeLinecap="round" />
              <path d="M -20 220 C 200 230, 450 170, 700 240 S 950 200, 1020 180" fill="none" stroke="#E3D9CA" strokeWidth="2" strokeDasharray="8 6" />
              <path d="M 320 -10 C 330 180, 290 300, 350 460" fill="none" stroke="#FAF7F2" strokeWidth="12" />
              <path d="M 620 -10 C 600 150, 680 320, 720 460" fill="none" stroke="#FAF7F2" strokeWidth="10" />
              <path d="M 150 140 C 320 200, 600 100, 850 120" fill="none" stroke="#FAF7F2" strokeWidth="8" />
              {/* Area labels on Map */}
              <text x="210" y="190" fill="#163328" fontFamily="Outfit" fontSize="14" fontWeight="700" opacity="0.6">
                Cubbon Green Zone
              </text>
              <text x="760" y="270" fill="#163328" fontFamily="Outfit" fontSize="13" fontWeight="700" opacity="0.5">
                Indiranagar Ring
              </text>
            </svg>

            {/* Floating Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              <button className="w-9 h-9 rounded-xl bg-[#F2ECE3] text-[#163328] shadow-sm flex items-center justify-center font-bold border border-[#EDE8E1] hover:bg-[#EADBCC] transition-colors" title="Zoom In">
                +
              </button>
              <button className="w-9 h-9 rounded-xl bg-[#F2ECE3] text-[#163328] shadow-sm flex items-center justify-center font-bold border border-[#EDE8E1] hover:bg-[#EADBCC] transition-colors" title="Zoom Out">
                −
              </button>
            </div>

            {/* MAP PIN 1: The Barking Deer Cafe */}
            <div className="absolute top-[28%] left-[72%] -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#E8843A] text-white flex items-center justify-center shadow-md border-2 border-[#FAF7F2]">
                  <span className="text-base">🍽️</span>
                </div>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE8E1] shadow-md opacity-95 group-hover:opacity-100 transition-all pointer-events-none">
                <p className="text-xs font-bold text-[#163328]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  The Barking Deer Cafe
                </p>
                <p className="text-[11px] text-[#727974]">4.2 km · Pet Friendly · Treats Available</p>
              </div>
            </div>

            {/* MAP PIN 2: Cubbon Park Pet Zone */}
            <div className="absolute top-[42%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-[#15803D] text-white flex items-center justify-center shadow-md border-2 border-[#FAF7F2] ring-4 ring-[#15803D]/20">
                  <span className="text-base">🌳</span>
                </div>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE8E1] shadow-md opacity-95 group-hover:opacity-100 transition-all pointer-events-none">
                <p className="text-xs font-bold text-[#163328]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Cubbon Park Pet Zone
                </p>
                <p className="text-[11px] text-[#727974]">1.5 km · Off-leash Zone · Open Now</p>
              </div>
            </div>

            {/* MAP PIN 3: Cessna Lifeline 24/7 Care */}
            <div className="absolute top-[62%] left-[54%] -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md border-2 border-[#FAF7F2] ring-4 ring-rose-500/20">
                  <span className="text-base">🏥</span>
                </div>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE8E1] shadow-md opacity-95 group-hover:opacity-100 transition-all pointer-events-none">
                <p className="text-xs font-bold text-[#163328]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Cessna Lifeline 24/7 Care
                </p>
                <p className="text-[11px] text-[#727974]">2.8 km · 24/7 Emergency</p>
              </div>
            </div>
          </div>

          {/* Location Cards Row Below Map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Spot 1: Cafe */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs card-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#E8843A]/10 flex items-center justify-center text-[#E8843A]">
                    <span className="text-xl">🍽️</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c9ead9] text-[#163328] text-xs font-bold">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    Pet Friendly
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#163328] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  The Barking Deer Cafe
                </h3>
                <p className="text-xs text-[#727974] leading-relaxed mb-4">
                  Indiranagar 100ft Road · Outdoor doggie patio, fresh boiled chicken bowls, water stations.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EDE8E1] flex items-center justify-between text-xs">
                <span className="font-bold text-[#E8843A] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">navigation</span>
                  4.2 km away
                </span>
                <span className="text-[#727974] font-medium">Treats Available</span>
              </div>
            </div>

            {/* Spot 2: Park Zone */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs card-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#c9ead9] flex items-center justify-center text-[#163328]">
                    <span className="text-xl">🌳</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c9ead9] text-[#163328] text-xs font-bold">
                    Off-leash Zone
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#163328] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Cubbon Park Pet Zone
                </h3>
                <p className="text-xs text-[#727974] leading-relaxed mb-4">
                  Central Bengaluru · Designated fenced Sunday morning running greens with 80+ weekly dogs.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EDE8E1] flex items-center justify-between text-xs">
                <span className="font-bold text-[#E8843A] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">navigation</span>
                  1.5 km away
                </span>
                <span className="text-[#15803D] font-bold">Open Now</span>
              </div>
            </div>

            {/* Spot 3: 24/7 Vet */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs card-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <span className="text-xl">🏥</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                    24/7 Emergency
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#163328] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Cessna Lifeline 24/7 Care
                </h3>
                <p className="text-xs text-[#727974] leading-relaxed mb-4">
                  Domlur Ring Road · ICU, blood bank, verified surgical staff on standby 24 hours daily.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EDE8E1] flex items-center justify-between text-xs">
                <span className="font-bold text-[#E8843A] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">navigation</span>
                  2.8 km away
                </span>
                <span className="text-[#15803D] font-bold">Verified Staff</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
