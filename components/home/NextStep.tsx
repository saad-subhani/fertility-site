import Image from "next/image";
import Link from "next/link";
import styles from "./FAQs.module.css";

export default function NextStep() {
  return (
    <section className={styles.nextStepSection} aria-labelledby="next-step-title">
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.bannerText}>
            <span className={styles.bannerEyebrow}>Take the next step</span>
            <h2 id="next-step-title">Ready to start your journey?</h2>
            <p>
              Book a consultation with our fertility specialists and take the
              first step towards your family&apos;s future.
            </p>
            <div className={styles.bannerActions}>
              <Link href="/book-consultation" className={styles.primaryBtn}>
                Book a consultation
                <span aria-hidden="true">→</span>
              </Link>
              <a href="tel:+923454766104" className={styles.secondaryBtn}>
                Call us +92 345 4766104
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className={styles.bannerArt}>
            <Image
              src="/11.jpg"
              alt="Couple reading fertility guide"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className={styles.bannerImage}
            />
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
