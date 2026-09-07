"use client";

import { useState } from "react";
import styles from "./FAQs.module.css";

const faqs = [
  {
    question: "What fertility treatments do you offer?",
    answer:
      "We provide personalized fertility consultations and a range of treatment options designed around your individual needs and circumstances.",
  },
  {
    question: "How do I book a consultation?",
    answer:
      "You can book a consultation directly through our website using the Book Consultation button, or contact our clinic team for assistance.",
  },
  {
    question: "What should I bring to my first consultation?",
    answer:
      "Please bring any previous medical reports, test results, treatment history, and a list of medications you may currently be taking.",
  },
  {
    question: "How long does a consultation take?",
    answer:
      "A first consultation usually takes around 30 to 45 minutes, depending on your medical history and the discussion required.",
  },
  {
    question: "Is every treatment plan personalized?",
    answer:
      "Yes. Every patient is different. We carefully review your individual circumstances before recommending the most suitable treatment approach.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index
    );
  };

  return (
    <section className={styles.section} id="faqs">

      {/* TOP MARQUEE */}
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          <span>FERTILITY CARE</span>
          <i>✦</i>
          <span>PERSONALIZED TREATMENT</span>
          <i>✦</i>
          <span>EXPERT GUIDANCE</span>
          <i>✦</i>
          <span>YOUR FUTURE MATTERS</span>
          <i>✦</i>

          <span>FERTILITY CARE</span>
          <i>✦</i>
          <span>PERSONALIZED TREATMENT</span>
          <i>✦</i>
          <span>EXPERT GUIDANCE</span>
          <i>✦</i>
          <span>YOUR FUTURE MATTERS</span>
          <i>✦</i>
        </div>
      </div>

      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>

          <div className={styles.labelWrap}>
            <span className={styles.labelDot}></span>
            <span className={styles.label}>FAQs</span>
          </div>

          <h2 className={styles.title}>
            Questions,
            <br />
            <span>answered.</span>
          </h2>

          <p className={styles.description}>
            Find answers to some of the most common questions
            about fertility consultations, treatment and care.
          </p>
        </div>

        {/* FAQ LIST */}
        <div className={styles.faqList}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`${styles.faqItem} ${
                  isOpen ? styles.active : ""
                }`}
                style={
                  {
                    "--delay": `${index * 0.1}s`,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className={styles.question}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className={styles.questionNumber}>
                    0{index + 1}
                  </span>

                  <span className={styles.questionText}>
                    {faq.question}
                  </span>

                  <span
                    className={`${styles.icon} ${
                      isOpen ? styles.iconOpen : ""
                    }`}
                    aria-hidden="true"
                  >
                    <span></span>
                    <span></span>
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`${styles.answerWrapper} ${
                    isOpen ? styles.answerOpen : ""
                  }`}
                >
                  <div className={styles.answerInner}>
                    <p className={styles.answer}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA */}
        <div className={styles.bottom}>

          <div className={styles.bottomText}>
            <span>Can&apos;t find what you&apos;re looking for?</span>
          </div>

          <a
            href="#contact"
            className={styles.contactLink}
          >
            <span>Talk to our team</span>
            <span className={styles.arrow}>↗</span>
          </a>

        </div>
      </div>

      {/* BOTTOM MARQUEE */}
      <div className={`${styles.marquee} ${styles.marqueeBottom}`}>
        <div className={`${styles.marqueeTrack} ${styles.marqueeReverse}`}>
          <span>COMPASSIONATE CARE</span>
          <i>✦</i>
          <span>TRUSTED GUIDANCE</span>
          <i>✦</i>
          <span>MODERN FERTILITY CARE</span>
          <i>✦</i>
          <span>HERE FOR YOUR JOURNEY</span>
          <i>✦</i>

          <span>COMPASSIONATE CARE</span>
          <i>✦</i>
          <span>TRUSTED GUIDANCE</span>
          <i>✦</i>
          <span>MODERN FERTILITY CARE</span>
          <i>✦</i>
          <span>HERE FOR YOUR JOURNEY</span>
          <i>✦</i>
        </div>
      </div>

    </section>
  );
}