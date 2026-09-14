"use client";

import styles from "./Testimonials.module.css";

const reviews = [
  {
    quote:
      "The team was incredibly supportive and professional. After years of trying, we finally became parents. We'll always be grateful!",
    name: "Sarah & James",
    tag: "IVF Success",
  },
  {
    quote:
      "The care, compassion and expertise we received made all the difference. We felt supported every step of the way.",
    name: "Ayesha Khan",
    tag: "IUI Success",
  },
  {
    quote:
      "I chose to freeze my eggs for the future and the process was so smooth. The team made me feel completely at ease.",
    name: "Emily Carter",
    tag: "Egg Freezing",
  },
  {
    quote:
      "Clear explanations, gentle care, and real hope. We couldn't have asked for a better clinic to guide us.",
    name: "Omar & Layla",
    tag: "IVF Success",
  },
  {
    quote:
      "From the first consultation we felt heard. The personalised plan and ongoing support were outstanding.",
    name: "Priya Sharma",
    tag: "Fertility Testing",
  },
];

function ReviewCard({
  quote,
  name,
  tag,
}: {
  quote: string;
  name: string;
  tag: string;
}) {
  return (
    <article className={styles.card}>
      <span className={styles.marks} aria-hidden="true">
        “
      </span>
      <p className={styles.quote}>{quote}</p>
      <div className={styles.author}>
        <span className={styles.avatar}>{name.charAt(0)}</span>
        <div>
          <strong>{name}</strong>
          <span>{tag}</span>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const loop = [...reviews, ...reviews];

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Patient Testimonials</span>
        <h2>Real stories. Lasting hope.</h2>
        <p>Hear from the people who have trusted us with their dreams.</p>
      </div>

      <div className={styles.marquee}>
        <div className={styles.track}>
          {loop.map((item, i) => (
            <ReviewCard key={`${item.name}-${i}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
