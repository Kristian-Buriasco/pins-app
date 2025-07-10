"use client";
import { useSession } from "next-auth/react";

export default function RhineRuhrBanner() {
  const { data: session } = useSession();
  if (!session) return null;
  return (
    <div
      className="fixed left-0 w-full z-[2000] flex justify-center pointer-events-none"
      style={{
        pointerEvents: 'none',
        bottom: 0,
      }}
    >
      <a
        href="/rhineruhr2025"
        className="m-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow-lg text-lg transition-transform hover:scale-105 pointer-events-auto rhine-banner"
        style={{ pointerEvents: 'auto' }}
        tabIndex={0}
      >
        🌟 See all Rhine-Ruhr 2025 FISU Games Pins!
      </a>
      <style jsx>{`
        @media (max-width: 600px) {
          .rhine-banner {
            font-size: 1rem;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
