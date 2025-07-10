import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pin Tracker",
  description: "Track your collectible pins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            {children}
            {/* Bottom Banner for Rhine-Ruhr 2025 FISU Games */}
            <div
              className="fixed bottom-0 left-0 w-full z-[2000] flex justify-center pointer-events-none"
              style={{ pointerEvents: 'none' }}
            >
              <a
                href="/rhineruhr2025"
                className="m-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow-lg text-lg transition-transform hover:scale-105 pointer-events-auto"
                style={{ pointerEvents: 'auto' }}
                tabIndex={0}
              >
                🌟 See all Rhine-Ruhr 2025 FISU Games Pins!
              </a>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
