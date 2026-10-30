import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import FloatingListButton from "@/src/components/layout/FloatingListButton";


const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});


const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "ঠিকানা - Trusted Housing & Sublet Marketplace",
  description: "A community-centric rental and sublet marketplace in Bangladesh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body
        className={`${plusJakarta.variable} ${hindSiliguri.variable} font-sans bg-[var(--app-canvas)] text-[var(--color-navy-text)] antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <FloatingListButton />
      </body>
    </html>
  );
}