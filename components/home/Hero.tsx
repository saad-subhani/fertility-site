"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

const typingPhrases = [
  "New Beginnings",
  "New Dreams",
  "New Journeys",
];

const stats = [
  {
    icon: "years",
    value: 15,
    suffix: "+",
    label: "Years",
    sub: "of fertility care experience",
  },
  {
    icon: "families",
    value: 5000,
    suffix: "+",
    label: "successful families",
    sub: "",
    format: true,
  },
  {
    icon: "satisfaction",
    value: 98,
    suffix: "%",
    label: "patient satisfaction",
    sub: "",
  },
  {
    icon: "patient",
    value: null,
    suffix: "",
    label: "Patient-First",
    sub: "compassionate, personalised care",
  },
];

function StatIcon({ type }: { type: string }) {
  if (type === "years") {
    // Professional user / specialist icon
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5.5 19.25c.85-3.4 3.15-5.25 6.5-5.25s5.65 1.85 6.5 5.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "families") {
    // Clean heart icon
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20.25S4.75 15.4 4.75 10.2A4.05 4.05 0 0 1 12 7.15a4.05 4.05 0 0 1 7.25 3.05c0 5.2-7.25 10.05-7.25 10.05Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "satisfaction") {
    // Shield with check
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3.5 19 6.2v5.4c0 4.85-3 8.55-7 10.15-4-1.6-7-5.3-7-10.15V6.2L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="m9.2 12.1 1.9 1.9 3.7-3.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // Plant / growth – patient-first care
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21V11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 14.5c-2.8 0-5.2-1.6-6.2-4.1-.2-.6.3-1.2.9-1.1 3.2.4 5.3 2.4 5.3 5.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.5c2.5-.2 4.8-1.6 5.9-3.9.3-.6-.2-1.2-.8-1.1-2.9.5-5.1 2.3-5.1 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.5c0-2.4 1.2-4.5 3.1-5.8.5-.3 1.1.1 1 .7-.3 2.4-1.8 4.4-4.1 5.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useCountUp(target: number | null, active: boolean, duration = 1600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === null || !active) return;

    let start: number | null = null;
    let frame = 0;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return count;
}

function StatItem({
  item,
  active,
}: {
  item: (typeof stats)[0];
  active: boolean;
}) {
  const count = useCountUp(item.value, active);

  const display =
    item.value === null
      ? null
      : item.format
        ? count.toLocaleString()
        : String(count);

  const title =
    item.value === null
      ? item.label
      : item.icon === "years"
        ? `${display}${item.suffix} ${item.label}`
        : `${display}${item.suffix}`;

  const subtitle =
    item.value === null
      ? item.sub
      : item.icon === "years"
        ? item.sub
        : item.label;

  return (
    <div className={styles.statCard}>
      <div className={styles.statIconWrap}>
        <StatIcon type={item.icon} />
      </div>
      <div className={styles.statBody}>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsActive, setStatsActive] = useState(false);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const cursor = cursorRef.current;
    if (!hero || !cursor) return;

    let animationFrame = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x - 26}px, ${y - 26}px, 0)`;
      });
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = "0";
      cursor.style.transform = "translate3d(-50%, -50%, 0) scale(0.7)";
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = "1";
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseenter", handleMouseEnter);
    hero.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseenter", handleMouseEnter);
      hero.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const phrase = typingPhrases[phraseIndex];
    const typingSpeed = isDeleting ? 55 : 95;
    const pause = !isDeleting && typedText === phrase ? 1700 : 0;

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === phrase) {
        setIsDeleting(true);
        return;
      }
      if (isDeleting && typedText === "") {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % typingPhrases.length);
        return;
      }
      setTypedText(
        isDeleting
          ? phrase.slice(0, typedText.length - 1)
          : phrase.slice(0, typedText.length + 1)
      );
    }, pause || typingSpeed);

    return () => window.clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <Image
        src="/bg1.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.backgroundImage}
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      <div className={styles.backgroundOverlay} />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlowTwo} />
      <div className={styles.noise} />

      <div className={styles.orbitLarge} />
      <div className={styles.orbitSmall} />

      <div className={`container ${styles.container}`}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.heartIcon}>♡</span>
            <span>Compassionate care. Advanced science. Better tomorrows.</span>
          </div>

          <h1 className={styles.heading}>
            <span>Turning Hope Into</span>
            <span className={styles.headingSecond}>
              <em className={styles.scriptText}>
                {typedText}
                <i className={styles.typingCursor} />
              </em>
            </span>
          </h1>

          <div className={styles.headingUnderline}>
            <span />
            <i>♡</i>
          </div>

          <div className={styles.description}>
            World-class fertility treatments, personalized care,
            <br className={styles.desktopBreak} />
            and unwavering support — every step of the way.
          </div>

          <div className={styles.heroAction}>
            <Link href="/book-consultation" className={styles.mainBooking}>
              <span>Book a consultation</span>
              <i>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </i>
            </Link>

            <Link href="#treatments" className={styles.secondaryBtn}>
              <span>Explore treatments</span>
              <i>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </i>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlapping stats banner */}
      <div className={styles.statsBannerWrap}>
        <div ref={statsRef} className={styles.statsBanner}>
          {stats.map((item) => (
            <StatItem key={item.icon} item={item} active={statsActive} />
          ))}
        </div>
      </div>

      <div
        ref={cursorRef}
        className={styles.cursorDetail}
        aria-hidden="true"
      >
        <span />
        <span />
        <span className={styles.cursorDot} />
      </div>
    </section>
  );
}
