"use client";

import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.badge}>Error</div>
        <h1 className={styles.code}>404</h1>
        <div className={styles.divider} />
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>
          The page you are looking for doesn&apos;t exist or has been moved.
          Let us help you find your way back.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            Back to Home
          </Link>
          <Link href="/book-consultation" className={styles.secondaryBtn}>
            Book a Consultation
          </Link>
        </div>
        <div className={styles.links}>
          <Link href="/#treatments">Treatments</Link>
          <span className={styles.dot}>·</span>
          <Link href="/#consultant">Consultant</Link>
          <span className={styles.dot}>·</span>
          <Link href="/#faqs">FAQs</Link>
          <span className={styles.dot}>·</span>
          <Link href="/#contact">Contact</Link>
        </div>
      </div>
    </div>
  );
}
