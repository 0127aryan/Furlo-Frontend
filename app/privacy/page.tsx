import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Privacy Policy | Furlo",
  description: "Privacy Policy of Furlo Community Platform.",
};

export default function PrivacyPolicy() {
  const logoUrl =
    process.env.NEXT_PUBLIC_LOGO_URL &&
    !process.env.NEXT_PUBLIC_LOGO_URL.includes("lh3.googleusercontent.com")
      ? process.env.NEXT_PUBLIC_LOGO_URL
      : "/logo.png";
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Furlo";
  const waitlistCount = process.env.NEXT_PUBLIC_WAITLIST_COUNT ?? "200";

  return (
    <div className={styles.pageWrapper}>
      {/* ─── NAV ─── */}
      <nav className={styles.nav} id="top-nav">
        <div className={styles.navInner}>
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt={appName} className={styles.navLogo} />
          </div>
          <div className={styles.navLinks}>
            <Link href="/#features" className={styles.navLink}>
              Features
            </Link>
            <Link href="/#how-it-works" className={styles.navLink}>
              How it Works
            </Link>
            <Link href="/#community" className={styles.navLink}>
              Community
            </Link>
          </div>
          <Link href="/#waitlist" className={styles.navCta}>
            Join Waitlist
          </Link>
        </div>
      </nav>

      {/* ─── MAIN CONTENT ─── */}
      <main className={styles.mainContent}>
        <article className={styles.article}>
          {/* Header Section */}
          <header className={styles.header}>
            <p className={styles.category}>Legal &amp; Privacy</p>
            <h1 className={styles.title}>Privacy Policy</h1>
            <div className={styles.metaInfo}>
              <span className={`material-symbols-outlined ${styles.metaIcon}`}>
                calendar_today
              </span>
              <p>Last Updated: June 2026</p>
            </div>
            <div className={styles.divider} />
          </header>

          {/* Introduction */}
          <section className={styles.introText}>
            At {appName}, we value your trust and are committed to protecting
            the privacy of our community members and their furry companions.
            This Privacy Policy explains how we collect, use, and safeguard your
            information when you use our platform.
          </section>

          {/* Table of Contents */}
          <nav className={styles.quickNav}>
            <h2 className={styles.quickNavTitle}>Quick Navigation</h2>
            <ul className={styles.quickNavGrid}>
              <li>
                <a className={styles.quickNavLink} href="#collect">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  1. What Data We Collect
                </a>
              </li>
              <li>
                <a className={styles.quickNavLink} href="#no-collect">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  2. What We Do NOT Collect
                </a>
              </li>
              <li>
                <a className={styles.quickNavLink} href="#use">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  3. How We Use Your Data
                </a>
              </li>
              <li>
                <a className={styles.quickNavLink} href="#third-party">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  4. Third-Party Services
                </a>
              </li>
              <li>
                <a className={styles.quickNavLink} href="#security">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  5. Storage &amp; Security
                </a>
              </li>
              <li>
                <a className={styles.quickNavLink} href="#rights">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  6. Your DPDPA Rights
                </a>
              </li>
              <li>
                <a className={styles.quickNavLink} href="#cookies">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  7. Cookies &amp; Analytics
                </a>
              </li>
              <li>
                <a className={styles.quickNavLink} href="#children">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  8. Children&apos;s Privacy
                </a>
              </li>
              <li>
                <a className={styles.quickNavLink} href="#retention">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  9. Data Retention
                </a>
              </li>
              <li>
                <a className={styles.quickNavLink} href="#grievance">
                  <span
                    className={`material-symbols-outlined ${styles.quickNavIcon}`}
                  >
                    arrow_right_alt
                  </span>
                  10. Grievance Officer
                </a>
              </li>
            </ul>
          </nav>

          {/* Sections */}
          <div className={styles.sectionsArea}>
            {/* Section 1 */}
            <section className={styles.section} id="collect">
              <h2 className={styles.sectionTitle}>1. What Data We Collect</h2>
              <div className={styles.sectionContent}>
                <p className={styles.text}>
                  <span className={styles.tdStrong}>
                    Account Data (collected at signup):
                  </span>
                </p>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Email address</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Name (display name you provide)</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>City / location (as selected by you)</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Authentication method (email or Google)</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Account creation date</span>
                  </li>
                </ul>

                <p className={styles.text}>
                  <span className={styles.tdStrong}>
                    Pet Profile Data (collected during onboarding and profile
                    setup):
                  </span>
                </p>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Pet name and username</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Pet photos (uploaded by you)</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Breed, age, gender, vaccination status</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Personality tags and bio</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>City of the pet</span>
                  </li>
                </ul>

                <p className={styles.text}>
                  <span className={styles.tdStrong}>
                    Content Data (collected when you use the platform):
                  </span>
                </p>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Posts, captions, images you upload</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Comments and replies you write</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Likes and community memberships</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Follow relationships between pet profiles</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Post type tags and hashtags</span>
                  </li>
                </ul>

                <p className={styles.text}>
                  <span className={styles.tdStrong}>
                    Usage Data (collected automatically):
                  </span>
                </p>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Pages visited and features used</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Device type and browser type</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      IP address (used for security, not stored long-term)
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Session timestamps</span>
                  </li>
                </ul>

                <p className={styles.text}>
                  <span className={styles.tdStrong}>Communication Data:</span>
                </p>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Emails you send to our support address</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>In-app reports you submit</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className={styles.section} id="no-collect">
              <h2 className={styles.sectionTitle}>
                2. What Data We Do NOT Collect
              </h2>
              <div className={styles.sectionContent}>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      Payment or financial information (no transactions in V1)
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      Precise GPS location (we collect city-level location only,
                      selected by you)
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Government identification documents</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>Biometric data</span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      Data about children under 13 (users must be 18+ or have
                      parental consent)
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className={styles.section} id="use">
              <h2 className={styles.sectionTitle}>3. How We Use Your Data</h2>
              <div className={styles.sectionContent}>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Purpose</th>
                        <th className={styles.th}>Data Used</th>
                        <th className={styles.th}>Legal Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Creating and maintaining your account
                        </td>
                        <td className={styles.td}>Email, name, auth data</td>
                        <td className={styles.td}>Contract performance</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Displaying pet profiles and content
                        </td>
                        <td className={styles.td}>Pet data, photos, posts</td>
                        <td className={styles.td}>Contract performance</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Showing you relevant feed content
                        </td>
                        <td className={styles.td}>
                          Community memberships, follows
                        </td>
                        <td className={styles.td}>Contract performance</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Sending transactional emails
                        </td>
                        <td className={styles.td}>Email address</td>
                        <td className={styles.td}>Contract performance</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Sending notification emails
                        </td>
                        <td className={styles.td}>
                          Email address, notification preferences
                        </td>
                        <td className={styles.td}>
                          Legitimate interest + consent
                        </td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Detecting and preventing abuse
                        </td>
                        <td className={styles.td}>Usage data, IP, reports</td>
                        <td className={styles.td}>Legitimate interest</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Improving the platform
                        </td>
                        <td className={styles.td}>
                          Anonymised usage analytics (PostHog)
                        </td>
                        <td className={styles.td}>Legitimate interest</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Error monitoring
                        </td>
                        <td className={styles.td}>
                          Error logs (Sentry, anonymised)
                        </td>
                        <td className={styles.td}>Legitimate interest</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className={styles.section} id="third-party">
              <h2 className={styles.sectionTitle}>
                4. Third-Party Services We Use
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Service</th>
                        <th className={styles.th}>Purpose</th>
                        <th className={styles.th}>Data Shared</th>
                        <th className={styles.th}>Policy Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Supabase
                        </td>
                        <td className={styles.td}>
                          Database, authentication, file storage
                        </td>
                        <td className={styles.td}>
                          Account data, content, images
                        </td>
                        <td className={styles.td}>
                          <a
                            href="https://supabase.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.supportLink}
                          >
                            supabase.com
                          </a>
                        </td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Vercel
                        </td>
                        <td className={styles.td}>Website hosting</td>
                        <td className={styles.td}>IP address, request logs</td>
                        <td className={styles.td}>
                          <a
                            href="https://vercel.com/legal/privacy-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.supportLink}
                          >
                            vercel.com
                          </a>
                        </td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Resend
                        </td>
                        <td className={styles.td}>
                          Transactional email delivery
                        </td>
                        <td className={styles.td}>Email address, name</td>
                        <td className={styles.td}>
                          <a
                            href="https://resend.com/legal/privacy-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.supportLink}
                          >
                            resend.com
                          </a>
                        </td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          PostHog
                        </td>
                        <td className={styles.td}>
                          Usage analytics (anonymised)
                        </td>
                        <td className={styles.td}>Page views, feature usage</td>
                        <td className={styles.td}>
                          <a
                            href="https://posthog.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.supportLink}
                          >
                            posthog.com
                          </a>
                        </td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Sentry
                        </td>
                        <td className={styles.td}>
                          Error tracking (anonymised)
                        </td>
                        <td className={styles.td}>Error logs</td>
                        <td className={styles.td}>
                          <a
                            href="https://sentry.io/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.supportLink}
                          >
                            sentry.io
                          </a>
                        </td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Google OAuth
                        </td>
                        <td className={styles.td}>
                          Authentication (if Google login chosen)
                        </td>
                        <td className={styles.td}>Email, name</td>
                        <td className={styles.td}>
                          <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.supportLink}
                          >
                            google.com
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className={styles.text}>
                  We do not sell your data to any third party. We do not use
                  your data for advertising on external platforms.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className={styles.section} id="security">
              <h2 className={styles.sectionTitle}>
                5. Data Storage &amp; Security
              </h2>
              <div className={styles.sectionContent}>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      All data is stored on Supabase servers (hosted on AWS
                      infrastructure in your chosen region).
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      We use Row-Level Security (RLS) on all database tables —
                      users can only access their own data.
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      All data is transmitted over HTTPS (TLS encryption).
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      Passwords are hashed using Supabase Auth&apos;s secure
                      hashing (bcrypt).
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      Pet profile images are stored in Supabase Storage with
                      access controls.
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      We do not store credit card or payment data (no
                      transactions in V1).
                    </span>
                  </li>
                </ul>

                {/* Shaded Callout Box */}
                <div className={styles.securityCallout}>
                  <h3 className={styles.securityHeader}>
                    How we secure your data
                  </h3>
                  <p className={styles.securityText}>
                    Furlo uses industry-standard encryption for data at rest and
                    TLS for data in transit. In the event of a data breach
                    affecting your personal data, we will notify affected users
                    within 72 hours of becoming aware of the breach, as required
                    by applicable law.
                  </p>
                  <span
                    className={`material-symbols-outlined ${styles.securityBgIcon}`}
                  >
                    shield_person
                  </span>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className={styles.section} id="rights">
              <h2 className={styles.sectionTitle}>
                6. Your Rights Under DPDPA 2023
              </h2>
              <div className={styles.sectionContent}>
                <p className={styles.text}>
                  As a data principal under India&apos;s Digital Personal Data
                  Protection Act, 2023, you have the following rights:
                </p>

                {/* Bento Rights Grid */}
                <div className={styles.rightsGrid}>
                  <div className={styles.rightCard}>
                    <div className={styles.rightCardIconWrapper}>
                      <span
                        className={`material-symbols-outlined ${styles.rightCardIcon}`}
                      >
                        visibility
                      </span>
                    </div>
                    <h3 className={styles.rightCardTitle}>Right to Access</h3>
                    <p className={styles.rightCardDesc}>
                      Request a copy of all personal data we hold about you by
                      emailing privacy.furlo@gmail.com.
                    </p>
                  </div>

                  <div className={styles.rightCard}>
                    <div className={styles.rightCardIconWrapper}>
                      <span
                        className={`material-symbols-outlined ${styles.rightCardIcon}`}
                      >
                        edit_note
                      </span>
                    </div>
                    <h3 className={styles.rightCardTitle}>Right to Correct</h3>
                    <p className={styles.rightCardDesc}>
                      Update or rectify any inaccurate or incomplete personal
                      data via your account settings.
                    </p>
                  </div>

                  <div className={styles.rightCard}>
                    <div className={styles.rightCardIconWrapper}>
                      <span
                        className={`material-symbols-outlined ${styles.rightCardIcon}`}
                      >
                        delete_forever
                      </span>
                    </div>
                    <h3 className={styles.rightCardTitle}>Right to Erasure</h3>
                    <p className={styles.rightCardDesc}>
                      Permanently remove your account and all associated data
                      via settings or support email.
                    </p>
                  </div>

                  <div className={styles.rightCard}>
                    <div className={styles.rightCardIconWrapper}>
                      <span
                        className={`material-symbols-outlined ${styles.rightCardIcon}`}
                      >
                        security
                      </span>
                    </div>
                    <h3 className={styles.rightCardTitle}>Right to Nominate</h3>
                    <p className={styles.rightCardDesc}>
                      Nominate another person to exercise your rights on your
                      behalf in case of incapacity.
                    </p>
                  </div>
                </div>

                <p className={styles.text}>
                  <span className={styles.tdStrong}>Response time:</span> We
                  will respond to all rights requests within 30 days.
                </p>
                <p className={styles.text}>
                  <span className={styles.tdStrong}>Account Deletion:</span>{" "}
                  When you delete your account, we will:
                </p>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      Delete your email address, display name, and login
                      credentials within 30 days.
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      Delete or anonymise your pet profiles and content within
                      30 days.
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      Retain anonymised aggregate data (no personal identifiers)
                      for platform analytics.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section className={styles.section} id="cookies">
              <h2 className={styles.sectionTitle}>
                7. Cookies &amp; Analytics
              </h2>
              <div className={styles.sectionContent}>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      <span className={styles.tdStrong}>
                        Essential cookies:
                      </span>{" "}
                      Required for login session management (cannot be
                      disabled).
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      <span className={styles.tdStrong}>
                        Analytics cookies (PostHog):
                      </span>{" "}
                      Track page visits and feature usage — only set after you
                      consent to our cookie banner.
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      <span className={styles.tdStrong}>
                        No advertising cookies:
                      </span>{" "}
                      We do not use any advertising or tracking cookies.
                    </span>
                  </li>
                </ul>
                <p className={styles.text}>
                  You can withdraw analytics consent at any time via the cookie
                  settings in your account.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className={styles.section} id="children">
              <h2 className={styles.sectionTitle}>
                8. Children&apos;s Privacy
              </h2>
              <div className={styles.sectionContent}>
                <p className={styles.text}>
                  This platform is not intended for children under 13. We do not
                  knowingly collect data from children under 13. Users between
                  13-18 require parental consent. If we discover an account
                  belonging to a child under 13, we will delete it immediately.
                  If you believe a child under 13 has created an account,
                  contact us at{" "}
                  <a
                    href="mailto:furlo.pets.app@gmail.com"
                    className={styles.strongText}
                  >
                    furlo.pets.app@gmail.com
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className={styles.section} id="retention">
              <h2 className={styles.sectionTitle}>9. Data Retention</h2>
              <div className={styles.sectionContent}>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Data Type</th>
                        <th className={styles.th}>Retention Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Active account data
                        </td>
                        <td className={styles.td}>Until account deletion</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Pet profile data
                        </td>
                        <td className={styles.td}>Until account deletion</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          User-generated content (posts, comments)
                        </td>
                        <td className={styles.td}>
                          Until deleted by user or admin
                        </td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Removed/moderated content
                        </td>
                        <td className={styles.td}>
                          90 days after removal (for appeal purposes), then
                          deleted
                        </td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Usage analytics (anonymised)
                        </td>
                        <td className={styles.td}>24 months</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Error logs (anonymised)
                        </td>
                        <td className={styles.td}>90 days</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Support emails
                        </td>
                        <td className={styles.td}>2 years</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdStrong}`}>
                          Notification records
                        </td>
                        <td className={styles.td}>90 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section className={styles.section} id="grievance">
              <h2 className={styles.sectionTitle}>
                10. Grievance Officer &amp; Changes
              </h2>
              <div className={styles.sectionContent}>
                <p className={styles.text}>
                  As required under Indian law, we have designated a Grievance
                  Officer:
                </p>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      <span className={styles.tdStrong}>Email:</span>{" "}
                      <a
                        href="mailto:furlo.pets.app@gmail.com"
                        className={styles.strongText}
                      >
                        furlo.pets.app@gmail.com
                      </a>
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      <span className={styles.tdStrong}>Address:</span> Jaipur,
                      Rajasthan, India
                    </span>
                  </li>
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot}>•</span>
                    <span>
                      <span className={styles.tdStrong}>Response time:</span>{" "}
                      Within 30 days of receiving a complaint
                    </span>
                  </li>
                </ul>
                <div className={styles.divider} />
                <h3 className={styles.tdStrong} id="changes">
                  11. Changes to This Policy
                </h3>
                <p className={styles.text}>
                  We will notify you of material changes to this Privacy Policy
                  via in-app notification and email at least 14 days before
                  changes take effect. Continued use after that date constitutes
                  acceptance.
                </p>
              </div>
            </section>
          </div>
        </article>
      </main>

      {/* Support Redressal Bottom CTA */}
      <section className={styles.supportSection}>
        <h2 className={styles.supportTitle}>Questions about your privacy?</h2>
        <p className={styles.supportDesc}>
          Our dedicated privacy team is here to help you navigate your data
          rights.
        </p>
        <a
          className={styles.supportLink}
          href="mailto:furlo.pets.app@gmail.com"
        >
          Contact Privacy Team
          <span
            className={`material-symbols-outlined ${styles.supportLinkIcon}`}
          >
            mail
          </span>
        </a>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt={appName} className={styles.footerLogo} />
            <p className={styles.footerTagline}>
              Building a trusted community for pets and the people who love
              them.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/privacy" className={styles.footerLinkActive}>
              Privacy Policy
            </Link>
            <Link href="/" className={styles.footerLink}>
              Terms of Service
            </Link>
            <a
              href="mailto:furlo.pets.app@gmail.com"
              className={styles.footerLink}
            >
              Contact Us
            </a>
            <a
              href="https://www.instagram.com/furlo.pets?igsh=MTZhNmU1dmlrczFzOQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Instagram
            </a>
            <Link href="/" className={styles.footerLink}>
              Community Guidelines
            </Link>
          </div>
          <p className={styles.footerCopy}>
            © 2026 {appName} Community. All paws reserved. 🐾
          </p>
        </div>
      </footer>
    </div>
  );
}
