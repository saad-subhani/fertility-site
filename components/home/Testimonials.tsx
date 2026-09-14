"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(`.${styles.card}`) as HTMLElement | null;
    const gap = 18;
    const amount = card ? card.offsetWidth + gap : 320;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Patient Testimonials</span>
          <h2>Real stories. Lasting hope.</h2>
          <p>Hear from the people who have trusted us with their dreams.</p>
        </div>

        <div className={styles.sliderWrap}>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous testimonials"
          >
            ‹
          </button>

          <div className={styles.viewport}>
            <div ref={trackRef} className={styles.track}>
              {reviews.map((item) => (
                <ReviewCard key={item.name} {...item} />
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next testimonials"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
