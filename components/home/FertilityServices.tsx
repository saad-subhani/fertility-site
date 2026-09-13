"use client";

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

const services = [
  {
    id: "01",
    title: "IVF Treatment",
    description:
      "Full in-vitro fertilisation with personalised protocol and expert embryology lab support.",
    colorClass: "tileBlue",
    badge: "Most popular",
    icon: "ivf" as IconName,
  },
  {
    id: "02",
    title: "Donor Program",
    description:
      "Carefully screened egg and sperm donors, matched to your profile with full confidentiality.",
    colorClass: "tilePink",
    icon: "donor" as IconName,
  },
  {
    id: "03",
    title: "Egg Freezing",
    description:
      "Preserve your fertility today — start your family when the time feels right for you.",
    colorClass: "tileMint",
    icon: "egg" as IconName,
  },
  {
    id: "04",
    title: "IUI Treatment",
    description:
      "A gentle, low-cost first step — sperm placed directly in the uterus at peak fertility.",
    colorClass: "tileYellow",
    icon: "iui" as IconName,
  },
  {
    id: "05",
    title: "ICSI Treatment",
    description:
      "Single healthy sperm injected directly into the egg — ideal for male factor infertility.",
    colorClass: "tileGreen",
    icon: "icsi" as IconName,
  },
  {
    id: "06",
    title: "Genetic Testing",
    description:
      "PGT embryo screening before transfer — selecting the healthiest for the best outcome.",
    colorClass: "tilePurple",
    icon: "genetic" as IconName,
  },
  {
    id: "07",
    title: "Fertility Testing",
    description:
      "Complete diagnostics for both partners — hormones, semen analysis, and ultrasound scan.",
    colorClass: "tileRose",
    icon: "testing" as IconName,
  },
  {
    id: "08",
    title: "Counselling & Support",
    description:
      "Dedicated emotional support and wellness care — because this journey matters beyond medicine.",
    colorClass: "tileSky",
    icon: "support" as IconName,
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
  return (
    <section className={styles.section}>
      <div className={styles.sectionGlow} />
      <div className={styles.sectionGlowTwo} />

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrow}>Our Services</span>
            <span className={styles.eyebrowDot} />
          </div>

          <h2>
            Every path to parenthood,
            <br />
            <span>supported by us</span>
          </h2>

          <p>
            From your very first consultation to the moment you hold your
            baby — we are with you every step of the way.
          </p>
        </div>

        {/* SERVICES GRID */}
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

              <span className={styles.serviceNumber}>
                {service.id}
              </span>

              <div className={styles.iconWrap}>
                <div className={styles.icon}>
                  <ServiceIcon name={service.icon} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>
                  {service.title}
                </h3>

                <div className={styles.cardLine} />

                <p className={styles.cardDesc}>
                  {service.description}
                </p>

                <span className={styles.cardLink}>
                  Learn more
                  <span className={styles.arrow}>→</span>
                </span>
              </div>

              <div className={styles.cardShine} />
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <p className={styles.ctaHint}>
            Not sure where to start? Our specialists will guide you — no
            pressure, no commitment.
          </p>

          <a
            href="/book-consultation"
            className={styles.btnPrimary}
          >
            <span>Book a free consultation</span>
            <span className={styles.btnArrow}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}