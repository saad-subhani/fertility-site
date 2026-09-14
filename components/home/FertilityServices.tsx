"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import styles from "./FertilityServices.module.css";

type IconName =
  | "ivf"
  | "donor"
  | "egg"
  | "iui"
  | "icsi"
  | "genetic"
  | "testing"
  | "support";

type Service = {
  id: string;
  title: string;
  description: string;
  colorClass: string;
  badge?: string;
  icon: IconName;
  details: {
    overview: string;
    points: string[];
    idealFor: string;
    duration: string;
  };
};

const services: Service[] = [
  {
    id: "01",
    title: "IVF Treatment",
    description:
      "Full in-vitro fertilisation with personalised protocol and expert embryology lab support.",
    colorClass: "tileBlue",
    badge: "Most popular",
    icon: "ivf",
    details: {
      overview:
        "In-vitro fertilisation (IVF) is a carefully guided process where eggs are retrieved, fertilised in our advanced lab, and the healthiest embryo is transferred to the uterus. Every protocol is tailored to your medical history, age, and goals.",
      points: [
        "Personalised stimulation protocol based on your hormone profile",
        "Expert embryology lab with continuous embryo monitoring",
        "Single or selective embryo transfer for safer outcomes",
        "Full support from first consultation through pregnancy test",
      ],
      idealFor:
        "Couples with unexplained infertility, blocked tubes, endometriosis, or previous treatment attempts.",
      duration: "Typically 4–6 weeks per cycle, including preparation and follow-up.",
    },
  },
  {
    id: "02",
    title: "Donor Program",
    description:
      "Carefully screened egg and sperm donors, matched to your profile with full confidentiality.",
    colorClass: "tilePink",
    icon: "donor",
    details: {
      overview:
        "Our donor program connects you with rigorously screened egg or sperm donors. Matching considers medical, genetic, and personal preferences while protecting everyone’s privacy at every step.",
      points: [
        "Comprehensive medical and genetic screening of donors",
        "Thoughtful matching to your preferences and clinical needs",
        "Strict confidentiality for donors and recipients",
        "Guidance through legal, emotional, and clinical aspects",
      ],
      idealFor:
        "Individuals or couples who need donor eggs or sperm due to medical reasons or personal choice.",
      duration: "Matching and preparation usually take several weeks, depending on availability.",
    },
  },
  {
    id: "03",
    title: "Egg Freezing",
    description:
      "Preserve your fertility today — start your family when the time feels right for you.",
    colorClass: "tileMint",
    icon: "egg",
    details: {
      overview:
        "Egg freezing (oocyte cryopreservation) lets you preserve healthy eggs now for use in the future. It is a proactive option for career, health, or personal timing — without the pressure of starting a family immediately.",
      points: [
        "Vitrification technology for higher egg survival rates",
        "Clear counselling on expected outcomes by age",
        "Flexible storage plans with full transparency",
        "Seamless transition to IVF when you are ready",
      ],
      idealFor:
        "Women planning to delay pregnancy, undergoing medical treatment, or wanting fertility backup.",
      duration: "Stimulation and retrieval typically take 2–3 weeks; storage is long-term.",
    },
  },
  {
    id: "04",
    title: "IUI Treatment",
    description:
      "A gentle, low-cost first step — sperm placed directly in the uterus at peak fertility.",
    colorClass: "tileYellow",
    icon: "iui",
    details: {
      overview:
        "Intrauterine insemination (IUI) places prepared sperm directly into the uterus around ovulation. It is less invasive than IVF and often recommended as a first-line treatment when clinically appropriate.",
      points: [
        "Minimal medication and a short clinic visit",
        "Sperm preparation to select the healthiest cells",
        "Timed precisely with your natural or induced cycle",
        "Lower cost and lower physical demand than IVF",
      ],
      idealFor:
        "Mild male factor issues, unexplained infertility, or cervical factor problems.",
      duration: "Each cycle is usually completed within one menstrual cycle.",
    },
  },
  {
    id: "05",
    title: "ICSI Treatment",
    description:
      "Single healthy sperm injected directly into the egg — ideal for male factor infertility.",
    colorClass: "tileGreen",
    icon: "icsi",
    details: {
      overview:
        "Intracytoplasmic sperm injection (ICSI) is a specialised IVF technique where a single sperm is injected into each mature egg. It significantly improves fertilisation chances when sperm quality or quantity is limited.",
      points: [
        "Precise selection of the best available sperm",
        "Higher fertilisation rates in male factor cases",
        "Used alongside standard IVF laboratory care",
        "Suitable with fresh or frozen sperm samples",
      ],
      idealFor:
        "Severe male factor infertility, previous fertilisation failure, or use of surgically retrieved sperm.",
      duration: "Same overall timeline as an IVF cycle (about 4–6 weeks).",
    },
  },
  {
    id: "06",
    title: "Genetic Testing",
    description:
      "PGT embryo screening before transfer — selecting the healthiest for the best outcome.",
    colorClass: "tilePurple",
    icon: "genetic",
    details: {
      overview:
        "Preimplantation genetic testing (PGT) screens embryos for chromosomal abnormalities or specific genetic conditions before transfer. This helps select the embryo with the highest chance of a healthy pregnancy.",
      points: [
        "PGT-A for chromosomal normality screening",
        "Option for known inherited conditions where indicated",
        "Reduces risk of miscarriage linked to aneuploidy",
        "Informed decisions with clear genetic counselling",
      ],
      idealFor:
        "Advanced maternal age, recurrent miscarriage, previous failed IVF, or known genetic risk.",
      duration: "Added to an IVF cycle; results typically available within 1–2 weeks after biopsy.",
    },
  },
  {
    id: "07",
    title: "Fertility Testing",
    description:
      "Complete diagnostics for both partners — hormones, semen analysis, and ultrasound scan.",
    colorClass: "tileRose",
    icon: "testing",
    details: {
      overview:
        "A thorough fertility assessment is the foundation of a successful plan. We evaluate both partners with targeted tests so recommendations are based on clear evidence, not guesswork.",
      points: [
        "Hormone panel and ovarian reserve assessment",
        "Pelvic ultrasound and tubal evaluation when needed",
        "Semen analysis with detailed interpretation",
        "Personalised report and next-step consultation",
      ],
      idealFor:
        "Anyone starting their fertility journey, or couples who have been trying for 6–12 months or more.",
      duration: "Most results are available within a few days to two weeks.",
    },
  },
  {
    id: "08",
    title: "Counselling & Support",
    description:
      "Dedicated emotional support and wellness care — because this journey matters beyond medicine.",
    colorClass: "tileSky",
    icon: "support",
    details: {
      overview:
        "Fertility treatment is emotional as well as medical. Our counselling and support services help you manage stress, communicate as a couple, and feel steady through every stage of care.",
      points: [
        "One-to-one and couple counselling sessions",
        "Coping strategies for treatment cycles and waiting periods",
        "Guidance around decisions, loss, and next steps",
        "A safe, non-judgemental space at every stage",
      ],
      idealFor:
        "Anyone undergoing treatment, considering options, or needing emotional support along the way.",
      duration: "Sessions are flexible — single appointments or ongoing support as needed.",
    },
  },
];

function ServiceIcon({ name }: { name: IconName }) {
  const commonProps = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  switch (name) {
    case "ivf":
      return (
        <svg {...commonProps}>
          <path
            d="M8 3v6.5a4 4 0 0 0 8 0V3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 3h4M14 3h4M12 14v6M9 20h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="9"
            r="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );

    case "donor":
      return (
        <svg {...commonProps}>
          <path
            d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 11.5h7M12 8v7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "egg":
      return (
        <svg {...commonProps}>
          <path
            d="M12 21c4.2 0 7-3.2 7-7.6C19 9.2 15.7 3 12 3S5 9.2 5 13.4C5 17.8 7.8 21 12 21Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M9 13.5h6M12 10.5v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "iui":
      return (
        <svg {...commonProps}>
          <path
            d="M4 6h11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15 6l5 3-5 3V6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9 12v5M7 19h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="19.5"
            cy="15.5"
            r="1.2"
            fill="currentColor"
          />
        </svg>
      );

    case "icsi":
      return (
        <svg {...commonProps}>
          <path
            d="M5 18c3.5-1.5 6-4.5 7-8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 10l2.5 2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="15.5"
            cy="15.5"
            r="4"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <circle
            cx="15.5"
            cy="15.5"
            r="1.2"
            fill="currentColor"
          />
        </svg>
      );

    case "genetic":
      return (
        <svg {...commonProps}>
          <path
            d="M7 4c6 3 6 13 0 16M17 4c-6 3-6 13 0 16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M8 7h8M7 12h10M8 17h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "testing":
      return (
        <svg {...commonProps}>
          <rect
            x="6"
            y="3"
            width="12"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M9 7h6M9 11h6M9 15h3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="m14.5 16.5 1 1 2-2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "support":
      return (
        <svg {...commonProps}>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path
            d="M8.5 14c1.8 2 5.2 2 7 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return null;
  }
}

export default function FertilityServices() {
  const [active, setActive] = useState<Service | null>(null);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section className={styles.section}>
      <div className={styles.sectionGlow} />
      <div className={styles.sectionGlowTwo} />

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrow}>Our Services</span>
          </div>
          <h2>How we can help</h2>
          <p>
            We offer a full range of fertility and reproductive healthcare
            services, tailored to your unique needs and goals.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <article
              key={service.id}
              className={`${styles.card} ${styles[service.colorClass]}`}
              style={
                {
                  "--card-delay": `${index * 70}ms`,
                } as React.CSSProperties
              }
            >
              {service.badge && (
                <span className={styles.badge}>
                  <span className={styles.badgeDot} />
                  {service.badge}
                </span>
              )}

              <span className={styles.serviceNumber}>{service.id}</span>

              <div className={styles.iconWrap}>
                <div className={styles.icon}>
                  <ServiceIcon name={service.icon} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <div className={styles.cardLine} />
                <p className={styles.cardDesc}>{service.description}</p>

                <button
                  type="button"
                  className={styles.cardLink}
                  onClick={() => setActive(service)}
                >
                  Learn more
                  <span className={styles.arrow}>→</span>
                </button>
              </div>

              <div className={styles.cardShine} />
            </article>
          ))}
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaHint}>
            Not sure where to start? Our specialists will guide you — no
            pressure, no commitment.
          </p>
          <a href="/book-consultation" className={styles.btnPrimary}>
            <span>Book a free consultation</span>
            <span className={styles.btnArrow}>→</span>
          </a>
        </div>
      </div>

      {active &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.modalOverlay}
            onClick={() => setActive(null)}
            role="presentation"
          >
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setActive(null)}
                aria-label="Close"
              >
                ×
              </button>

              <div className={styles.modalHeader}>
                <div className={styles.modalIcon}>
                  <ServiceIcon name={active.icon} />
                </div>
                <div>
                  <span className={styles.modalEyebrow}>Service detail</span>
                  <h3 id="service-modal-title">{active.title}</h3>
                </div>
              </div>

              <div className={styles.modalBody}>
                <p className={styles.modalOverview}>{active.details.overview}</p>

                <h4 className={styles.modalSub}>What to expect</h4>
                <ul className={styles.modalList}>
                  {active.details.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <div className={styles.modalMeta}>
                  <div>
                    <strong>Ideal for</strong>
                    <p>{active.details.idealFor}</p>
                  </div>
                  <div>
                    <strong>Timeline</strong>
                    <p>{active.details.duration}</p>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.modalSecondary}
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
                <Link href="/book-consultation" className={styles.modalPrimary}>
                  Book a consultation
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
