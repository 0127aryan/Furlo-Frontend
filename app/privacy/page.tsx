import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata = {
  title: 'Privacy Policy | Furlo',
  description: "Privacy Policy of Furlo Community Platform — DPDPA 2023 compliant data protection policies.",
}

export default function PrivacyPolicyPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#fef9f3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      <Navbar />

      <main className="flex-1 py-12 md:py-20 px-4 md:px-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12">
          <span
            className="text-[12px] font-bold uppercase tracking-widest block mb-2"
            style={{ color: '#974900' }}
          >
            Legal &amp; Data Protection
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#2D4A3E] leading-tight mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Privacy Policy
          </h1>
          <div className="flex items-center gap-4 text-[14px] text-[#887366] flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              Last Updated: June 2026
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dbc1b3]" />
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e8f5ee] text-[#166534]">
              DPDPA 2023 Compliant
            </span>
          </div>
          <div className="h-px bg-[#dbc1b3]/40 mt-8" />
        </div>

        {/* Intro text */}
        <div className="text-[16px] leading-relaxed text-[#554338] mb-10 p-6 rounded-2xl border" style={{ background: '#FFFBF7', borderColor: '#ede8e1' }}>
          At <strong>Furlo</strong>, we value your trust and are committed to protecting the privacy of our community members and their furry companions. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform in compliance with India&apos;s <strong>Digital Personal Data Protection Act (DPDPA), 2023</strong>.
        </div>

        {/* Quick Nav */}
        <div className="p-6 rounded-2xl border mb-12" style={{ background: '#f7f1ea', borderColor: '#dbc1b3' }}>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#974900] mb-4">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px]">
            <a href="#collect" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              1. What Data We Collect
            </a>
            <a href="#no-collect" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              2. What We Do NOT Collect
            </a>
            <a href="#use" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              3. How We Use Your Data
            </a>
            <a href="#third-party" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              4. Third-Party Services
            </a>
            <a href="#security" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              5. Storage &amp; Security
            </a>
            <a href="#rights" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              6. Your DPDPA Rights
            </a>
            <a href="#cookies" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              7. Cookies &amp; Analytics
            </a>
            <a href="#grievance" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              8. Grievance Officer
            </a>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-12 text-[#554338]">
          {/* Section 1 */}
          <section id="collect" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              1. What Data We Collect
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed">
              <p><strong>Account Data:</strong> Email address, display name, account credentials, authentication method (email or Google OAuth).</p>
              <p><strong>Pet Profile Data:</strong> Pet name, @username, breed, age, gender, vaccination status, bio, personality tags, profile photo, and city location.</p>
              <p><strong>Content Data:</strong> Posts, captions, images, comments, likes, and community memberships created on the platform.</p>
              <p><strong>Technical Usage Data:</strong> Anonymized device type, browser, IP address (temporary security logging), and session timestamps.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="no-collect" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              2. What We Do NOT Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-[15px]">
              <li>We do <strong>NOT</strong> collect financial, credit card, or payment data.</li>
              <li>We do <strong>NOT</strong> track precise live GPS location (only city-level selection).</li>
              <li>We do <strong>NOT</strong> collect government identity documents or biometric data.</li>
              <li>We do <strong>NOT</strong> sell personal or pet profile data to third-party data brokers.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="use" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              3. How We Use Your Data
            </h2>
            <div className="overflow-x-auto rounded-xl border border-[#ede8e1] bg-white p-2">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-[#ede8e1] text-[#974900]">
                    <th className="p-3 font-bold">Purpose</th>
                    <th className="p-3 font-bold">Data Used</th>
                    <th className="p-3 font-bold">Legal Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ede8e1]">
                  <tr>
                    <td className="p-3 font-semibold text-[#1d1b18]">Account &amp; Pet Profile Management</td>
                    <td className="p-3">Email, Name, Pet Details</td>
                    <td className="p-3">Contract Fulfillment</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1d1b18]">Feed &amp; Community Discovery</td>
                    <td className="p-3">Packs joined, Pet follows</td>
                    <td className="p-3">Contract Fulfillment</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1d1b18]">Security &amp; Abuse Prevention</td>
                    <td className="p-3">Usage logs, Reports, IP</td>
                    <td className="p-3">Legitimate Interest</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section id="third-party" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              4. Third-Party Infrastructure Services
            </h2>
            <p className="text-[15px] mb-4">
              We rely on enterprise cloud infrastructure to run Furlo securely:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
              <div className="p-4 rounded-xl border bg-white border-[#ede8e1]">
                <h3 className="font-bold text-[#1d1b18]">Supabase</h3>
                <p className="text-[#887366] text-[13px] mt-1">Encrypted database storage, authentication, and media storage.</p>
              </div>
              <div className="p-4 rounded-xl border bg-white border-[#ede8e1]">
                <h3 className="font-bold text-[#1d1b18]">Vercel</h3>
                <p className="text-[#887366] text-[13px] mt-1">Web hosting and serverless edge delivery network.</p>
              </div>
              <div className="p-4 rounded-xl border bg-white border-[#ede8e1]">
                <h3 className="font-bold text-[#1d1b18]">Resend</h3>
                <p className="text-[#887366] text-[13px] mt-1">Secure transactional email delivery for account setup &amp; password reset.</p>
              </div>
              <div className="p-4 rounded-xl border bg-white border-[#ede8e1]">
                <h3 className="font-bold text-[#1d1b18]">PostHog &amp; Sentry</h3>
                <p className="text-[#887366] text-[13px] mt-1">Anonymized telemetry, error logging, and performance monitoring.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="security" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              5. Data Storage &amp; Security
            </h2>
            <div className="p-6 rounded-2xl bg-[#2D4A3E] text-white space-y-3">
              <h3 className="text-xl font-bold text-[#ffdbc7]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Bank-Grade TLS &amp; Row-Level Security (RLS)
              </h3>
              <p className="text-[14px] leading-relaxed text-[#e2ede7]">
                All data transmitted to Furlo is encrypted via TLS. Database access is guarded by strict database Row-Level Security policies ensuring users only manage their owned profiles. In accordance with applicable laws, any security breach affecting personal data will be notified within 72 hours.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="rights" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              6. Your Rights Under DPDPA 2023
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-white border-[#ede8e1]">
                <h3 className="font-bold text-[#974900]">Right to Access &amp; Export</h3>
                <p className="text-[13px] text-[#554338] mt-1">Request a complete copy of all data associated with your account.</p>
              </div>
              <div className="p-4 rounded-xl border bg-white border-[#ede8e1]">
                <h3 className="font-bold text-[#974900]">Right to Erasure (Delete)</h3>
                <p className="text-[13px] text-[#554338] mt-1">Permanently remove your account, pet profiles, and photos anytime.</p>
              </div>
            </div>
          </section>

          {/* Section 7 & 8 */}
          <section id="grievance" className="scroll-mt-24 pt-6 border-t border-[#dbc1b3]/40">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
              7. Grievance Officer &amp; Support Contact
            </h2>
            <p className="text-[15px] leading-relaxed mb-4">
              If you have any questions, concerns, or data requests regarding this Privacy Policy, please contact our Grievance Officer:
            </p>
            <div className="p-5 rounded-2xl bg-white border border-[#ede8e1] inline-block">
              <p className="font-bold text-[#1d1b18]">Furlo Privacy &amp; Grievance Office</p>
              <p className="text-[14px] text-[#554338] mt-1">Email: <a href="mailto:support@furlopets.in" className="text-[#974900] font-semibold hover:underline">support@furlopets.in</a></p>
              <p className="text-[12px] text-[#887366] mt-2">Response time: Within 30 days</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
