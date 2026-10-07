"use client";

import React from "react";

/**
 * Login is no longer required: the platform is accessible directly.
 * Kept as a pass-through so existing page wrappers keep working.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
