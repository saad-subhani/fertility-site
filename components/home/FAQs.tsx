"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./FAQs.module.css";

const faqs = [
  {
    q: "How do I know which treatment is right for me?",
    a: "After a detailed consultation and fertility assessment, our specialists recommend the most suitable options based on your medical history, test results, and personal goals.",
  },
  {
    q: "What are the success rates for IVF?",
    a: "Success rates vary by age, diagnosis, and individual circumstances. During your consultation we share realistic expectations based on your profile and the latest clinic outcomes.",
  },
  {
    q: "How much does fertility treatment cost?",
    a: "Costs depend on the treatment pathway. We provide a clear estimate after your consultation so you understand fees before starting any cycle.",
  },
  {
    q: "Is fertility treatment safe?",
    a: "Modern fertility treatments are generally very safe when supervised by experienced specialists. We monitor you closely and explain any risks before treatment begins.",
  },
  {
    q: "How long does the process take?",
    a: "Timelines differ by treatment. Many IVF cycles take about 4–6 weeks from preparation to pregnancy test, while other pathways may be shorter or longer.",
  },
];

export default function FAQs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={styles.section} id="faqs">
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.left}>
            <span className={styles.eyebrow}>Frequently Asked Questions</span>
            <h2>Common questions, clear answers</h2>
            <p>
              Find quick answers to the most common questions about fertility
              treatments, costs and next steps.
            </p>
            <Link href="#faqs" className={styles.viewAll} onClick={(e) => e.preventDefault()}>
              View all FAQs
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className={styles.list}>
            {faqs.map((item, index) => {
              const isOpen = open === index;
              return (
                <div
                  key={item.q}
                  className={`${styles.item} ${isOpen ? styles.open : ""}`}
                >
                  <button
                    type="button"
                    className={styles.question}
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <i aria-hidden="true">{isOpen ? "−" : "+"}</i>
                  </button>
                  {isOpen && <p className={styles.answer}>{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.banner}>
          <div className={styles.bannerText}>
            <span className={styles.bannerEyebrow}>Take the next step</span>
            <h3>Ready to start your journey?</h3>
            <p>
              Book a consultation with our fertility specialists and take the
              first step towards your family’s future.
            </p>
            <div className={styles.bannerActions}>
              <Link href="/book-consultation" className={styles.primaryBtn}>
                Book a consultation
                <span aria-hidden="true">→</span>
              </Link>
              <a href="tel:+15662404321" className={styles.secondaryBtn}>
                Call us +1 (566) 240-4321
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className={styles.bannerArt} aria-hidden="true">
            <span className={styles.note}>
              Your future
              <br />
              is worth it
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
