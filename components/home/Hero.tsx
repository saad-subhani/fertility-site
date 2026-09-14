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
    value: "10,000+",
    title: "Families Helped",
    icon: "family",
  },
  {
    value: "15+ Years",
    title: "Of Excellence",
    icon: "award",
  },
  {
    value: "Advanced",
    title: "Fertility Lab",
    icon: "lab",
  },
  {
    value: "High Success",
    title: "Rates",
    icon: "shield",
  },
];

const features = [
  {
    title: "Expert Specialists",
    text: "Highly experienced fertility experts dedicated to you.",
    icon: "specialist",
  },
  {
    title: "Advanced Technology",
    text: "Cutting-edge technology for higher success rates.",
    icon: "technology",
  },
  {
    title: "Personalized Care",
    text: "Tailored treatment plans for your unique journey.",
    icon: "care",
  },
  {
    title: "Complete Confidentiality",
    text: "Your privacy & comfort are our top priority.",
    icon: "lock",
  },
];

function FeatureIcon({ type }: { type: string }) {
  if (type === "specialist") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="16" r="7" />
        <path d="M10 39c1.8-8 6.5-12 14-12s12.2 4 14 12" />
        <path d="M8 20c2-2 4-3 7-3M40 20c-2-2-4-3-7-3" />
      </svg>
    );
  }

  if (type === "technology") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M16 9h10" />
        <path d="M20 9v8l-8 15h24l-8-15V9" />
        <path d="M16 26h16" />
        <path d="M9 37h30" />
        <path d="M29 12l5-5" />
      </svg>
    );
  }

  if (type === "care") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M8 29c7-5 14-4 20 1 4 3 8 3 12 0" />
        <path d="M8 29v8c7-3 14-2 20 2 4 2 8 2 12-1" />
        <path d="M24 13c-5-7-14 1-8 7l8 8 8-8c6-6-3-14-8-7Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="13" y="21" width="22" height="19" rx="4" />
      <path d="M18 21v-5a6 6 0 0 1 12 0v5" />
      <path d="M24 28v5" />
      <circle cx="24" cy="27.5" r="1.5" />
    </svg>
  );
}

function StatIcon({ type }: { type: string }) {
  if (type === "family") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="18" cy="17" r="6" />
        <circle cx="31" cy="18" r="5" />
        <path d="M7 38c1-7 5-11 11-11s10 4 11 11" />
        <path d="M27 29c6 0 10 3 11 9" />
      </svg>
    );
  }

  if (type === "award") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M16 7h16v12c0 6-3 10-8 10s-8-4-8-10V7Z" />
        <path d="m18 29-3 12 9-5 9 5-3-12" />
        <path d="M20 13h8M24 10v6" />
      </svg>
    );
  }

  if (type === "lab") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M18 7h12" />
        <path d="M21 7v11L12 37h24l-9-19V7" />
        <path d="M16 29h16" />
        <circle cx="25" cy="24" r="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 6 38 11v10c0 9-5 16-14 21C15 37 10 30 10 21V11l14-5Z" />
      <path d="m17 24 5 5 10-11" />
    </svg>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

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

    const pause =
      !isDeleting && typedText === phrase
        ? 1700
        : 0;

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === phrase) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && typedText === "") {
        setIsDeleting(false);

        setPhraseIndex(
          (current) =>
            (current + 1) % typingPhrases.length
        );

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

  return (
   <section
  ref={heroRef}
  className={styles.hero}
  id="hero"
>
      {/* =================================================
          BACKGROUND IMAGE
      ================================================= */}

      <Image
        src="/public/bg1.png"
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

      {/* =================================================
          DECORATIVE ORBITS
      ================================================= */}

      <div className={styles.orbitLarge} />
      <div className={styles.orbitSmall} />

      {/* =================================================
          HERO CONTENT
      ================================================= */}

      <div className={`container ${styles.container}`}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.heartIcon}>
              ♡
            </span>

            <span>
              Compassionate care. Advanced science. Better tomorrows.
            </span>
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

          {/* =================================================
              ONLY ONE HERO BUTTON
          ================================================= */}

          <div className={styles.heroAction}>
            <Link
              href="/book-consultation"
              className={styles.mainBooking}
            >
              <span>Book Your Consultation</span>

              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
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

          {/* =================================================
              STATS
          ================================================= */}

          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <div
                className={styles.stat}
                key={stat.title}
                style={
                  {
                    "--delay": `${index * 0.12}s`,
                  } as React.CSSProperties
                }
              >
                <div className={styles.statIcon}>
                  <StatIcon type={stat.icon} />
                </div>

                <div className={styles.statText}>
                  <strong>{stat.value}</strong>
                  <span>{stat.title}</span>
                </div>

                {index !== stats.length - 1 && (
                  <span className={styles.statDivider} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            QUOTE CARD
        ================================================= */}


        {/* =================================================
            FEATURE STRIP
        ================================================= */}

        <div className={styles.featureStrip}>
          {features.map((feature, index) => (
            <div
              className={styles.feature}
              key={feature.title}
              style={
                {
                  "--delay": `${0.35 + index * 0.12}s`,
                } as React.CSSProperties
              }
            >
              <div className={styles.featureIcon}>
                <FeatureIcon type={feature.icon} />
              </div>

              <div className={styles.featureContent}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>

              {index !== features.length - 1 && (
                <span className={styles.featureDivider} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          CURSOR DETAIL
      ================================================= */}

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