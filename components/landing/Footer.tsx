import Link from 'next/link'

const comingSoon = ['Lost & Found', 'Adoption Hub', 'Vet Connect']

export function ComingSoonStrip() {
  return (
    <section style={{ background: '#ece7e2' }} className="py-8">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span
            className="text-[11px] font-bold uppercase tracking-widest text-[#554338]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            We&apos;re just getting started
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {comingSoon.map((item) => (
              <div
                key={item}
                className="bg-white px-4 py-2 rounded-full border border-[#dbc1b3] flex items-center gap-2"
              >
                <span
                  className="text-[14px] font-medium text-[#554338]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {item}
                </span>
                <span
                  className="bg-[#2D4A3E] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                >
                  Soon
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
    <footer style={{ background: '#fef9f3' }} className="py-16 border-t border-[#dbc1b3]/40">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
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
