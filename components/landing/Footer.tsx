import Link from 'next/link'

const roadmapNodes = [
  { step: '1', title: 'Direct Messaging', badge: 'SOON', color: 'bg-[#E8843A]' },
  { step: '2', title: 'Pet Health Records', badge: 'SOON', color: 'bg-[#E8843A]' },
  { step: '3', title: 'Vet Connect', badge: 'SOON', color: 'bg-[#163328]' },
  { step: '4', title: 'Pet Marketplace', badge: 'SOON', color: 'bg-[#163328]' },
  { step: '5', title: 'Lost & Found', badge: 'SOON', color: 'bg-[#163328]' },
  { step: '6', title: 'Adoption Hub', badge: 'SOON', color: 'bg-[#163328]' },
]

export function ComingSoonStrip() {
  return (
    <section className="w-full bg-[#FAF7F2] py-16 border-t border-[#EDE8E1] relative overflow-hidden">
      {/* Ambient Background Paws for Roadmap Section (4 Paws) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <svg
          className="ambient-paw-1 absolute top-8 right-10 w-32 h-32 opacity-12 text-[#163328]"
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
          className="ambient-paw-2 absolute top-12 left-12 w-28 h-28 opacity-12 text-[#163328]"
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
          className="ambient-paw-3 absolute bottom-6 left-8 w-28 h-28 opacity-12 text-[#E8843A]"
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
          className="ambient-paw-4 absolute bottom-8 right-1/4 w-30 h-30 opacity-12 text-[#163328]"
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
        <div className="mb-10 text-center md:text-left scroll-reveal">
          <span className="inline-block font-body text-[11px] uppercase tracking-widest text-[#E8843A] font-bold px-3 py-1 rounded-full bg-[#E8843A]/10 mb-3 border border-[#E8843A]/20">
            WE&apos;RE JUST GETTING STARTED
          </span>
          <h3
            className="text-2xl sm:text-3xl text-[#163328] font-bold"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Roadmap for the pack
          </h3>
          <p className="text-sm text-[#727974] mt-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Carefully crafted features arriving to your neighborhood portal next month.
          </p>
        </div>

        {/* Horizontal Connecting Timeline Strip */}
        <div className="relative w-full scroll-reveal overflow-x-auto pb-4 pt-2">
          <div className="hidden md:block absolute top-[42px] left-12 right-12 h-[2px] bg-[#EDE8E1] z-0">
            <div className="h-full w-1/3 bg-[#E8843A] rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 min-w-[680px] md:min-w-0 relative z-10">
            {roadmapNodes.map((node) => (
              <div
                key={node.step}
                className="bg-white rounded-2xl p-5 border border-[#EDE8E1] text-center flex flex-col items-center justify-between shadow-2xs hover:bg-[#FFFBF7] transition-colors duration-150 min-h-[148px]"
              >
                <div className={`w-8 h-8 rounded-full ${node.color} text-white flex items-center justify-center font-bold text-xs shadow-2xs mb-3 ring-4 ring-white`}>
                  {node.step}
                </div>
                <span className="text-xs font-bold text-[#163328] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {node.title}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8843A]/15 text-[#E8843A] text-[10px] font-extrabold uppercase tracking-wider">
                  {node.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{ background: '#FAF7F2' }} className="py-16 relative overflow-hidden">
      {/* Ambient Background Paws for Footer (4 Paws) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <svg
          className="ambient-paw-3 absolute top-10 right-12 w-32 h-32 opacity-10 text-[#554338]"
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
          className="ambient-paw-1 absolute top-14 left-10 w-28 h-28 opacity-10 text-[#E8843A]"
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
          className="ambient-paw-4 absolute bottom-8 left-1/3 w-30 h-30 opacity-10 text-[#554338]"
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
          className="ambient-paw-2 absolute bottom-12 right-1/4 w-32 h-32 opacity-10 text-[#554338]"
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

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <span className="material-symbols-outlined text-[#E8843A] text-[24px]">pets</span>
              <span
                className="text-[22px] font-bold text-[#1c2329] tracking-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                furlo
              </span>
            </div>
            <p
              className="text-[14px] leading-relaxed text-[#554338] max-w-[300px]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              The first digital ecosystem dedicated to making every pet feel like they belong to a pack.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10">
            <div>
              <h5
                className="text-[11px] font-bold uppercase tracking-widest text-[#1c2329] mb-4"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Company
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-[14px] text-[#554338] hover:text-[#E8843A] transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-[14px] text-[#554338] hover:text-[#E8843A] transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-[14px] text-[#554338] hover:text-[#E8843A] transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5
                className="text-[11px] font-bold uppercase tracking-widest text-[#1c2329] mb-4"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Connect
              </h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.instagram.com/furlo.pets?igsh=MTZhNmU1dmlrczFzOQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-[#554338] hover:text-[#E8843A] transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@furlopets.in"
                    className="text-[14px] text-[#554338] hover:text-[#E8843A] transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    target='_blank'
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#dbc1b3]/30 flex justify-between items-center flex-wrap gap-4">
          <p
            className="text-[12px] text-[#887366]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            © 2026 FURLO. Where Pets Belong.
          </p>
          <p
            className="text-[12px] text-[#887366] italic"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Made with ❤️ for tails everywhere.
          </p>
        </div>
      </div>
    </footer>
  )
}
