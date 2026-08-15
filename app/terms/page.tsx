import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata = {
  title: 'Terms of Service | Furlo',
  description: 'Terms of Service and Community Guidelines for the Furlo pet network.',
}

export default function TermsOfServicePage() {
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
            Legal &amp; Compliance
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#2D4A3E] leading-tight mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Terms of Service
          </h1>
          <div className="flex items-center gap-4 text-[14px] text-[#887366] flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              Effective Date: June 2026
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dbc1b3]" />
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fef3c7] text-[#92400e]">
              Version 1.0
            </span>
          </div>
          <div className="h-px bg-[#dbc1b3]/40 mt-8" />
        </div>

        {/* Intro Banner */}
        <div className="text-[16px] leading-relaxed text-[#554338] mb-10 p-6 rounded-2xl border" style={{ background: '#FFFBF7', borderColor: '#ede8e1' }}>
          Welcome to <strong>Furlo</strong>! These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Furlo web application, pet profiles, community packs, and associated services. By registering an account or using Furlo, you agree to comply with these Terms.
        </div>

        {/* Navigation Anchors */}
        <div className="p-6 rounded-2xl border mb-12" style={{ background: '#f7f1ea', borderColor: '#dbc1b3' }}>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#974900] mb-4">
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px]">
            <a href="#eligibility" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              1. Eligibility &amp; Account Creation
            </a>
            <a href="#model" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              2. Pets-as-Actors Operating Model
            </a>
            <a href="#content" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              3. User Content &amp; Media Ownership
            </a>
            <a href="#conduct" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              4. Community Code of Conduct
            </a>
            <a href="#vet-disclaimer" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              5. Veterinary &amp; Medical Disclaimer
            </a>
            <a href="#moderation" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              6. Moderation &amp; Account Termination
            </a>
            <a href="#jurisdiction" className="text-[#554338] hover:text-[#974900] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#E8843A]">chevron_right</span>
              7. Governing Law &amp; Jurisdiction
            </a>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12 text-[#554338]">
          {/* Section 1 */}
          <section id="eligibility" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              1. Account Eligibility &amp; Registration
            </h2>
            <div className="space-y-3 text-[15px] leading-relaxed">
              <p>You must be at least 18 years of age (or have parental/guardian consent) to register a human account on Furlo.</p>
              <p>You agree to provide accurate registration details (email and credentials) and to maintain the security of your login password.</p>
              <p>One human account owner may create and manage up to 5 pet profiles (&quot;Paw Prints&quot;).</p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="model" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              2. The Pets-as-Actors Operating Rules
            </h2>
            <div className="p-6 rounded-2xl border bg-white space-y-3" style={{ borderColor: '#ede8e1' }}>
              <p className="text-[15px] leading-relaxed">
                Furlo operates on a pet-first identity framework:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[14px]">
                <li>Public activity (posts, likes, barks, treats, and community memberships) is conducted under your pet&apos;s handle (@username).</li>
                <li>You, as the human account owner, remain legally responsible for all posts, media uploads, and comments submitted through your pet&apos;s profile.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="content" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              3. User Content &amp; Intellectual Property
            </h2>
            <div className="space-y-3 text-[15px] leading-relaxed">
              <p><strong>Ownership:</strong> You retain full ownership of all photos, text, captions, and media you upload to Furlo.</p>
              <p><strong>License to Furlo:</strong> By posting content on Furlo, you grant Furlo a worldwide, non-exclusive, royalty-free license to display, store, format, and distribute your content solely for operating the platform and rendering community feeds.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="conduct" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              4. Community Code of Conduct
            </h2>
            <p className="text-[15px] mb-3">To maintain a safe, welcoming space for pet lovers, you agree NOT to post:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
              <div className="p-4 rounded-xl bg-white border border-[#ede8e1]">
                <strong className="text-[#ba1a1a]">🚫 No Animal Abuse or Cruelty:</strong> Content depicting harm, abuse, or neglect of animals is strictly prohibited and immediately reported to authorities.
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#ede8e1]">
                <strong className="text-[#ba1a1a]">🚫 No Harassment or Hate Speech:</strong> Bullying, discriminatory remarks, or personal attacks against community members will not be tolerated.
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#ede8e1]">
                <strong className="text-[#ba1a1a]">🚫 No Commercial Spam:</strong> Unauthorized promotional campaigns or commercial sales without admin authorization are disallowed.
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#ede8e1]">
                <strong className="text-[#ba1a1a]">🚫 No Misinformation:</strong> False claims, fake adoption listings, or deceptive emergency warnings are banned.
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="vet-disclaimer" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              5. Veterinary &amp; Medical Disclaimer
            </h2>
            <div className="p-6 rounded-2xl bg-[#fff7ed] border border-[#ffedd5] text-[#9a3412]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[24px]">medical_services</span>
                <h3 className="font-bold text-[17px]">Important Community Advice Notice</h3>
              </div>
              <p className="text-[14px] leading-relaxed">
                Posts, comments, tips, and answers shared on Furlo are provided for community support and peer discussion only. <strong>They do NOT constitute professional veterinary guidance, diagnosis, or treatment.</strong> Always consult a licensed veterinarian for medical emergencies or health decisions concerning your pet.
              </p>
            </div>
          </section>

          {/* Section 6 & 7 */}
          <section id="moderation" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              6. Moderation &amp; Account Suspension
            </h2>
            <p className="text-[15px] leading-relaxed mb-3">
              Furlo administrators reserve the right to review reported content and take appropriate actions, including warning users, removing violating posts, or permanently suspending accounts that violate community safety rules.
            </p>
          </section>

          {/* Section 8 */}
          <section id="jurisdiction" className="scroll-mt-24 pt-6 border-t border-[#dbc1b3]/40">
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
              7. Governing Law &amp; Contact
            </h2>
            <p className="text-[15px] leading-relaxed mb-4">
              These Terms are governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Bengaluru, Karnataka, India.
            </p>
            <p className="text-[14px] text-[#554338]">
              Questions regarding these Terms? Email us at <a href="mailto:support@furlopets.in" className="text-[#974900] font-semibold hover:underline">support@furlopets.in</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
