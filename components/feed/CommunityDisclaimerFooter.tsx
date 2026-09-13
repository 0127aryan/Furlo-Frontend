'use client'

import Link from 'next/link'

interface DisclaimerFooterProps {
  className?: string
}

export function CommunityDisclaimerFooter({ className = '' }: DisclaimerFooterProps) {
  return (
    <footer className={`text-[11px] text-[#887366] flex flex-col gap-3.5 pt-4 border-t border-[#EDE8E1] ${className}`}>
      <div className="bg-[#FFF9F2] p-3 rounded-2xl border border-[#FDE8D3] leading-relaxed text-[#6E5A4D]">
        <strong className="font-bold text-[#8B2E0F]">Community Advice:</strong>{' '}
        Content on Furlo is shared by pet lovers &amp; owners and is not a substitute for professional veterinary guidance.
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href="https://www.instagram.com/furlo.pets?igsh=MTZhNmU1dmlrczFzOQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#EDE8E1] bg-white text-[#554338] text-[11px] font-semibold hover:border-[#E8843A] hover:text-[#974900] transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">photo_camera</span>
          Instagram
        </a>
        <a
          href="mailto:support@furlopets.in"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#EDE8E1] bg-white text-[#554338] text-[11px] font-semibold hover:border-[#E8843A] hover:text-[#974900] transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">mail</span>
          Contact Us
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[#727974] font-medium text-[11px] px-0.5">
        <Link href="/about" className="hover:text-[#011E14] transition-colors">
          About
        </Link>
        <Link href="/privacy" className="hover:text-[#011E14] transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-[#011E14] transition-colors">
          Terms
        </Link>
        <span>© 2026 Furlo Inc.</span>
      </div>
    </footer>
  )
}
