"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./Consultant.module.css";

export default function Consultant() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) section.classList.add(styles.visible);
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-5px)`;
    };
    const handleMouseLeave = () => {
      card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px)";
    };
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const features = [
    {
      icon: "✦",
      title: "Personalized Care",
      desc: "Every treatment plan is tailored to your unique needs.",
    },
    {
      icon: "✦",
      title: "Expert Guidance",
      desc: "Clear and professional guidance throughout your journey.",
    },
    {
      icon: "✦",
      title: "Trusted Support",
      desc: "Compassionate support from consultation to treatment.",
    },
  ];

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.gridLines} aria-hidden="true" />

      <div className={styles.container}>

        {/* ── Left Content ── */}
        <div className={styles.content}>
          <div className={styles.labelRow}>
            <span className={styles.labelDot} />
            <span className={styles.label}>Meet Your Consultant</span>
          </div>

          <h2 className={styles.title}>
            Compassionate Care,
            <br />
            <span className={styles.titleAccent}>Expert Guidance.</span>
          </h2>

          <div className={styles.dividerLine} />

          <p className={styles.description}>
            Your fertility journey deserves expert care and personal attention.
            Our consultant provides thoughtful guidance, clear answers, and a
            treatment approach designed around your individual needs.
          </p>

          <div className={styles.features}>
            {features.map((f, i) => (
              <div
                className={styles.feature}
                key={f.title}
                style={{ animationDelay: `${0.5 + i * 0.13}s` }}
              >
                <div className={styles.iconWrap}>
                  <span className={styles.iconInner}>{f.icon}</span>
                  <span className={styles.iconRing} />
                </div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="#contact" className={styles.button}>
            <span className={styles.btnText}>Book a Consultation</span>
            <span className={styles.btnArrow}>→</span>
            <span className={styles.btnShimmer} />
          </a>
        </div>

        {/* ── Right Visual ── */}
        <div className={styles.visual}>
          <div className={styles.decorCircle} />
          <div className={styles.decorRing} />
          <div className={styles.floatingDot1} />
          <div className={styles.floatingDot2} />

          {/* Rating badge — top left */}
          <div className={styles.ratingBadge}>
            <span className={styles.ratingStars}>★★★★★</span>
            <span>4.9 Rating</span>
          </div>

          <div className={styles.card} ref={cardRef}>
            <div className={styles.cardGlow} />

            <div className={styles.imageWrapper}>
              <Image
                src="/fertdoct.jpg"
                alt="Dr. Ayesha Javed"
                fill
                sizes="(max-width: 378px) calc(100vw - 28px), 350px"
                className={styles.image}
                priority
              />
              <div className={styles.imageOverlay} />
            </div>

            <div className={styles.cardContent}>
              <span className={styles.specialty}>Fertility Consultant</span>
              <h3 className={styles.cardName}>Dr. Ayesha Javed</h3>
              <p className={styles.cardDesc}>
                Dedicated to helping individuals and couples take confident
                steps toward building their family.
              </p>

              <div className={styles.credentials}>
                <div className={styles.credItem}>
                  <strong>10+</strong>
                  <span>Years Exp.</span>
                </div>
                <div className={styles.credDivider} />
                <div className={styles.credItem}>
                  <strong>1,000+</strong>
                  <span>Patients</span>
                </div>
                <div className={styles.credDivider} />
                <div className={styles.credItem}>
                  <strong>98%</strong>
                  <span>Satisfied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability badge — bottom right */}
          <div className={styles.floatingBadge}>
            <span className={styles.pulseDot} />
            <span>Available for consultation</span>
          </div>
        </div>

      </div>
    </section>
  );
}