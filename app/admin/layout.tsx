"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [isLogin, router, pathname]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (!ready) {
    return (
      <div className={styles.loading}>
        Loading...
      </div>
    );
  }

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <strong>Admin Panel</strong>
          <span>Fertility Clinic</span>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/admin"
            className={
              pathname === "/admin" ? styles.active : ""
            }
          >
            Bookings
          </Link>
        </nav>

        <button type="button" className={styles.logout} onClick={logout}>
          Logout
        </button>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
