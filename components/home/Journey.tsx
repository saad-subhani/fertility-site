"use client";

import Link from "next/link";
import styles from "./Journey.module.css";

const steps = [
  {
    id: "01",
    title: "Initial Consultation",
    text: "We discuss your goals, review your health and create a personalised plan.",
    icon: "consult",
  },
  {
    id: "02",
    title: "Testing & Diagnosis",
    text: "We carry out the right tests to understand your unique needs.",
    icon: "test",
  },
  {
    id: "03",
    title: "Treatment & Support",
    text: "You receive expert care, ongoing monitoring and emotional support.",
    icon: "care",
  },
];

function StepIcon({ type }: { type: string }) {
  if (type === "consult") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5.5 19.2c1-3.5 3.4-5.2 6.5-5.2s5.5 1.7 6.5 5.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "test") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 3h6M10 3v5.2L6.5 16.5a3.2 3.2 0 0 0 2.9 4.5h5.2a3.2 3.2 0 0 0 2.9-4.5L14 8.2V3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.2S5.2 15.6 5.2 10.6A3.9 3.9 0 0 1 12 7.5a3.9 3.9 0 0 1 6.8 3.1c0 5-6.8 9.6-6.8 9.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Journey() {
  return (
    <section className={styles.section} id="journey">
      <div className={styles.blobOne} aria-hidden="true" />
      <div className={styles.blobTwo} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>Your Journey</span>
          <h2 className={styles.title}>
            A simple, supportive
            <br />
            path forward
          </h2>
          <p className={styles.desc}>
            We make your fertility journey as clear and comfortable as possible
            — with expert guidance at every step.
          </p>
          <Link href="/book-consultation" className={styles.cta}>
            Learn about your journey
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.id} className={styles.stepWrap}>
              <article className={styles.card}>
                <span className={styles.badge}>{step.id}</span>
                <div className={styles.icon}>
                  <StepIcon type={step.icon} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
              {index < steps.length - 1 && (
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
