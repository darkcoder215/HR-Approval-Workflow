"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-thmanyah-black">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/thamanyah.png"
            alt="ثمانية"
            width={32}
            height={32}
            className="brightness-0 invert"
          />
          <span className="font-display font-bold text-white text-[16px] tracking-tight">
            نموذج طلب فتح شاغر وظيفي
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 text-[13px] font-ui font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            الرئيسية
          </Link>
          <Link
            href="/submit"
            className="px-4 py-2 text-[13px] font-ui font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            تقديم طلب
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-[13px] font-ui font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            لوحة المتابعة
          </Link>
        </nav>
      </div>
    </header>
  );
}
