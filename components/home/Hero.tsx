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
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="url(#statYearsBg)" />
        <circle cx="24" cy="17" r="6.5" stroke="#1a4a6e" strokeWidth="2" />
        <path
          d="M12 35.5c1.6-6 5.4-9 12-9s10.4 3 12 9"
          stroke="#1a4a6e"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="statYearsBg" x1="8" y1="6" x2="40" y2="42">
            <stop stopColor="#E8F2F8" />
            <stop offset="1" stopColor="#D6E8F4" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (type === "families") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="url(#statHeartBg)" />
        <path
          d="M24 36s-10.5-6.8-10.5-14.2A5.9 5.9 0 0 1 24 16.2a5.9 5.9 0 0 1 10.5 5.6C34.5 29.2 24 36 24 36Z"
          fill="#F2A0B4"
          fillOpacity="0.35"
          stroke="#1a4a6e"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="statHeartBg" x1="8" y1="6" x2="40" y2="42">
            <stop stopColor="#FDECF1" />
            <stop offset="1" stopColor="#F8D9E3" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (type === "satisfaction") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="url(#statShieldBg)" />
        <path
          d="M24 12.5 34 15.8v7.2c0 6.4-4 11.2-10 13.3-6-2.1-10-6.9-10-13.3v-7.2L24 12.5Z"
          fill="#9BB8AD"
          fillOpacity="0.28"
          stroke="#1a4a6e"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="m18.8 24.2 3.2 3.2 6.6-6.8"
          stroke="#1a4a6e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="statShieldBg" x1="8" y1="6" x2="40" y2="42">
            <stop stopColor="#EAF5F0" />
            <stop offset="1" stopColor="#D5EBE1" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="url(#statPlantBg)" />
      <path
        d="M24 36V22"
        stroke="#1a4a6e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 26c-4.2 0-7.6-2.2-8.8-5.6-.3-.8.4-1.5 1.2-1.4 4.4.5 7.6 3.2 7.6 7Z"
        fill="#9BB8AD"
        fillOpacity="0.35"
        stroke="#1a4a6e"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M24 24c3.6-.2 6.8-2.1 8.2-5 .4-.8-.3-1.6-1.1-1.4-4 .6-7.1 3-7.1 6.4Z"
        fill="#F2A0B4"
        fillOpacity="0.3"
        stroke="#1a4a6e"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M24 22.5c0-3.2 1.6-5.8 4-7.4.6-.4 1.4.2 1.3 1-0.4 3-2.3 5.5-5.3 6.4Z"
        stroke="#1a4a6e"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="statPlantBg" x1="8" y1="6" x2="40" y2="42">
          <stop stopColor="#EEF7F2" />
          <stop offset="1" stopColor="#DCEFE6" />
        </linearGradient>
      </defs>
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
              <span className={styles.desktopButtonLabel}>Book a consultation</span>
              <span className={styles.mobileButtonLabel}>Book now</span>
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
              <span className={styles.desktopButtonLabel}>Explore treatments</span>
              <span className={styles.mobileButtonLabel}>Explore</span>
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
