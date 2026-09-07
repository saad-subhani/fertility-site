import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Fertility Clinic by AJ | Compassionate Fertility Care",
  description:
    "Professional fertility consultation and personalized care by Fertility Clinic by AJ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
        <WhatsAppButton />
      </body>
    </html>
  );
}
