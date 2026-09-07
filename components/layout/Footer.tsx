import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const whoWeAre = [
  { label: "About", href: "/#about" },
  { label: "Our Team", href: "/#team" },
  { label: "Work With Us", href: "/#careers" },
  { label: "Our Locations", href: "/#locations" },
];

const ourServices = [
  { label: "Fertility Assessment & Testing", href: "/services/fertility-assessment" },
  { label: "IVF & Fertility Treatment", href: "/services/ivf" },
  { label: "Fertility Preservation", href: "/services/fertility-preservation" },
  { label: "Trying to Conceive", href: "/services/trying-to-conceive" },
  { label: "Early Pregnancy Program", href: "/services/early-pregnancy" },
  { label: "Wellness & Acupuncture", href: "/services/wellness" },
];

const resources = [
  { label: "Pricing", href: "/pricing" },
  { label: "Financing Options", href: "/financing" },
  { label: "Patient Stories", href: "/patient-stories" },
  { label: "Blogs", href: "/blogs" },
  { label: "Frequently Asked Questions", href: "/faqs" },
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

            <p className={styles.plainText}>
              Fertility Clinic by AJ
              <br />
              Your Clinic Address,
              <br />
              City, Pakistan
            </p>

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
                <li key={link.href}>
                  <Link href={link.href} className={styles.underlineLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.social}>
              <h4>Social</h4>
              <div className={styles.socialIcons}>
                <a href="#" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.8-1.95 3.7-1.95 3.95 0 4.68 2.6 4.68 5.98V21H17.4v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ================= OUR SERVICES ================= */}
          <div className={styles.col}>
            <h3>Our Services</h3>

            <ul>
              {ourServices.map((link) => (
                <li key={link.href}>
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
                <li key={link.href}>
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