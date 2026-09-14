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
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19.5c1.2-3.8 3.6-5.5 6.5-5.5s5.3 1.7 6.5 5.5" />
      </svg>
    );
  }
  if (type === "families") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 20s-6.5-4-6.5-8.8A3.9 3.9 0 0 1 12 7.8a3.9 3.9 0 0 1 6.5 3.4C18.5 16 12 20 12 20Z" />
      </svg>
    );
  }
  if (type === "satisfaction") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3.5 18.5 6v5.2c0 4.6-2.8 8.2-6.5 9.8-3.7-1.6-6.5-5.2-6.5-9.8V6L12 3.5Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21c0-4 2.5-6 4.5-8.2 1.5-1.6 2-3 1.4-4.6-.5-1.4-1.8-2.2-3.4-2.2-1.2 0-2.2.5-2.5 1.4-.3-.9-1.3-1.4-2.5-1.4-1.6 0-2.9.8-3.4 2.2-.6 1.6-.1 3 1.4 4.6C9.5 15 12 17 12 21Z" />
      <path d="M12 21V12" />
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
            <span>Turning Hope</span>
            <span className={styles.headingSecond}>
              Into{" "}
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
