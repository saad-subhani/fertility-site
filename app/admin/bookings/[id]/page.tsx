"use client";

import { API_URL } from "@/lib/api";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../admin.module.css";

const API = API_URL;

type Booking = {
  id: number;
  name: string;
  email: string;
  phone: string;
  consultant: string;
  date: string;
  time: string;
  consultation_type: string;
  payment_method: string;
  payment_screenshot: string | null;
  status: "pending" | "paid" | "paid_at_clinic";
  is_paid: number;
  created_at: string;
  appointment_assigned_at: string | null;
  appointment_mode: string | null;
  meeting_url: string | null;
  clinic_address: string | null;
  consultation_confirmation_sent_at: string | null;
  email_delivery_status: string;
  email_failure_reason: string | null;
  email_deliveries: { kind: string; status: string; sent_at: string | null; failure_reason: string | null }[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  paid_at_clinic: "Pay at Clinic",
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [notice, setNotice] = useState("");
  const [appointment, setAppointment] = useState({ consultant: "", date: "", time: "", consultation_type: "", appointment_mode: "clinic", meeting_url: "", clinic_address: "" });

  const load = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    fetch(`${API}/api/admin/booking-detail.php?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("adminToken");
          router.replace("/admin/login");
          return;
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setBooking(data.data);
        const b = data.data;
        setAppointment({ consultant: b.consultant || "", date: String(b.date || "").slice(0, 10), time: b.time || "", consultation_type: b.consultation_type || "", appointment_mode: b.appointment_mode || (b.consultation_type === "Online Consultation" ? "online" : "clinic"), meeting_url: b.meeting_url || "", clinic_address: b.clinic_address || "" });
      })
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  const updateStatus = async (status: string) => {
    if (!booking) return;
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setUpdating(true);
    try {
      const res = await fetch(`${API}/api/admin/update-status.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: booking.id, status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setNotice([data.message, data.validation_error, data.email?.message].filter(Boolean).join(" "));
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const saveOrResend = async (action: "appointment" | "resend-email") => {
    if (!booking) return;
    setUpdating(true);
    setNotice("");
    try {
      const res = await fetch(`${API}/api/admin/${action}.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}` },
        body: JSON.stringify({ id: booking.id, ...(action === "appointment" ? appointment : {}) }),
      });
      if (res.status === 401) { router.replace("/admin/login"); return; }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Action failed");
      setNotice([data.message, data.email?.message].filter(Boolean).join(" "));
      load();
    } catch (err) { setNotice(err instanceof Error ? err.message : "Action failed"); }
    finally { setUpdating(false); }
  };

  if (loading) {
    return <div className={styles.empty}>Loading...</div>;
  }

  if (error || !booking) {
    return <div className={styles.empty}>{error || "Not found"}</div>;
  }

  const statusClass =
    booking.status === "paid"
      ? styles.paid
      : booking.status === "paid_at_clinic"
      ? styles.clinic
      : styles.pending;

  return (
    <>
      <Link href="/admin" className={styles.backLink}>
        ← Back to bookings
      </Link>

      <div className={styles.detailCard}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#2c1810" }}>
            Booking #{booking.id}
          </h1>
          <span className={`${styles.badge} ${statusClass}`}>
            {STATUS_LABELS[booking.status] || booking.status}
          </span>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span>Patient Name</span>
            <strong>{booking.name}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Email</span>
            <strong>{booking.email}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Phone</span>
            <strong>{booking.phone}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Consultant</span>
            <strong>{booking.consultant}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Date</span>
            <strong>{String(booking.date).slice(0, 10)}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Time</span>
            <strong>{booking.time}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Consultation Type</span>
            <strong>{booking.consultation_type}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Payment Method</span>
            <strong>{booking.payment_method}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Booked At</span>
            <strong>{new Date(booking.created_at).toLocaleString()}</strong>
          </div>
        </div>

        <section className={styles.statusActions} aria-label="Appointment assignment">
          <h2>Confirm appointment details</h2>
          <p>Review the requested details and enter the appointment location. Times use the clinic’s configured time zone.</p>
          <div className={styles.detailGrid}>
            {([['consultant', 'Consultant'], ['date', 'Consultation date'], ['time', 'Time (HH:MM or HH:MM AM/PM)'], ['consultation_type', 'Consultation type']] as const).map(([key, label]) => (
              <label key={key} className={styles.detailItem}>{label}
                <input type={key === 'date' ? 'date' : 'text'} value={appointment[key]} disabled={updating || !!booking.consultation_confirmation_sent_at} onChange={e => setAppointment(prev => ({ ...prev, [key]: e.target.value }))} />
              </label>
            ))}
            <label className={styles.detailItem}>Appointment mode
              <select value={appointment.appointment_mode} disabled={updating || !!booking.consultation_confirmation_sent_at} onChange={e => setAppointment(prev => ({ ...prev, appointment_mode: e.target.value }))}>
                <option value="clinic">At clinic</option><option value="online">Online</option>
              </select>
            </label>
            {appointment.appointment_mode === 'online' ? (
              <label className={styles.detailItem}>HTTPS meeting link<input type="url" value={appointment.meeting_url} disabled={updating || !!booking.consultation_confirmation_sent_at} onChange={e => setAppointment(prev => ({ ...prev, meeting_url: e.target.value }))} /></label>
            ) : (
              <label className={styles.detailItem}>Clinic address<textarea value={appointment.clinic_address} disabled={updating || !!booking.consultation_confirmation_sent_at} onChange={e => setAppointment(prev => ({ ...prev, clinic_address: e.target.value }))} /></label>
            )}
          </div>
          <button type="button" className={`${styles.statusBtn} ${styles.btnPaid}`} disabled={updating || !!booking.consultation_confirmation_sent_at} onClick={() => saveOrResend('appointment')}>Save appointment details</button>
          {booking.consultation_confirmation_sent_at && <p>Confirmation sent. Contact the patient to arrange any changes.</p>}
        </section>

        <section className={styles.statusActions} aria-label="Email delivery">
          <h2>Email delivery</h2>
          <p>Status: {booking.email_delivery_status}</p>
          {booking.email_failure_reason && <p>{booking.email_failure_reason}</p>}
          <ul>{booking.email_deliveries?.map(email => <li key={email.kind}>{email.kind.replaceAll('_', ' ')}: {email.status}{email.sent_at ? ` (${email.sent_at})` : ''}{email.failure_reason ? ` — ${email.failure_reason}` : ''}</li>)}</ul>
          <button type="button" className={styles.statusBtn} disabled={updating || !booking.email_deliveries?.some(email => ['pending', 'failed'].includes(email.status))} onClick={() => saveOrResend('resend-email')}>Resend Email</button>
          <p>Retries only unsent emails. Delivery outcomes requiring review must be checked against the provider’s records first.</p>
          {notice && <p role="status">{notice}</p>}
        </section>

        {/* Status actions */}
        <div className={styles.statusActions}>
          <p className={styles.statusLabel}>Update Status:</p>
          <div className={styles.statusBtns}>
            <button
              type="button"
              disabled={updating || booking.status === "pending"}
              className={`${styles.statusBtn} ${styles.btnPending}`}
              onClick={() => updateStatus("pending")}
            >
              Pending
            </button>
            <button
              type="button"
              disabled={updating || booking.status === "paid"}
              className={`${styles.statusBtn} ${styles.btnPaid}`}
              onClick={() => updateStatus("paid")}
            >
              Mark as Paid
            </button>
            <button
              type="button"
              disabled={updating || booking.status === "paid_at_clinic"}
              className={`${styles.statusBtn} ${styles.btnClinic}`}
              onClick={() => updateStatus("paid_at_clinic")}
            >
              Pay at Clinic
            </button>
          </div>
        </div>

        {/* Payment Screenshot with Lightbox */}
        {booking.payment_screenshot && (
          <div className={styles.screenshotBox}>
            <h3>Payment Screenshot</h3>
            <p
              style={{
                margin: "0 0 12px",
                color: "#7a6a5f",
                fontSize: "0.85rem",
              }}
            >
              Click image to view full size
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${API}/uploads/payments/${booking.payment_screenshot}`}
              alt="Payment screenshot"
              className={styles.screenshotThumb}
              onClick={() => setLightbox(true)}
            />
          </div>
        )}
      </div>

      {/* Fancy Lightbox */}
      {lightbox && booking.payment_screenshot && (
        <div
          className={styles.lightbox}
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${API}/uploads/payments/${booking.payment_screenshot}`}
            alt="Payment screenshot full"
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
