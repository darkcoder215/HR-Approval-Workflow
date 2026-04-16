"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle, User } from "lucide-react";
import Button from "./Button";
import { useAuth } from "@/lib/auth";

type Mode = "login" | "signup";

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const res = await login(email, password);
      if (!res.ok) {
        setError(res.error || "تعذر تسجيل الدخول");
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } else {
      if (!displayName.trim()) {
        setError("الرجاء إدخال الاسم الكامل");
        setLoading(false);
        return;
      }
      const res = await signup(email, password, displayName);
      if (!res.ok) {
        setError(res.error || "تعذر إنشاء الحساب");
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    }

    setLoading(false);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-thmanyah-black flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-thmanyah-green blur-[120px] animate-float-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-thmanyah-blue blur-[120px] animate-float-slow-reverse" />
      </div>

      <div className={`relative w-full max-w-md mx-4 animate-scale-in ${shake ? "animate-shake" : ""}`}>
        {/* Logo + Branding */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 animate-float-slow">
            <Image src="/thamanyah.png" alt="ثمانية" width={64} height={64} className="rounded-2xl" />
          </div>
          <h1 className="font-display font-black text-white text-[32px] md:text-[40px] leading-tight mb-3">
            منظومة الشواغر الوظيفية
          </h1>
          <p className="font-body font-bold text-white/40 text-[15px]">
            الشركة الاستثنائية لا تُبنى بالتوظيف الكثير، بل بالتوظيف الصح
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-white/[0.04] border border-white/10 rounded-full p-1 mb-5 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 py-2 rounded-full font-ui font-black text-[12px] transition-all cursor-pointer ${
              mode === "login" ? "bg-thmanyah-green text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2 rounded-full font-ui font-black text-[12px] transition-all cursor-pointer ${
              mode === "signup" ? "bg-thmanyah-green text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            حساب جديد
          </button>
        </div>

        {/* Auth card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block font-ui font-bold text-[13px] text-white/60 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => { setDisplayName(e.target.value); setError(null); }}
                    placeholder="مثال: زكية حكمي"
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl pr-11 pl-4 py-3.5 font-ui font-bold text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-thmanyah-green/50 focus:ring-2 focus:ring-thmanyah-green/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-ui font-bold text-[13px] text-white/60 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="email@thmanyah.com"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl pr-11 pl-4 py-3.5 font-ui font-bold text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-thmanyah-green/50 focus:ring-2 focus:ring-thmanyah-green/20 transition-all"
                  autoComplete={mode === "signup" ? "email" : "username"}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block font-ui font-bold text-[13px] text-white/60 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder={mode === "signup" ? "8 أحرف على الأقل" : "أدخل كلمة المرور"}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl pr-11 pl-11 py-3.5 font-ui font-bold text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-thmanyah-green/50 focus:ring-2 focus:ring-thmanyah-green/20 transition-all"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-thmanyah-red/10 border border-thmanyah-red/20 rounded-xl animate-fade-in-up">
                <AlertCircle className="w-4 h-4 text-thmanyah-red shrink-0" />
                <p className="font-ui font-bold text-[13px] text-thmanyah-red">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              loading={loading}
              className="w-full text-[15px] font-black"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              {mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
            </Button>
          </form>
        </div>

        {/* Helper text */}
        <p className="mt-6 text-center font-ui font-bold text-[12px] text-white/40">
          {mode === "login" ? (
            <>ليس لديك حساب؟{" "}
              <button onClick={() => switchMode("signup")} className="text-thmanyah-green hover:underline cursor-pointer">
                أنشئ حسابًا
              </button>
            </>
          ) : (
            <>لديك حساب؟{" "}
              <button onClick={() => switchMode("login")} className="text-thmanyah-green hover:underline cursor-pointer">
                سجّل دخولك
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
