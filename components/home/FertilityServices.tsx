"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./FertilityServices.module.css";

const services = [
  {
    id: "01",
    phase: "SERVICE 01",
    image: "/ser1.jpg",
    title: "Fertility Assessment & Testing",
    description:
      "Understand your fertility with comprehensive testing and personalized guidance to help you make informed decisions about your future.",
    bullets: [
      "Comprehensive Hormone Testing",
      "Detailed Ultrasound Scans",
      "Expert Consultations",
    ],
    href: "/services/fertility-assessment",
  },
  {
    id: "02",
    phase: "SERVICE 02",
    image: "/ser22.jpg",
    title: "IVF & Fertility Treatment",
    description:
      "Explore personalized fertility treatment options designed around your individual needs, goals, and journey to parenthood.",
    bullets: [
      "Customized Treatment Plans",
      "State-of-the-art Embryology",
      "Continuous Emotional Support",
    ],
    href: "/services/ivf",
  },
  {
    id: "03",
    phase: "SERVICE 03",
    image: "/ser33.jpg",
    title: "Fertility Preservation",
    description:
      "Preserve your reproductive options for the future with advanced egg, embryo, and fertility preservation treatments.",
    bullets: [
      "Advanced Egg Freezing",
      "Sperm Banking Solutions",
      "Embryo Cryopreservation",
    ],
    href: "/services/fertility-preservation",
  },
];

export default function FertilityServices() {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.sectionGlow} />

      <div className={styles.container}>
        {/* Section Header (Reverted to Original) */}
        <div className={styles.header}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrow}>OUR SERVICES</span>
            <span className={styles.eyebrowDot} />
          </div>

          <h2>
            Personalized care for
            <br />
            <span>your fertility journey.</span>
          </h2>

          <p>
            From your first fertility assessment to advanced treatment,
            our team is here to support you every step of the way.
          </p>
        </div>

        {/* Stacked Cards (Video Style - Compact Height) */}
        <div className={styles.stack}>
          {services.map((service, index) => (
            <div className={styles.stackItem} key={service.id}>
              <div className={styles.card}>
                
                {/* Card Top Bar */}
                <div className={styles.cardTopBar}>
                  <div className={styles.phaseInfo}>
                    <span className={styles.phaseId}>{service.id}</span>
                    <span className={styles.phaseText}>{service.phase}</span>
                  </div>
                  <h3 className={styles.topBarTitle}>{service.title}</h3>
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  {/* Left Side: Image */}
                  <div className={styles.imageCol}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                      <div className={styles.imageOverlay} />
                    </div>
                  </div>

                  {/* Right Side: Content */}
                  <div className={styles.contentCol}>
                    <Link href={service.href} className={styles.plusBtn}>
                      +
                    </Link>

                    <div className={styles.contentInner}>
                      <span className={styles.smallPhase}>{service.phase}</span>
                      <h3 className={styles.mainTitle}>{service.title}</h3>
                      <p className={styles.description}>
                        {service.description}
                      </p>

                      <ul className={styles.bulletList}>
                        {service.bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}