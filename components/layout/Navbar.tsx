"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Treatments", href: "#treatments" },
  { label: "Consultant", href: "#consultant" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((current) => !current);
  };

  return (
    <header
      className={`${styles.navbar} ${
        scrolled ? styles.navbarScrolled : ""
      }`}
    >
      <div className={styles.inner}>

        {/* Logo */}
        <Link
          href="#home"
          className={styles.logo}
          onClick={closeMenu}
          aria-label="Fertility Clinic by AJ"
        >
          <Image
            src="/pass.png"
            alt="Fertility Clinic by AJ"
            width={1024}
            height={450}
            priority
            className={styles.logoImage}
          />
        </Link>


        {/* Desktop Navigation */}
        <nav
          className={styles.desktopNav}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={closeMenu}
            >
              <span className={styles.navLabel}>
                {link.label}
              </span>

              <span className={styles.navLine} />
            </Link>
          ))}
        </nav>


        {/* Desktop CTA */}
        <Link
          href="#contact"
          className={styles.cta}
          onClick={closeMenu}
        >
          <span>Book a Consultation</span>

          <span className={styles.ctaArrow}>
            ↗
          </span>
        </Link>


        {/* Mobile Menu Button */}
        <button
          type="button"
          className={`${styles.menuButton} ${
            menuOpen ? styles.menuButtonActive : ""
          }`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
        </button>
      </div>


      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${
          menuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <nav aria-label="Mobile navigation">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={closeMenu}
              style={
                {
                  "--delay": `${index * 70}ms`,
                } as React.CSSProperties
              }
            >
              <span>{link.label}</span>
              <span>↗</span>
            </Link>
          ))}
        </nav>


        {/* Mobile CTA */}
        <Link
          href="#contact"
          className={styles.mobileCta}
          onClick={closeMenu}
        >
          <span>Book a Consultation</span>
          <span>↗</span>
        </Link>
      </div>
    </header>
  );
}