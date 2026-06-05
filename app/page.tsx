import styles from './page.module.css'
import WaitlistForm from '@/components/WaitlistForm'
import { PET_PROFILES, FEATURES, STEPS } from '@/constants/landing'


export default function Home() {
  const logoUrl = (process.env.NEXT_PUBLIC_LOGO_URL && !process.env.NEXT_PUBLIC_LOGO_URL.includes('lh3.googleusercontent.com'))
    ? process.env.NEXT_PUBLIC_LOGO_URL
    : '/logo.png'
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'Furlo'
  const waitlistCount = process.env.NEXT_PUBLIC_WAITLIST_COUNT ?? '200'

  return (
    <div className="min-h-screen">

      {/* ─── NAV ─── */}
      <nav className={styles.nav} id="top-nav">
        <div className={styles.navInner}>
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={appName}
              className={styles.navLogo}
            />
          </div>
          <div className={styles.navLinks}>
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it Works', href: '#how-it-works' },
              { label: 'Community', href: '#community' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.navLink}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#waitlist"
            id="nav-waitlist-cta"
            className={styles.navCta}
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className={styles.hero} id="features">
        {/* Mesh grid overlay */}
        <div className={styles.meshGrid} />

        <div className={styles.heroInner}>
          {/* Left — Copy */}
          <div className={styles.heroContent}>
            <div className={styles.heroHeader}>
              <div className={styles.launchBadge}>
                <span className={styles.launchBadgeIcon}>✨</span> Launching Soon Across India
              </div>
              <div className={styles.brandName}>
                {appName}
              </div>
            </div>

            <h1 className={styles.heroTitle}>
              Where Pets{' '}
              <span className={styles.heroTitleAccent}>
                Belong
              </span>
            </h1>

            <p className={styles.heroDesc}>
              The community platform for pet parents across India. Your pet gets their own profile,
              their own community, and their own story.
            </p>

            {/* Social proof */}
            <div className={styles.socialProof}>
              <div className={styles.avatarStack}>
                {['#2f363c', '#304d40', '#e8843a'].map((bg, i) => (
                  <div
                    key={i}
                    className={styles.avatar}
                    style={{ backgroundColor: bg }}
                  />
                ))}
              </div>
              <p className={styles.socialProofText}>
                Join{' '}
                <span className={styles.socialProofCount}>{waitlistCount}+</span>{' '}
                pet parents already on the waitlist
              </p>
            </div>

            {/* CTA */}
            <a
              href="#waitlist"
              id="hero-waitlist-cta"
              className={styles.heroCta}
            >
              Join the Waitlist
              <svg className={styles.ctaIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Right — Floating Pet Cards */}
          <div className={styles.petCardsArea}>
            {PET_PROFILES.map((pet) => (
              <div
                key={pet.name}
                className={`${styles.petCard} ${styles[pet.className]}`}
              >
                <div className={styles.petCardHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pet.img}
                    alt={pet.name}
                    className={styles.petAvatar}
                  />
                  <div>
                    <h3 className={styles.petName}>
                      {pet.name}
                    </h3>
                    <span className={styles.petBreed}>
                      {pet.breed}
                    </span>
                  </div>
                </div>
                <div className={styles.petStats}>
                  <div className={styles.petStat}>
                    <span className={styles.petStatValue}>{pet.followers}</span>
                    <span className={styles.petStatLabel}>Followers</span>
                  </div>
                  <div className={styles.petStat}>
                    <span className={styles.petStatValue}>{pet.vibe}</span>
                    <span className={styles.petStatLabel}>{pet.vibeLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollLabel}>Scroll</span>
          <svg className={styles.scrollIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className={styles.features} id="how-it-works">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Built for the Modern Pet Parent
            </h2>
            <p className={styles.sectionSubtitle}>
              Discover a new way to celebrate your pet&apos;s life and connect with a community that understands.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={styles.featureCard}
                style={{ background: f.accentBg, border: `1px solid ${f.accentBorder}` }}
              >
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>
                  {f.title}
                </h3>
                <p className={styles.featureDesc}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className={styles.howItWorks} id="community">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Getting Started
            </h2>
            <p className={styles.sectionSubtitle}>
              Three simple steps to give your pet their forever community.
            </p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((step) => (
              <div
                key={step.num}
                className={styles.step}
              >
                <div className={styles.stepNum}>
                  {step.num}
                </div>
                <h4 className={styles.stepTitle}>
                  {step.title}
                </h4>
                <p className={styles.stepDesc}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WAITLIST CTA ─── */}
      <section className={styles.waitlistSection} id="waitlist">
        <div className={styles.waitlistBox}>
          <div className={styles.dotOverlay} />
          <div className={styles.radialHighlight} />

          <div className={styles.waitlistContent}>
            <div className={styles.waitlistHeadline}>
              <h2 className={styles.waitlistTitle}>
                Your pet deserves more than a hashtag.
              </h2>
              <p className={styles.waitlistSubtitle}>
                Be among the first to join {appName} — India&apos;s community where pets are primary citizens of the internet.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={appName}
              className={styles.footerLogo}
            />
            <p className={styles.footerTagline}>Where Pets Belong</p>
          </div>
          <div className={styles.footerLinks}>
            {[
              { label: 'Instagram', href: 'https://www.instagram.com/furlo.pets?igsh=MTZhNmU1dmlrczFzOQ%3D%3D', target: '_blank', rel: 'noopener noreferrer' },
              { label: 'Contact', href: 'mailto:furlo.pets.app@gmail.com' },
              { label: 'Privacy Policy', href: '/privacy' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.footerLink}
                target={link.target}
                rel={link.rel}
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className={styles.footerCopy}>
            © 2026 {appName} Community. All paws reserved. 🐾
          </p>
        </div>
      </footer>
    </div>
  )
}
