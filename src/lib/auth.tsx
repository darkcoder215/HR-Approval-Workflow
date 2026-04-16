"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => ({ ok: false }),
  signup: async () => ({ ok: false }),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Hard ceiling on the profile fetch. If the network stalls here the login
// button would spin forever and the dashboard would never render, so we
// always resolve within this window with a conservative fallback.
const PROFILE_FETCH_TIMEOUT_MS = 5_000;

async function loadProfile(userId: string, fallbackEmail: string): Promise<AuthUser> {
  const fallback: AuthUser = {
    id: userId,
    email: fallbackEmail,
    username: fallbackEmail.split("@")[0] || "user",
    role: "requester",
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROFILE_FETCH_TIMEOUT_MS);

  try {
    const { data } = await supabase
      .from("hr_profiles")
      .select("id, email, display_name, role")
      .eq("id", userId)
      .abortSignal(controller.signal)
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
    return fallback;
  } catch {
    // Abort or transient error: don't block the UI. The user gets the
    // requester fallback and can retry with a refresh once online.
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Failsafe: never leave the app waiting on auth for more than 3s. If the
    // network hangs, we flip to "no session" so the login screen can render.
    const failsafe = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 3000);

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session?.user && mounted) {
          const profile = await loadProfile(session.user.id, session.user.email ?? "");
          if (mounted) setUser(profile);
        }
      } catch (err) {
        console.error("Auth session check failed:", err);
      } finally {
        if (mounted) setLoading(false);
        clearTimeout(failsafe);
      }
    })();

    // IMPORTANT: Do not await supabase calls inside onAuthStateChange.
    // The auth client holds a navigator lock while this callback runs, and
    // a nested query that itself needs the lock will deadlock the entire
    // client — which is exactly what made logins hang forever. Kick the
    // profile fetch to a microtask so the lock releases first.
    // See supabase/auth-js#762.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const uid = session.user.id;
        const uemail = session.user.email ?? "";
        setTimeout(async () => {
          if (!mounted) return;
          try {
            const profile = await loadProfile(uid, uemail);
            if (mounted) setUser(profile);
          } catch (err) {
            console.error("Profile load failed:", err);
          }
        }, 0);
      } else if (event === "SIGNED_OUT") {
        // Only clear state on an explicit sign-out. A transient token-refresh
        // failure or other event without a session shouldn't boot the user
        // out of the dashboard mid-work.
        if (mounted) setUser(null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(failsafe);
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

  const signup = useCallback(
    async (email: string, password: string, displayName: string) => {
      const trimmedEmail = email.trim();
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: { display_name: displayName.trim() },
        },
      });
      if (error) return { ok: false, error: error.message };

      // A DB trigger auto-confirms new users, so signUp usually returns a session
      // directly. If it doesn't (e.g. the dashboard setting still blocks the
      // initial response), log in with the just-created credentials.
      if (data.session?.user) {
        const profile = await loadProfile(data.session.user.id, data.session.user.email ?? "");
        setUser(profile);
        return { ok: true };
      }

      const loginRes = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (loginRes.error) return { ok: false, error: loginRes.error.message };
      if (loginRes.data.user) {
        const profile = await loadProfile(
          loginRes.data.user.id,
          loginRes.data.user.email ?? ""
        );
        setUser(profile);
      }
      return { ok: true };
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  // Always render children. The initial session check is short-lived and
  // consumers that need to wait can read `loading` from context — but we never
  // gate rendering on it so the login screen (for unauthenticated users)
  // appears immediately on app open.
  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
