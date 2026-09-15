import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const whoWeAre = [
  { label: "About", href: "/#home" },
  { label: "Our Team", href: "/#consultant" },
  { label: "Work With Us", href: "/#contact" },
  { label: "Our Locations", href: "/#contact" },
];

const ourServices = [
  { label: "Fertility Assessment & Testing", href: "/#treatments" },
  { label: "IVF & Fertility Treatment", href: "/#treatments" },
  { label: "Fertility Preservation", href: "/#treatments" },
  { label: "Trying to Conceive", href: "/#journey" },
  { label: "Early Pregnancy Program", href: "/#treatments" },
  { label: "Wellness & Acupuncture", href: "/#treatments" },
];

const resources = [
  { label: "Pricing", href: "/#contact" },
  { label: "Financing Options", href: "/#contact" },
  { label: "Patient Stories", href: "/#testimonials" },
  { label: "Blogs", href: "/#faqs" },
  { label: "Frequently Asked Questions", href: "/#faqs" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Curved top wave — overlaps down into the navy body below */}
      <div className={styles.waveWrap}>
        <svg
          className={styles.wave}
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,0 L1440,0 L1440,25 C960,140 480,140 0,25 Z" />
        </svg>
      </div>

      {/* Navy body — everything below the wave lives here */}
      <div className={styles.footerBody}>
        {/* Decorative background */}
        <div className={styles.glowOne}></div>
        <div className={styles.glowTwo}></div>

        <div className={styles.container}>
        <div className={styles.grid}>

          {/* ================= LET'S CONNECT ================= */}
          <div className={styles.col}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo1.png"
                alt="Fertility Clinic by AJ"
                width={180}
                height={70}
                className={styles.logoImage}
              />
            </Link>

            <h3>Let&apos;s Connect</h3>

            <div className={styles.social}>
              <div className={styles.socialIcons}>
                <a href="https://www.facebook.com/profile.php?id=61567219496373" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.7.3-1 1-1Z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/fertility.clinic.by.aj/" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>
            </div>

            <a href="mailto:fertilityclinic@gmail.com" className={styles.underlineLink}>
              fertilityclinic@gmail.com
            </a>

            <p className={styles.plainText}>
              Phone: +92 345 4766104
            </p>

          </div>

          {/* ================= WHO WE ARE ================= */}
          <div className={styles.col}>
            <Link href="/book-consultation" className={styles.bookBtn}>
              Book With Us
            </Link>

            <h3>Who We Are</h3>

            <ul>
              {whoWeAre.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className={styles.underlineLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* ================= OUR SERVICES ================= */}
          <div className={styles.col}>
            <h3>Our Services</h3>

            <ul>
              {ourServices.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className={styles.underlineLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= RESOURCES ================= */}
          <div className={styles.col}>
            <h3>Resources</h3>

            <ul>
              {resources.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className={styles.underlineLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= HOURS OF OPERATION ================= */}
          <div className={styles.col}>
            <h3>Hours of Operation</h3>

            <p className={styles.plainText}>
              Monday to Friday: 9am – 7pm
              <br />
              Saturday: 10am – 4pm
              <br />
              Sunday: Closed
            </p>

            <p className={styles.note}>
              For medical emergencies, please contact your nearest hospital.
            </p>
          </div>

        </div>

        {/* ================= BOTTOM ================= */}
        <div className={styles.bottom}>
          <p>© {year} Fertility Clinic by AJ. All rights reserved.</p>
        </div>
      </div>
      </div>
    </footer>
  );
}