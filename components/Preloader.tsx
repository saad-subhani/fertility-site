"use client";

import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const finish = () => setGone(true);
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => window.removeEventListener("load", finish);
  }, []);

  useEffect(() => {
    if (gone) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      className={styles.preloader}
      aria-hidden="true"
    >
      <div className={styles.inner}>
        <div className={styles.ring}>
          <span className={styles.pulse} />
          <div className={styles.logoMark}>
            <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path
                d="M24 40s-11-7.2-11-15.2A6.6 6.6 0 0 1 24 12.6a6.6 6.6 0 0 1 11 12.2C35 32.8 24 40 24 40Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="22" r="3" fill="currentColor" opacity="0.35" />
            </svg>
          </div>
        </div>
        <p className={styles.brand}>Fertility Clinic by AJ</p>
        <div className={styles.bar}>
          <span />
        </div>
      </div>
    </div>
  );
}
