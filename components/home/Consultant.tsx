"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Consultant.module.css";

const features = [
  {
    title: "Board-certified fertility specialists",
    icon: "doctor",
  },
  {
    title: "Bespoke tailored treatment plans",
    icon: "lab",
  },
  {
    title: "State-of-the-art laboratories",
    icon: "lab2",
  },
  {
    title: "Ongoing emotional support",
    icon: "heart",
  },
];

function FeatureIcon({ type }: { type: string }) {
  if (type === "doctor") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 19c1.2-3.8 3.6-5.5 6.5-5.5s5.3 1.7 6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "lab" || type === "lab2") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 3h6M10 3v5.2L6.5 16.5A3.2 3.2 0 0 0 9.4 21h5.2a3.2 3.2 0 0 0 2.9-4.5L14 8.2V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20s-6.5-4.2-6.5-9A3.9 3.9 0 0 1 12 7.5 3.9 3.9 0 0 1 18.5 11c0 4.8-6.5 9-6.5 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function Consultant() {
  return (
    <section className={styles.section} id="consultant">
      <div className={styles.container}>
        <div className={styles.media}>
          <div className={styles.imageWrap}>
            <Image
              src="/fertdoct.jpg"
              alt="Fertility specialist consultation"
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              className={styles.image}
            />
          </div>
          <p className={styles.caption}>
            Expert care,
            <br />
            for every stage
            <br />
            of your journey
          </p>
        </div>

        <div className={styles.content}>
          <span className={styles.eyebrow}>Our Doctors & Clinic</span>
          <h2>
            Trusted expertise.
            <br />
            Compassionate care.
          </h2>
          <p className={styles.lead}>
            Our experienced fertility specialists, embryologists and nursing
            team are committed to providing the highest standard of care, using
            the latest technology and evidence-based treatments.
          </p>

          <div className={styles.grid}>
            {features.map((item) => (
              <div key={item.title} className={styles.feature}>
                <span className={styles.icon}>
                  <FeatureIcon type={item.icon} />
                </span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>

          <Link href="/book-consultation" className={styles.cta}>
            Meet our doctors
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
