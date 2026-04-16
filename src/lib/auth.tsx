"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import { supabase } from "./supabase";

export interface AuthUser {
  id: string;
  email: string;
  username: string; // display_name (kept "username" for backwards compatibility with consumers)
  role: "requester" | "approver" | "culture_admin" | "department_head";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => ({ ok: false }),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

async function loadProfile(userId: string, fallbackEmail: string): Promise<AuthUser> {
  const { data } = await supabase
    .from("hr_profiles")
    .select("id, email, display_name, role")
    .eq("id", userId)
    .maybeSingle();
  if (data) {
    return {
      id: data.id,
      email: data.email || fallbackEmail,
      username: data.display_name || (data.email || fallbackEmail).split("@")[0],
      role: (data.role as AuthUser["role"]) || "requester",
    };
  }
  // Profile row may not exist yet (trigger lag, RLS race). Return a fallback.
  return {
    id: userId,
    email: fallbackEmail,
    username: fallbackEmail.split("@")[0],
    role: "requester",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.user && mounted) {
        const profile = await loadProfile(session.user.id, session.user.email ?? "");
        if (mounted) setUser(profile);
      }
      if (mounted) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await loadProfile(session.user.id, session.user.email ?? "");
        if (mounted) setUser(profile);
      } else {
        if (mounted) setUser(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { ok: false, error: error.message };
    if (data.user) {
      const profile = await loadProfile(data.user.id, data.user.email ?? "");
      setUser(profile);
    }
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-thmanyah-black flex items-center justify-center">
        <div className="animate-pulse-soft">
          <Image
            src="/thamanyah.png"
            alt="ثمانية"
            width={48}
            height={48}
            className="rounded-xl mx-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
