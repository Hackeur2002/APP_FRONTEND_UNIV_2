import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plateforme de délivrance des actes académiques", // Front office / Front end
  description: "Plateforme de demande des actes académiques sécurisés de l'Université de Parakou",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://cdn.tresorpay.bj/checkout.js?v=1.1.7"
          strategy="beforeInteractive"
        />
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
