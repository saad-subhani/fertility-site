"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./AboutClinic.module.css";

const stats = [
  {
    number: "01",
    title: "Personalized",
    subtitle: "Care Approach",
  },
  {
    number: "02",
    title: "Confidential",
    subtitle: "Consultations",
  },
  {
    number: "03",
    title: "Expert",
    subtitle: "Guidance",
  },
  {
    number: "04",
    title: "Patient",
    subtitle: "First Care",
  },
];

const points = [
  "Personalized consultation",
  "Confidential patient care",
  "Clear treatment guidance",
  "Support throughout your journey",
];

export default function AboutClinic() {
  return (
    <section className={styles.section}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.ambientGlowTwo} aria-hidden="true" />
      <div className={styles.gridPattern} aria-hidden="true" />

      <div className={`container ${styles.container}`}>
        <div className={styles.topIntro}>
          <div className={styles.introLabel}>
            <span className={styles.introLine} />
            <span>01 / ABOUT THE CLINIC</span>
          </div>

          <p className={styles.introText}>
            A thoughtful approach to fertility care, built around
            <span> you.</span>
          </p>
        </div>

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

              <div className={styles.statContent}>
                <strong>{stat.title}</strong>
                <span>{stat.subtitle}</span>
              </div>

              <span className={styles.statArrow}>↗</span>
            </div>
          ))}
        </div>

        <div className={styles.aboutGrid}>
          <div className={styles.imageSide}>
            <div className={styles.imageOrb} aria-hidden="true" />

            <div className={styles.aboutImage}>
              <Image
                src="/fertility.jpg"
                alt="Fertility Clinic by AJ"
                fill
                priority
                sizes="(max-width: 1000px) 92vw, 48vw"
                className={styles.clinicImage}
              />

              <div className={styles.imageOverlay} />
              <div className={styles.imageShine} />

              <div className={styles.imageTop}>
                <span>FERTILITY</span>
                <span>CARE / 2026</span>
              </div>

              {/* CENTER LOGO */}
              <div className={styles.logoMark}>
                <div className={styles.logoOrbit}>
                  <span className={styles.orbitDot} />
                  <span className={styles.orbitDotTwo} />
                </div>

                <div className={styles.logoCircle}>
                  <Image
                    src="/pass.png"
                    alt="Fertility Clinic by AJ"
                    width={92}
                    height={92}
                    className={styles.logoImage}
                  />
                </div>

                <div className={styles.logoText}>
                  <span>FERTILITY</span>
                  <span>CLINIC BY AJ</span>
                </div>
              </div>

              <div className={styles.imageBottom}>
                <div className={styles.imageBottomLine} />
                <span>COMPASSION + SCIENCE</span>
              </div>
            </div>

            <div className={styles.expertiseCard}>
              <div className={styles.expertiseIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3L13.8 9.2L20 11L13.8 12.8L12 19L10.2 12.8L4 11L10.2 9.2L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <small>TRUSTED APPROACH</small>
                <strong>Patient First</strong>
              </div>
            </div>

            <div className={styles.imageBadge}>
              <span className={styles.badgePulse} />
              <span>CARE THAT LISTENS</span>
            </div>

            <div className={styles.cornerDetail} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.labelWrap}>
              <span className={styles.labelDot} />
              <span className={styles.label}>ABOUT OUR CLINIC</span>
            </div>

            <h2>
              Compassionate care for
              <span>your fertility journey.</span>
            </h2>

            <div className={styles.headingLine}>
              <span />
              <i />
            </div>

            <p className={styles.lead}>
              At Fertility Clinic by AJ, we understand that every
              fertility journey is personal. Our approach focuses on
              listening, understanding your needs, and providing
              thoughtful guidance at every stage.
            </p>

            <p>
              From your first consultation to understanding your
              options, we aim to create a comfortable, respectful,
              and confidential environment for every patient.
            </p>

            <div className={styles.points}>
              {points.map((point) => (
                <div className={styles.point} key={point}>
                  <span className={styles.check}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 12.5L10 16.5L18.5 7.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span className={styles.pointText}>{point}</span>

                  <span className={styles.pointArrow}>→</span>
                </div>
              ))}
            </div>

            <div className={styles.bottomContent}>
              <Link href="/about" className={styles.learnMore}>
                <span>Learn More About Us</span>

                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12H19M13 6L19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </i>
              </Link>

              <div className={styles.signature}>
                <span />
                <div>
                  <small>OUR PHILOSOPHY</small>
                  <strong>Science with humanity.</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.philosophy}>
          <div className={styles.philosophyLeft}>
            <span className={styles.philosophyDot} />
            <span>HEALTHCARE WITH HUMANITY</span>
          </div>

          <div className={styles.philosophyCenter}>
            <span>Every journey deserves</span>
            <strong>care, clarity & hope.</strong>
          </div>

          <div className={styles.philosophyRight}>
            <span>FERTILITY CLINIC BY AJ</span>
            <i>✦</i>
          </div>
        </div>
      </div>
    </section>
  );
}