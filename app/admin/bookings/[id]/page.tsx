"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../admin.module.css";

const API = "http://localhost:8000";

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
  is_paid: number;
  created_at: string;
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
      })
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return <div className={styles.empty}>Loading...</div>;
  }

  if (error || !booking) {
    return <div className={styles.empty}>{error || "Not found"}</div>;
  }

  return (
    <>
      <Link href="/admin" className={styles.backLink}>
        ← Back to bookings
      </Link>

      <div className={styles.detailCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#2c1810" }}>
            Booking #{booking.id}
          </h1>
          <span
            className={`${styles.badge} ${
              booking.is_paid ? styles.paid : styles.free
            }`}
          >
            {booking.is_paid ? "Paid" : "Free"}
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
            <strong>
              {new Date(booking.created_at).toLocaleString()}
            </strong>
          </div>
        </div>

        {booking.payment_screenshot && (
          <div className={styles.screenshotBox}>
            <h3>Payment Screenshot</h3>
            <p style={{ margin: "0 0 8px", color: "#7a6a5f", fontSize: "0.85rem" }}>
              File: {booking.payment_screenshot}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${API}/uploads/payments/${booking.payment_screenshot}`}
              alt="Payment screenshot"
            />
          </div>
        )}
      </div>
    </>
  );
}
