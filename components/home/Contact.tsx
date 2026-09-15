"use client";

import { API_URL } from "@/lib/api";

import { ChangeEvent, useState } from "react";
import styles from "./Contact.module.css";

type FormData = {
  name: string;
  email: string;
  phone: string;
  consultant: string;
  date: string;
  time: string;
  consultationType: string;
  paymentMethod: string;
  paymentScreenshot: File | null;
};

const DEFAULT_CONSULTANT = "Dr. Amjad Islam";

const initialData: FormData = {
  name: "",
  email: "",
  phone: "",
  consultant: DEFAULT_CONSULTANT,
  date: "",
  time: "",
  consultationType: "",
  paymentMethod: "",
  paymentScreenshot: null,
};

const consultationTypes = [
  "Initial Fertility Consultation",
  "Follow-up Consultation",
  "Online Consultation",
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export default function Contact() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] =
    useState<FormData>(initialData);

  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] =
    useState<string | null>(null);

  /* =====================================================
     UPDATE FIELD
  ===================================================== */

  const updateField = (
    field: keyof FormData,
    value: string | File | null
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================================
     NEXT / PREVIOUS
  ===================================================== */

  const nextStep = () => {
    setStep((previous) =>
      Math.min(previous + 1, 4)

  const previousStep = () => {
    setStep((previous) =>
      Math.max(previous - 1, 1)
    );
  };

  /* =====================================================
     SCREENSHOT UPLOAD
  ===================================================== */

  const handleScreenshotChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Payment screenshot must be less than 5MB.");
      return;
    }

    updateField("paymentScreenshot", file);

    const previewUrl = URL.createObjectURL(file);

    setScreenshotPreview(previewUrl);
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formData.paymentScreenshot) {
      setSubmitError("Payment screenshot is required to book.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("consultant", formData.consultant);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("time", formData.time);
      formDataToSend.append("consultationType", formData.consultationType);
      formDataToSend.append("paymentMethod", formData.paymentMethod);

      if (formData.paymentScreenshot) {
        formDataToSend.append(
          "paymentScreenshot",
          formData.paymentScreenshot
        );
      }

      const res = await fetch(`${API_URL}/api/book.php`, {
        method: "POST",
        body: formDataToSend,
      });

      const text = await res.text();
      let data: { success?: boolean; message?: string; data?: { id: number } };

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Server returned an invalid response. Please try again or check if the PHP backend is running."
        );
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Booking failed");
      }

      setBookingId(data.data?.id ?? null);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     SUCCESS STATE
  ===================================================== */

  if (submitted) {
    return (
      <section className={styles.section} id="contact">
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              ✓
            </div>

            <span className={styles.successLabel}>
              Request Received
            </span>

            <h1>
              Your Consultation Request Is Saved!
            </h1>

            <p>
              Thank you for booking with our clinic.
              Your requested details are shown below. Our team will email confirmation after payment verification and appointment assignment.
            </p>

            <div className={styles.confirmation}>
              <div>
                <span>Patient</span>
                <strong>{formData.name}</strong>
              </div>

              <div>
                <span>Consultant</span>
                <strong>
                  {formData.consultant}
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>{formData.date}</strong>
              </div>

              <div>
                <span>Time</span>
                <strong>{formData.time}</strong>
              </div>

              <div>
                <span>Consultation</span>
                <strong>
                  {formData.consultationType}
                </strong>
              </div>

              <div>
                <span>Payment</span>
                <strong>
                  {formData.paymentMethod}
                </strong>
              </div>
            </div>

            <div className={styles.appointmentId}>
              Appointment ID:
              <strong>
                {bookingId}
              </strong>
            </div>

            <button
              type="button"
              className={styles.homeButton}
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setFormData(initialData);
                setScreenshotPreview(null);
              }}
            >
              Book Another Consultation
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
     MAIN SECTION
  ===================================================== */

  return (
    <section className={styles.section} id="contact">
      <div className={styles.container}>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className={styles.header}>
          <span className={styles.label}>Get In Touch</span>

          <h2 className={styles.title}>
            Let&apos;s Start Your
            <br />
            <span>Journey Together.</span>
          </h2>

          <p className={styles.description}>
            Have questions or ready to take the next step?
            Fill out the form below to book your consultation
            directly, or reach out to us using the details
            provided.
          </p>
        </div>

        {/* =====================================================
            PROGRESS
        ===================================================== */}

        <div className={styles.progress}>
          {[1, 2, 3, 4, 5].map((number) => (
            <div
              key={number}
              className={`${styles.progressItem} ${
                step >= number
                  ? styles.active
                  : ""
              }`}
            >
              <div
                className={styles.progressCircle}
              >
                {step > number
                  ? "✓"
                  : number}
              </div>

              <span>
                {number === 1 && "Details"}
                {number === 2 && "Consultant"}
                {number === 3 && "Date & Time"}
                {number === 4 && "Type"}
                {number === 5 && "Payment"}
              </span>
            </div>
          ))}
        </div>


        {/* =====================================================
            CONTACT CONTENT
        ===================================================== */}

        <div className={styles.content}>

          {/* =====================================================
              CONTACT INFORMATION
          ===================================================== */}

          <div className={styles.info}>

            {/* EMAIL */}
            <div className={styles.infoItem}>
              <div className={styles.icon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M4 7L12 13L20 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <span className={styles.infoLabel}>
                  Email
                </span>

                <a
                  href="mailto:fertilityclinic@gmail.com"
                  className={styles.infoValue}
                >
                  fertilityclinic@gmail.com
                </a>
              </div>
            </div>


            {/* PHONE */}
            <div className={styles.infoItem}>
              <div className={styles.icon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6.5 3.5L9.2 3C9.7 2.9 10.2 3.2 10.4 3.7L11.6 7C11.8 7.5 11.6 8 11.2 8.3L9.4 9.7C10.3 11.7 12 13.4 14 14.3L15.7 12.6C16 12.2 16.5 12.1 17 12.3L20.3 13.7C20.8 13.9 21.1 14.4 21 14.9L20.5 17.5C20.4 18.2 19.8 18.7 19.1 18.7C10.9 18.4 5.6 13.1 5.3 4.9C5.3 4.2 5.8 3.6 6.5 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <span className={styles.infoLabel}>
                  Phone
                </span>

                <a
                  href="tel:+923454766104"
                  className={styles.infoValue}
                >
                  +92 345 4766104
                </a>
              </div>
            </div>


            {/* LOCATION */}
            <div className={styles.infoItem}>
              <div className={styles.icon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M20 10.5C20 15.5 12 21 12 21C12 21 4 15.5 4 10.5C4 6.36 7.58 3 12 3C16.42 3 20 6.36 20 10.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="12"
                    cy="10"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>

              <div>
                <span className={styles.infoLabel}>
                  Clinic
                </span>

                <span className={styles.infoValue}>
                  Pakistan
                </span>
              </div>
            </div>


            {/* WORKING HOURS */}
            <div className={styles.infoItem}>
              <div className={styles.icon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M12 7V12L15.5 14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <span className={styles.infoLabel}>
                  Working Hours
                </span>

                <span className={styles.infoValue}>
                  Mon – Sat, 9:00 AM – 7:00 PM
                </span>
              </div>
            </div>

          </div>


          {/* =====================================================
              BOOKING WIZARD CARD
          ===================================================== */}

          <div className={styles.card}>
            <form onSubmit={handleSubmit}>

              {/* =================================================
                  STEP 1
              ================================================= */}

              {step === 1 && (
                <div className={styles.step}>

                  <div className={styles.stepHeader}>
                    <span>01</span>

                    <div>
                      <h2>Patient Details</h2>
                      <p>
                        Tell us a little about yourself.
                      </p>
                    </div>
                  </div>

                  <div className={styles.fields}>

                    <div className={styles.field}>
                      <label htmlFor="name">
                        Full Name
                      </label>

                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(event) =>
                          updateField(
                            "name",
                            event.target.value
                          )
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className={styles.row}>

                      <div className={styles.field}>
                        <label htmlFor="email">
                          Email Address
                        </label>

                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(event) =>
                            updateField(
                              "email",
                              event.target.value
                            )
                          }
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="phone">
                          Phone Number
                        </label>

                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(event) =>
                            updateField(
                              "phone",
                              event.target.value
                            )
                          }
                          placeholder="+92 300 1234567"
                          required
                        />
                      </div>

                    </div>
                  </div>

                  <div className={styles.navigation}>
                    <span />

                    <button
                      type="button"
                      className={styles.nextButton}
                      onClick={nextStep}
                      disabled={
                        !formData.name ||
                        !formData.email ||
                        !formData.phone
                      }
                    >
                      Continue
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  STEP 2
              ================================================= */}

              {step === 2 && (
                <div className={styles.step}>

                  <div className={styles.stepHeader}>
                    <span>02</span>

                    <div>
                      <h2>
                        Select Date & Time
                      </h2>

                      <p>
                        Choose your preferred
                        appointment slot.
                      </p>
                    </div>
                  </div>

                  <div className={styles.fields}>

                    <div className={styles.field}>
                      <label htmlFor="date">
                        Appointment Date
                      </label>

                      <input
                        id="date"
                        type="date"
                        value={formData.date}
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(event) =>
                          updateField(
                            "date",
                            event.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label>
                        Available Time
                      </label>

                      <div
                        className={
                          styles.timeGrid
                        }
                      >
                        {timeSlots.map(
                          (time) => (
                            <button
                              type="button"
                              key={time}
                              className={`${styles.timeSlot} ${
                                formData.time ===
                                time
                                  ? styles.timeSelected
                                  : ""
                              }`}
                              onClick={() =>
                                updateField(
                                  "time",
                                  time
                                )
                              }
                            >
                              {time}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={styles.navigation}
                  >
                    <button
                      type="button"
                      className={
                        styles.backButton
                      }
                      onClick={previousStep}
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      className={
                        styles.nextButton
                      }
                      onClick={nextStep}
                      disabled={
                        !formData.date ||
                        !formData.time
                      }
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  STEP 3
              ================================================= */}

              {step === 3 && (
                <div className={styles.step}>

                  <div className={styles.stepHeader}>
                    <span>03</span>

                    <div>
                      <h2>
                        Consultation Type
                      </h2>

                      <p>
                        Select how you would like
                        to consult.
                      </p>
                    </div>
                  </div>

                  <div
                    className={styles.typeGrid}
                  >
                    {consultationTypes.map(
                      (type) => (
                        <button
                          type="button"
                          key={type}
                          className={`${styles.typeCard} ${
                            formData.consultationType ===
                            type
                              ? styles.selected
                              : ""
                          }`}
                          onClick={() =>
                            updateField(
                              "consultationType",
                              type
                            )
                          }
                        >
                          <div
                            className={
                              styles.typeIcon
                            }
                          >
                            {type.includes(
                              "Online"
                            )
                              ? "⌁"
                              : "＋"}
                          </div>

                          <strong>
                            {type}
                          </strong>

                          <span>
                            Personalized
                            consultation
                          </span>
                        </button>
                      )
                    )}
                  </div>

                  <div
                    className={styles.navigation}
                  >
                    <button
                      type="button"
                      className={
                        styles.backButton
                      }
                      onClick={previousStep}
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      className={
                        styles.nextButton
                      }
                      onClick={nextStep}
                      disabled={
                        !formData.consultationType
                      }
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  STEP 4 - PAYMENT
              ================================================= */}

              {step === 4 && (
                <div className={styles.step}>

                  <div className={styles.stepHeader}>
                    <span>05</span>

                    <div>
                      <h2>
                        Secure Your Appointment
                      </h2>

                      <p>
                        Select your payment method
                        and upload your payment proof.
                      </p>
                    </div>
                  </div>

                  {/* PAYMENT METHOD */}

                  <div
                    className={
                      styles.paymentHeading
                    }
                  >
                    <span>01</span>

                    <div>
                      <h3>
                        Choose Payment Method
                      </h3>

                      <p>
                        Select how you would like
                        to pay.
                      </p>
                    </div>
                  </div>

                  <div
                    className={
                      styles.paymentOptions
                    }
                  >

                    {/* CARD */}

                    <button
                      type="button"
                      className={`${styles.paymentOption} ${
                        formData.paymentMethod ===
                        "Card Payment"
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        updateField(
                          "paymentMethod",
                          "Card Payment"
                        )
                      }
                    >
                      <span
                        className={
                          styles.paymentIcon
                        }
                      >
                        💳
                      </span>

                      <div
                        className={
                          styles.paymentContent
                        }
                      >
                        <strong>
                          Card Payment
                        </strong>

                        <span>
                          Visa / Mastercard
                        </span>
                      </div>

                      <div
                        className={styles.radio}
                      >
                        {formData.paymentMethod ===
                        "Card Payment"
                          ? "✓"
                          : ""}
                      </div>
                    </button>

                    {/* BANK */}

                    <button
                      type="button"
                      className={`${styles.paymentOption} ${
                        formData.paymentMethod ===
                        "Bank Transfer"
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        updateField(
                          "paymentMethod",
                          "Bank Transfer"
                        )
                      }
                    >
                      <span
                        className={
                          styles.paymentIcon
                        }
                      >
                        🏦
                      </span>

                      <div
                        className={
                          styles.paymentContent
                        }
                      >
                        <strong>
                          Bank Transfer
                        </strong>

                        <span>
                          Transfer directly to
                          clinic account
                        </span>
                      </div>

                      <div
                        className={styles.radio}
                      >
                        {formData.paymentMethod ===
                        "Bank Transfer"
                          ? "✓"
                          : ""}
                      </div>
                    </button>

                  </div>

                  {/* BANK DETAILS */}

                  {formData.paymentMethod ===
                    "Bank Transfer" && (
                    <div
                      className={
                        styles.paymentInstructions
                      }
                    >
                      <div
                        className={
                          styles.instructionIcon
                        }
                      >
                        🏦
                      </div>

                      <div>
                        <h3>
                          Bank Transfer Details
                        </h3>

                        <p>
                          Please transfer the
                          consultation fee to the
                          clinic account and upload
                          your payment screenshot
                          below.
                        </p>

                        <div
                          className={
                            styles.bankDetails
                          }
                        >
                          <div>
                            <span>Bank</span>
                            <strong>
                              Example Bank
                            </strong>
                          </div>

                          <div>
                            <span>
                              Account Name
                            </span>

                            <strong>
                              Fertility Clinic
                            </strong>
                          </div>

                          <div>
                            <span>
                              Account Number
                            </span>

                            <strong>
                              0000-0000000
                            </strong>
                          </div>

                          <div>
                            <span>
                              Consultation Fee
                            </span>

                            <strong>
                              PKR 5,000
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREENSHOT UPLOAD */}

                  {formData.paymentMethod && (
                    <div
                      className={
                        styles.uploadSection
                      }
                    >
                      <div
                        className={
                          styles.paymentHeading
                        }
                      >
                        <span>02</span>

                        <div>
                          <h3>
                            Payment Screenshot
                          </h3>

                          <p>
                            Upload proof of your
                            successful payment.
                          </p>
                        </div>
                      </div>

                      <label
                        htmlFor="paymentScreenshot"
                        className={`${styles.uploadBox} ${
                          screenshotPreview
                            ? styles.uploaded
                            : ""
                        }`}
                      >
                        {screenshotPreview ? (
                          <div
                            className={
                              styles.previewWrapper
                            }
                          >
                            <div
                              className={
                                styles.previewImageBox
                              }
                            >
                              <img
                                src={
                                  screenshotPreview
                                }
                                alt="Payment screenshot preview"
                                className={
                                  styles.screenshotPreview
                                }
                              />
                            </div>

                            <div
                              className={
                                styles.previewInfo
                              }
                            >
                              <strong>
                                Payment screenshot
                                selected
                              </strong>

                              <span>
                                {formData
                                  .paymentScreenshot
                                  ?.name ||
                                  "Payment proof"}
                              </span>

                              <small>
                                Click to replace
                                image
                              </small>
                            </div>

                            <div
                              className={
                                styles.uploadCheck
                              }
                            >
                              ✓
                            </div>
                          </div>
                        ) : (
                          <div
                            className={
                              styles.uploadContent
                            }
                          >
                            <div
                              className={
                                styles.uploadIcon
                              }
                            >
                              ↑
                            </div>

                            <strong>
                              Upload Payment
                              Screenshot
                            </strong>

                            <span>
                              Click to browse or
                              drag & drop your
                              screenshot here
                            </span>

                            <small>
                              PNG, JPG or JPEG ·
                              Maximum 5MB
                            </small>
                          </div>
                        )}

                        <input
                          id="paymentScreenshot"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={
                            handleScreenshotChange
                          }
                          hidden
                        />
                      </label>
                    </div>
                  )}

                  {/* SUMMARY */}

                  <div
                    className={styles.summary}
                  >
                    <div
                      className={
                        styles.summaryHeader
                      }
                    >
                      <div>
                        <span>03</span>

                        <div>
                          <h3>
                            Appointment Summary
                          </h3>

                          <p>
                            Please review your
                            details before
                            confirming.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        styles.summaryGrid
                      }
                    >
                      <div>
                        <span>Patient</span>
                        <strong>
                          {formData.name}
                        </strong>
                      </div>

                      <div>
                        <span>Consultant</span>
                        <strong>
                          {formData.consultant}
                        </strong>
                      </div>

                      <div>
                        <span>Date</span>
                        <strong>
                          {formData.date}
                        </strong>
                      </div>

                      <div>
                        <span>Time</span>
                        <strong>
                          {formData.time}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Consultation
                        </span>

                        <strong>
                          {formData.consultationType}
                        </strong>
                      </div>

                      <div>
                        <span>Payment</span>

                        <strong>
                          {formData.paymentMethod}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div
                    className={
                      styles.navigation
                    }
                  >
                    <button
                      type="button"
                      className={
                        styles.backButton
                      }
                      onClick={previousStep}
                    >
                      ← Back
                    </button>

                    {submitError && (
                      <p style={{ color: "#c0392b", width: "100%", marginBottom: 8 }}>
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className={
                        styles.confirmButton
                      }
                      disabled={
                        submitting ||
                        !formData.paymentMethod ||
                        !formData.paymentScreenshot
                      }
                    >
                      {submitting ? "Booking..." : "Confirm Appointment"}
                      <span>✓</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}