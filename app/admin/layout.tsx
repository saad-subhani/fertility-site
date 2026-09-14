"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./admin.module.css";

const subscribeToStorage = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};
const getToken = () => localStorage.getItem("adminToken");
const getServerToken = () => null;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const token = useSyncExternalStore(subscribeToStorage, getToken, getServerToken);
  const isLogin = pathname === "/admin/login";
  const ready = isLogin || !!token;

  useEffect(() => {
    if (!isLogin && !localStorage.getItem("adminToken")) {
      router.replace("/admin/login");
    }
  }, [isLogin, router, pathname, token]);

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
