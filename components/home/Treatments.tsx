import Link from "next/link";
import styles from "./Treatments.module.css";

const treatments = [
  {
    number: "01",
    title: "Fertility Consultation",
    description:
      "A private consultation to understand your concerns, discuss your fertility journey, and explore the next appropriate steps.",
    icon: "✦",
    tone: "lavender",
  },
  {
    number: "02",
    title: "Personalized Assessment",
    description:
      "A thoughtful review of your individual circumstances to help create a clear and personalized care approach.",
    icon: "◌",
    tone: "sage",
  },
  {
    number: "03",
    title: "Treatment Guidance",
    description:
      "Clear and compassionate guidance about available options, helping you understand your choices with confidence.",
    icon: "♡",
    tone: "blue",
  },
  {
    number: "04",
    title: "Follow-up Support",
    description:
      "Continued communication and support throughout your fertility journey, based on your individual needs.",
    icon: "↗",
    tone: "peach",
  },
];

export default function Treatments() {
  return (
    <section className={styles.section}>
      <div className={styles.backgroundGlow} />

      <div className={`container ${styles.container}`}>
        {/* =================================================
            HEADER
        ================================================= */}
        <div className={styles.header}>
          <div className={styles.headingSide}>
            <div className={styles.labelWrap}>
              <span className={styles.label}>OUR SERVICES</span>
              <span className={styles.labelDot} />
            </div>

            <h2>
              Care designed around
              <span> your journey.</span>
            </h2>
          </div>

          <p className={styles.intro}>
            Every fertility journey is different. Our approach is centered
            around understanding you, answering your questions, and providing
            thoughtful guidance at every stage.
          </p>
        </div>

        {/* =================================================
            STACKING CARDS
        ================================================= */}
        <div className={styles.stackArea}>
          {treatments.map((treatment, index) => (
            <div
              className={`${styles.stackItem} ${styles[`stack${index + 1}`]}`}
              key={treatment.number}
            >
              <article
                className={`${styles.card} ${styles[treatment.tone]}`}
              >
                {/* Card top */}
                <div className={styles.cardTop}>
                  <div className={styles.phase}>
                    <span>{treatment.number}</span>
                    <small>PHASE</small>
                  </div>

                  <div className={styles.icon}>
                    {treatment.icon}
                  </div>
                </div>

                {/* Card content */}
                <div className={styles.cardContent}>
                  <span className={styles.cardEyebrow}>
                    FERTILITY CARE
                  </span>

                  <h3>{treatment.title}</h3>

                  <p>{treatment.description}</p>

                  <Link
                    href="/book-consultation"
                    className={styles.cardLink}
                  >
                    Discuss With Consultant
                    <span>↗</span>
                  </Link>
                </div>

                {/* Decorative number */}
                <span className={styles.watermark}>
                  {treatment.number}
                </span>

                {/* Bottom progress */}
                <div className={styles.cardBottom}>
                  <span>
                    {treatment.number} / 04
                  </span>

                  <div className={styles.progress}>
                    <span
                      style={{
                        width: `${((index + 1) / treatments.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* =================================================
            BOTTOM CTA
        ================================================= */}
        <div className={styles.cta}>
          <div>
            <span className={styles.ctaLabel}>
              NOT SURE WHERE TO START?
            </span>

            <h3>
              Let&apos;s talk about your
              <span> fertility journey.</span>
            </h3>
          </div>

          <Link
            href="/book-consultation"
            className={styles.ctaButton}
          >
            Book a Consultation
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}