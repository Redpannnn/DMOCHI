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
  title: "Dompet Mochi · Tracker Keuangan",
  description: "Dompet Mochi — tracker keuangan pribadi yang imut dan ramah pengguna.",
  keywords: ["Dompet Mochi", "keuangan", "finance tracker", "budget", "Mochi"],
  authors: [{ name: "Redpannnn" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Dompet Mochi",
    description: "Tracker keuangan pribadi yang imut dan ramah pengguna.",
    siteName: "Dompet Mochi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dompet Mochi",
    description: "Tracker keuangan pribadi yang imut dan ramah pengguna.",
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
