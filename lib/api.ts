// Public URL only. Never import PHP backend configuration into frontend code.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production" ? "/fertility-backend" : "http://localhost:8000")
).replace(/\/$/, "");
