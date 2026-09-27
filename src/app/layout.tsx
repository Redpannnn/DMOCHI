import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DMOCHI · Dompet Mochi — Tracker Keuangan",
  description:
    "DMOCHI (Dompet Mochi) — aplikasi tracker keuangan pribadi. Catat pemasukan, pengeluaran, transfer, gaji, tagihan, dan target tabungan.",
  keywords: [
    "DMOCHI",
    "Dompet Mochi",
    "tracker keuangan",
    "keuangan",
    "budget",
    "finance",
    "Dompet",
  ],
  authors: [{ name: "DMOCHI" }],
  applicationName: "DMOCHI",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "DMOCHI · Dompet Mochi",
    description:
      "Tracker keuangan pribadi — pemasukan, pengeluaran, gaji, tagihan, target.",
    siteName: "DMOCHI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "DMOCHI · Dompet Mochi",
    description:
      "Tracker keuangan pribadi — pemasukan, pengeluaran, gaji, tagihan, target.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
