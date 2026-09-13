"use client";

import Image from "next/image";
import styles from "./AboutClinic.module.css";

const highlights = [
  {
    title: "Personalized Care",
    text: "Your care is planned around your individual needs, concerns, and goals.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20 12.5C20 17 16.5 20 12 21.5C7.5 20 4 17 4 12.5V6.5L12 3L20 6.5V12.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12L11 14.5L15.8 9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Expert Guidance",
    text: "Clear and thoughtful guidance helps you understand your options with confidence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3L13.8 9.2L20 11L13.8 12.8L12 19L10.2 12.8L4 11L10.2 9.2L12 3Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M19 17L19.8 19.2L22 20L19.8 20.8L19 23L18.2 20.8L16 20L18.2 19.2L19 17Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Confidential Support",
    text: "A respectful and private environment where you can feel comfortable discussing your journey.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="5"
          y="10"
          width="14"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle
          cx="12"
          cy="15.5"
          r="1.5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M12 17V18.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Human-Centered Care",
    text: "We combine medical knowledge with empathy, patience, and genuine understanding.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20.8 8.8C20.8 13.5 12 19.5 12 19.5C12 19.5 3.2 13.5 3.2 8.8C3.2 6.1 5.2 4.2 7.7 4.2C9.5 4.2 11 5.2 12 6.6C13 5.2 14.5 4.2 16.3 4.2C18.8 4.2 20.8 6.1 20.8 8.8Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const stats = [
  {
    number: "01",
    title: "Personalized",
    subtitle: "Care",
  },
  {
    number: "02",
    title: "Expert",
    subtitle: "Guidance",
  },
  {
    number: "03",
    title: "Private",
    subtitle: "Consultations",
  },
  {
    number: "04",
    title: "Patient",
    subtitle: "First",
  },
];

export default function AboutClinic() {
  return (
    <section className={styles.section}>
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <div className={styles.backgroundGlowTwo} aria-hidden="true" />

      <div className={`container ${styles.container}`}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>ABOUT FERTILITY CLINIC BY AJ</span>
          </div>

          <h2>
            Care that feels personal.
            <span>Guidance you can trust.</span>
          </h2>

          <p>
            We believe fertility care should feel clear, respectful, and
            personal. Our approach brings together medical expertise and
            compassionate support at every stage of your journey.
          </p>
        </div>

        {/* LOGO */}
        <div className={styles.visualWrap}>
          <div className={styles.visualFrame}>
            <div className={styles.logoTop}>
              <div className={styles.logoHalo} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className={styles.logoCircle}>
                <div className={styles.logoInner}>
                  <Image
                    src="/pass.png"
                    alt="Fertility Clinic by AJ"
                    width={90}
                    height={90}
                    className={styles.logoImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className={styles.contentSection}>
          <div className={styles.story}>
            <div className={styles.sectionLabel}>
              <span />
              <p>OUR APPROACH</p>
            </div>

            <h3>
              Every fertility journey
              <span>is different.</span>
            </h3>

            <p className={styles.lead}>
              At Fertility Clinic by AJ, we understand that fertility is not
              simply a medical journey. It is deeply personal, and every
              individual and couple has a different story.
            </p>

            <p>
              That is why we focus on listening first, explaining your options
              clearly, and creating a comfortable environment where you can
              make informed decisions with confidence.
            </p>

            <div className={styles.storyAccent}>
              <span className={styles.accentIcon}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 3V21M3 12H21"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                </svg>
              </span>

              <div>
                <strong>Science with humanity.</strong>
                <span>
                  Thoughtful care designed around the person, not just the
                  treatment.
                </span>
              </div>
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div className={styles.highlights}>
            {highlights.map((item, index) => (
              <article
                className={styles.highlight}
                key={item.title}
                style={
                  {
                    "--delay": `${index * 0.08}s`,
                  } as React.CSSProperties
                }
              >
                <div className={styles.highlightTop}>
                  <div className={styles.highlightIcon}>{item.icon}</div>

                  <span className={styles.highlightNumber}>
                    0{index + 1}
                  </span>
                </div>

                <div className={styles.highlightContent}>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>

                <div className={styles.highlightLine} />
              </article>
            ))}
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div
              className={styles.stat}
              key={stat.number}
              style={
                {
                  "--delay": `${index * 0.1}s`,
                } as React.CSSProperties
              }
            >
              <span className={styles.statNumber}>{stat.number}</span>

              <div className={styles.statText}>
                <strong>{stat.title}</strong>
                <span>{stat.subtitle}</span>
              </div>

              <span className={styles.statDot} />
            </div>
          ))}
        </div>

        {/* FINAL STATEMENT */}
        <div className={styles.finalStatement}>
          <span className={styles.finalLine} />

          <p>
            A calmer, clearer approach to
            <strong> fertility care.</strong>
          </p>

          <span className={styles.finalLine} />
        </div>
      </div>
    </section>
  );
}