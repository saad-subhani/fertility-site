"use client";

import { API_URL } from "@/lib/api";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

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
  is_paid: number;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    fetch(`${API}/api/admin/bookings.php`, {
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
        setBookings(data.data);
      })
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className={styles.empty}>Loading bookings...</div>;
  }

  if (error) {
    return <div className={styles.empty}>{error}</div>;
  }

  return (
    <>
      <div className={styles.header}>
        <h1>Consultation Bookings</h1>
        <p>All booked consultants and payment status</p>
      </div>

      {bookings.length === 0 ? (
        <div className={styles.empty}>No bookings yet.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Consultant</th>
                <th>Date</th>
                <th>Time</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>
                    <strong>{b.name}</strong>
                    <br />
                    <small style={{ color: "#7a6a5f" }}>{b.email}</small>
                  </td>
                  <td>{b.consultant}</td>
                  <td>{String(b.date).slice(0, 10)}</td>
                  <td>{b.time}</td>
                  <td>{b.payment_method}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        b.is_paid ? styles.paid : styles.free
                      }`}
                    >
                      {b.is_paid ? "Paid" : "Free"}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/admin/bookings?id=${b.id}`}
                      className={styles.viewBtn}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
