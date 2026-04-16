"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import LoginScreen from "./LoginScreen";

/**
 * Wraps an authenticated page.
 *
 * While auth is hydrating (reading the persisted session from storage and
 * looking up the profile), we show a neutral splash instead of the login
 * screen. Otherwise a refresh would flash "logged out" for a beat before the
 * session lands, making it look like the user had been signed out.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-thmanyah-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Image
            src="/thamanyah.png"
            alt="ثمانية"
            width={48}
            height={48}
            className="rounded-xl animate-pulse-soft"
          />
          <div className="font-ui text-[13px] text-white/50">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginScreen />;
  return <>{children}</>;
}
