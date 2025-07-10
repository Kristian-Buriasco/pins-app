import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import RhineRuhrBanner from "@/components/RhineRuhrBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pin Tracker",
  description: "Track your collectible pins",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            {children}
            {/* Bottom Banner for Rhine-Ruhr 2025 FISU Games, only if signed in */}
            <RhineRuhrBanner />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
