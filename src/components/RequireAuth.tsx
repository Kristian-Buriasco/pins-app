"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/auth/signin";
    }
  }, [status]);

  if (status === "loading") return null;
  if (!session) return null;
  return <>{children}</>;
}
