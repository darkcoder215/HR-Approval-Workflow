"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  BarChart3,
  Clock,
  Send,
  CheckCircle2,
  Eye,
  FileText,
  Sparkles,
  Building2,
  Target,
  ChevronDown,
  LogOut,
  FlaskConical,
  Trash2,
  Database,
  Search,
} from "lucide-react";
import Button from "@/components/ui/Button";
import LoginScreen from "@/components/ui/LoginScreen";
import { AuthProvider, useAuth } from "@/lib/auth";
import { APPROVAL_CHAIN_TEMPLATE, SLA_TOTAL } from "@/lib/constants";
import { getAllRequests } from "@/lib/store";
import { seedDemoData, hasDemoData, clearAllData } from "@/lib/seedData";

function HomeContent() {
  const { isAuthenticated, logout, user } = useAuth();
  const isAdmin = user?.role === "culture_admin";
  const [hasRequests, setHasRequests] = useState(false);
  const [, setSeeded] = useState(false);
  const [seedCount, setSeedCount] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Only admins need the org-wide count (for the seed panel) or the
        // "has any data" signal. Requesters see a simpler hero without it.
        if (!isAdmin) {
          if (!cancelled) {
            setHasRequests(false);
            setSeedCount(0);
            setSeeded(false);
          }
          return;
        }
        const [all, seededFlag] = await Promise.all([getAllRequests(), hasDemoData()]);
        if (cancelled) return;
        setHasRequests(all.length > 0);
        setSeedCount(all.length);
        setSeeded(seededFlag);
      } catch (err) {
        console.error("Failed to load home data", err);
      }
    })();
    return () => { cancelled = true; };
  }, [isAdmin]);

  const handleSeed = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const data = await seedDemoData();
      setSeeded(true);
      setHasRequests(true);
      setSeedCount(data.length);
    } catch (err) {
      console.error("Failed to seed demo data", err);
    } finally {
      setBusy(false);
    }
  };

  const handleClear = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await clearAllData();
      setSeeded(false);
      setHasRequests(false);
      setSeedCount(0);
    } catch (err) {
      console.error("Failed to clear data", err);
    } finally {
      setBusy(false);
    }
  };

  if (!isAuthenticated) return <LoginScreen />;

  return (
    <div className="min-h-screen page-bg-home">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-thmanyah-black border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image src="/thamanyah.png" alt="ثمانية" width={28} height={28} className="rounded-lg" />
            <span className="font-display font-black text-white text-[14px] md:text-[15px] hidden sm:block">ثمانية</span>
          </Link>
          <nav className="flex items-center gap-1 md:gap-2">
            <Link href="/dashboard" className="px-3 md:px-4 py-2 text-[12px] md:text-[13px] font-ui font-bold text-white/85 hover:text-white rounded-full transition-all">
              {isAdmin ? "لوحة المتابعة" : "طلباتي"}
            </Link>
            <Link href="/submit">
              <Button variant="accent" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                <span className="hidden sm:inline">تقديم طلب</span>
                <span className="sm:hidden">طلب</span>
              </Button>
            </Link>
            <button
              onClick={() => { void logout(); }}
              className="px-2 py-2 text-white/60 hover:text-thmanyah-red rounded-full transition-all cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-thmanyah-black text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-thmanyah-green blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-thmanyah-blue blur-3xl animate-float-slow-reverse" />
        </div>

        {/* Flying notification bubbles */}
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          {/* Approved */}
          <span className="flying-bubble fly-right bg-thmanyah-green/25 text-thmanyah-green border border-thmanyah-green/50" style={{ top: "18%", right: "8%", "--duration": "11s", "--delay": "0.5s" } as React.CSSProperties}>
            مُعتمد: المبررات واضحة، واضح فكرت بإحسان 👌
          </span>
          <span className="flying-bubble fly-left bg-thmanyah-green/25 text-thmanyah-green border border-thmanyah-green/50" style={{ top: "72%", left: "5%", "--duration": "13s", "--delay": "4s" } as React.CSSProperties}>
            مُعتمد: فريق استقطاب المواهب بطريقه لدعمك 🚀
          </span>
          <span className="flying-bubble fly-up bg-thmanyah-green/25 text-thmanyah-green border border-thmanyah-green/50" style={{ top: "40%", right: "4%", "--duration": "14s", "--delay": "5.5s" } as React.CSSProperties}>
            مُعتمد: دورك كقائد تستثمر في أفضل الكفاءات بعوائد مُستدامة 🔥
          </span>

          {/* Rejected */}
          <span className="flying-bubble fly-left bg-thmanyah-red/25 text-thmanyah-red border border-thmanyah-red/50" style={{ top: "28%", left: "3%", "--duration": "10s", "--delay": "2s" } as React.CSSProperties}>
            مرفوض: الدور ممكن تنفيذه باستخدام أدوات الذكاء الاصطناعي 🤖
          </span>
          <span className="flying-bubble fly-right bg-thmanyah-red/25 text-thmanyah-red border border-thmanyah-red/50" style={{ top: "82%", right: "12%", "--duration": "12s", "--delay": "7s" } as React.CSSProperties}>
            مرفوض: مبررات فتح الشاغر غير مُقنعة، راجع تقرير الرفض 😱
          </span>
          <span className="flying-bubble fly-left bg-thmanyah-red/25 text-thmanyah-red border border-thmanyah-red/50" style={{ top: "55%", left: "15%", "--duration": "9s", "--delay": "1s" } as React.CSSProperties}>
            مرفوض: يؤسفنا رفض طلبك، لعدم توفر ميزانية وبسبب السيولة 💰
          </span>

          {/* Review / pending */}
          <span className="flying-bubble fly-left bg-thmanyah-blue/25 text-thmanyah-sky border border-thmanyah-blue/50" style={{ top: "15%", left: "12%", "--duration": "12s", "--delay": "3s" } as React.CSSProperties}>
            قيد المراجعة: وصلنا طلبك، وحاليًا تحت المراجعة 👀
          </span>
          <span className="flying-bubble fly-up bg-thmanyah-blue/25 text-thmanyah-sky border border-thmanyah-blue/50" style={{ top: "65%", right: "20%", "--duration": "10s", "--delay": "8s" } as React.CSSProperties}>
            في مرحلة الاعتمادات: بانتظار الموافقات النهائية 🫵🏻
          </span>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-10 md:pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-thmanyah-green/20 border border-thmanyah-green/60 rounded-full mb-6 md:mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-thmanyah-green" />
            <span className="font-ui text-[12px] md:text-[13px] text-thmanyah-green font-bold">
              منظومة اعتماد الشواغر الوظيفية
            </span>
          </div>

          <h1 className="font-display font-black text-[32px] md:text-[52px] lg:text-[64px] leading-[1.1] mb-5 md:mb-6 animate-fade-in-up">
            التوظيف الصح
            <br />
            <span className="inline-block bg-thmanyah-green/60 text-white px-3 md:px-4 py-1 md:py-1.5 rounded-xl">
              يبدأ من هنا
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in-up mt-8 md:mt-10" style={{ animationDelay: "0.2s" }}>
            <Link href="/submit">
              <Button variant="accent" size="lg" icon={<Send className="w-4 h-4" />} className="text-[14px] md:text-[15px] w-full sm:w-auto font-black">
                تقديم طلب فتح شاغر
              </Button>
            </Link>
            {(isAdmin ? hasRequests : true) && (
              <Link href="/dashboard">
                <Button variant="secondary" size="lg" icon={<BarChart3 className="w-4 h-4" />} className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20 text-[14px] md:text-[15px] w-full sm:w-auto font-black">
                  {isAdmin ? "لوحة المتابعة" : "طلباتي"}
                </Button>
              </Link>
            )}
          </div>

          {/* Demo Data Panel — admin-only */}
          {isAdmin && (
            <div className="mt-10 md:mt-14 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
              <div className="inline-block bg-white/[0.08] border border-white/25 rounded-2xl p-5 md:p-6 backdrop-blur-sm max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical className="w-4 h-4 text-thmanyah-amber" />
                  <span className="font-ui font-black text-[13px] text-white">بيانات تجريبية</span>
                </div>
                <p className="font-ui text-[12px] text-white/70 mb-4 leading-relaxed">
                  أنشئ طلبات تجريبية بمراحل مختلفة (معتمدة، مرفوضة، قيد المعالجة) لاستعراض جميع واجهات المنصة.
                </p>
                {seedCount > 0 && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-thmanyah-green/20 border border-thmanyah-green/50 rounded-xl">
                    <Database className="w-3.5 h-3.5 text-thmanyah-green" />
                    <span className="font-ui font-bold text-[12px] text-thmanyah-green">{seedCount} طلب في النظام</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => { void handleSeed(); }}
                    disabled={busy}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-thmanyah-amber hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-thmanyah-black rounded-full font-ui font-black text-[12px] transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    {busy ? "جاري..." : seedCount > 0 ? "إعادة التعبئة" : "تعبئة البيانات"}
                  </button>
                  {seedCount > 0 && (
                    <button
                      onClick={() => { void handleClear(); }}
                      disabled={busy}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-thmanyah-red/30 disabled:opacity-50 disabled:cursor-not-allowed text-white/90 hover:text-thmanyah-red rounded-full font-ui font-bold text-[12px] transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      مسح
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 md:mt-8 animate-bounce">
            <ChevronDown className="w-5 h-5 text-white/50 mx-auto" />
          </div>
        </div>
      </section>

      {/* Hiring Pipeline */}
      <section className="py-10 md:py-14 bg-thmanyah-black text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-thmanyah-amber/25 border border-thmanyah-amber/60 rounded-full font-ui text-[12px] text-thmanyah-amber font-bold mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              آليّة العمل
            </span>
            <h2 className="font-display font-black text-[26px] md:text-[44px] leading-tight mb-4 max-w-3xl mx-auto">
              يدًا بيد لقرارات تليق{" "}
              <br className="hidden md:block" />
              <span className="inline-block bg-thmanyah-green/60 text-white px-3 md:px-4 py-1 md:py-1.5 rounded-xl mt-2">
                بثمانية وبناسها
              </span>
            </h2>
            <p className="font-body font-bold text-[14px] md:text-[16px] text-white/75 max-w-2xl mx-auto">
              ٣ مراحل من رفع الطلب إلى قرار التوظيف.
            </p>
          </div>

          {/* Desktop timeline */}
          <div className="hidden md:block relative">
            {/* Dashed connector line (animates right → left) */}
            <svg className="absolute top-[52px] right-0 left-0 w-full h-4 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 4">
              <line x1="80" y1="2" x2="920" y2="2" stroke="#FFBC0A" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" className="pipeline-line" opacity="0.6" />
            </svg>

            <div className="relative grid grid-cols-3 gap-8">
              <PipelineStage
                index={0}
                tone="amber"
                icon={<FileText className="w-7 h-7" />}
                title="رفع طلب شاغر"
                description="دورك كقائد، ترفع احتياج القوى العاملة في فريقك، وسيُقيم الطلب مبدئيًا بواسطة الذكاء الاصطناعي."
              />
              <PipelineStage
                index={1}
                tone="sky"
                icon={<Search className="w-7 h-7" />}
                title="تحليل الدور"
                description="بعد التحليل المبدئي، يراجع فريق المواهب طلبك ويرد عليك وفق الخط الزمني المُتفق عليه بالأداة."
              />
              <PipelineStage
                index={2}
                tone="green"
                icon={<CheckCircle2 className="w-7 h-7" />}
                title="اتّخاذ القرار"
                description="عند قبول طلبك، يُعين مسؤول الاستقطاب للعمل معك، وفي حال الرفض، نشاركك تقرير واضح."
              />
            </div>
          </div>

          {/* Mobile timeline — vertical */}
          <div className="md:hidden relative space-y-8">
            <div className="absolute top-8 bottom-8 right-7 w-px bg-gradient-to-b from-white/30 via-white/15 to-white/5" />
            {[
              {
                icon: <FileText className="w-5 h-5" />,
                title: "رفع طلب شاغر",
                description: "دورك كقائد، ترفع احتياج القوى العاملة في فريقك، وسيُقيم الطلب مبدئيًا بواسطة الذكاء الاصطناعي.",
                node: "bg-thmanyah-amber text-thmanyah-black",
                title_text: "text-thmanyah-amber",
              },
              {
                icon: <Search className="w-5 h-5" />,
                title: "تحليل الدور",
                description: "بعد التحليل المبدئي، يراجع فريق المواهب طلبك ويرد عليك وفق الخط الزمني المُتفق عليه بالأداة.",
                node: "bg-thmanyah-sky text-thmanyah-dark-slate",
                title_text: "text-thmanyah-sky",
              },
              {
                icon: <CheckCircle2 className="w-5 h-5" />,
                title: "اتّخاذ القرار",
                description: "عند قبول طلبك، يُعين مسؤول الاستقطاب للعمل معك، وفي حال الرفض، نشاركك تقرير واضح.",
                node: "bg-thmanyah-green text-white",
                title_text: "text-thmanyah-green",
              },
            ].map((s, i) => (
              <div key={i} className="relative flex items-start gap-4 pipeline-node-enter" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_rgba(255,255,255,0.06)] ${s.node}`}>
                  {s.icon}
                </div>
                <div className="flex-1 pt-1.5">
                  <h3 className={`font-display font-black text-[17px] mb-1.5 ${s.title_text}`}>{s.title}</h3>
                  <p className="font-ui text-[12px] text-white/85 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom key message */}
          <div className="mt-10 md:mt-14 text-center max-w-2xl mx-auto">
            <div className="inline-block bg-thmanyah-amber/20 border-2 border-thmanyah-amber/70 rounded-2xl px-6 md:px-8 py-4 md:py-5">
              <p className="font-display font-black text-[15px] md:text-[17px] text-thmanyah-amber leading-relaxed">
                جودة قراراتك = كفاءة فريقك. كيف سترفع من جودة قراراتك في اختيار أفضل المواهب؟
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approval chain */}
      <section className="py-10 md:py-14 bg-thmanyah-off-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-thmanyah-black rounded-full font-ui text-[12px] text-thmanyah-amber font-bold mb-4">
              <Building2 className="w-3.5 h-3.5" />
              كيف نعتمد؟
            </span>
            <h2 className="font-display font-black text-[26px] md:text-[40px] mb-3 text-thmanyah-black">
              <span className="inline-block bg-thmanyah-green text-white px-3 md:px-4 py-1 md:py-1.5 rounded-xl">
                6 مراحل
              </span>
              {" — "}
              {SLA_TOTAL}
            </h2>
            <p className="font-body font-bold text-[14px] md:text-[16px] text-thmanyah-charcoal">
              كل مرحلة لها مسؤول محدد ومهلة زمنية واضحة
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto stagger-children">
            {APPROVAL_CHAIN_TEMPLATE.map((step, i) => {
              // Rotate accent hues so each step's index badge & SLA chip feel
              // distinct — per DESIGN_GUIDE_New's "more variation in color"
              // direction. Colors stay within the Thmanyah extended palette.
              const palettes = [
                {
                  badgeBg: "bg-thmanyah-green",
                  badgeText: "text-white",
                  slaBg: "bg-thmanyah-green-light/70",
                  slaText: "text-emerald-800",
                  accent: "text-thmanyah-green",
                },
                {
                  badgeBg: "bg-thmanyah-blue",
                  badgeText: "text-white",
                  slaBg: "bg-thmanyah-sky-light/80",
                  slaText: "text-thmanyah-blue",
                  accent: "text-thmanyah-blue",
                },
                {
                  badgeBg: "bg-thmanyah-amber",
                  badgeText: "text-thmanyah-black",
                  slaBg: "bg-thmanyah-pale-yellow/80",
                  slaText: "text-amber-800",
                  accent: "text-amber-700",
                },
                {
                  badgeBg: "bg-thmanyah-hot-pink",
                  badgeText: "text-white",
                  slaBg: "bg-thmanyah-rose/80",
                  slaText: "text-thmanyah-burgundy",
                  accent: "text-thmanyah-burgundy",
                },
                {
                  badgeBg: "bg-thmanyah-peach",
                  badgeText: "text-white",
                  slaBg: "bg-thmanyah-salmon/60",
                  slaText: "text-thmanyah-red",
                  accent: "text-thmanyah-red",
                },
                {
                  badgeBg: "bg-thmanyah-charcoal",
                  badgeText: "text-thmanyah-amber",
                  slaBg: "bg-thmanyah-lavender/60",
                  slaText: "text-thmanyah-charcoal",
                  accent: "text-thmanyah-charcoal",
                },
              ];
              const c = palettes[i % palettes.length];
              return (
                <div key={i} className="flex items-center gap-3 md:gap-4 bg-white rounded-2xl p-4 md:p-5 border border-thmanyah-warm-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover-lift">
                  <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${c.badgeBg} ${c.badgeText} flex items-center justify-center font-display font-black text-[14px] md:text-[16px] shrink-0`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-ui font-black text-[14px] md:text-[15px] text-thmanyah-black">{step.role}</p>
                    {step.approverName && step.role !== "الرئيس التنفيذي" && (
                      <p className={`font-ui font-bold text-[12px] md:text-[13px] mt-0.5 truncate ${c.accent}`}>{step.approverName}</p>
                    )}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shrink-0 ${c.slaBg}`}>
                    <Clock className={`w-3 md:w-3.5 h-3 md:h-3.5 ${c.slaText}`} />
                    <span className={`font-ui font-black text-[12px] md:text-[13px] ${c.slaText}`}>{step.slaHours}h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="font-display font-black text-[26px] md:text-[40px] text-thmanyah-black">
              <span className="inline-block bg-thmanyah-green text-white px-3 md:px-4 py-1 md:py-1.5 rounded-xl">
                كيف صممنا الأداة؟
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 stagger-children">
            <FeatureCard accent="green" icon={<Target className="w-5 h-5" />} title="أسئلة متكيّفة" description="النموذج يتكيّف مع إجاباتك ويعرض أسئلة مختلفة حسب نوع الشاغر" />
            <FeatureCard accent="pink" icon={<Eye className="w-5 h-5" />} title="تتبع لحظي" description="اعرف وين وصل طلبك بالضبط مع شريط تقدم بصري واضح" />
            <FeatureCard accent="blue" icon={<BarChart3 className="w-5 h-5" />} title="لوحة تحليلية" description="إحصائيات شاملة حسب الإدارة مع نسب القبول والرفض" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-thmanyah-dark-slate text-white/75 py-6 md:py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/thamanyah.png" alt="ثمانية" width={20} height={20} className="rounded" />
            <span className="font-ui font-bold text-[11px] md:text-[12px]">إدارة المواهب</span>
          </div>
          <span className="font-ui font-bold text-[11px] md:text-[12px]">{new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accent = "green",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: "green" | "pink" | "blue" | "amber";
}) {
  const accents: Record<string, { tile: string; shadow: string }> = {
    green: {
      tile: "bg-thmanyah-green text-white",
      shadow: "shadow-[0_4px_12px_rgba(0,193,122,0.25)]",
    },
    pink: {
      tile: "bg-thmanyah-hot-pink text-white",
      shadow: "shadow-[0_4px_12px_rgba(255,0,183,0.22)]",
    },
    blue: {
      tile: "bg-thmanyah-blue text-white",
      shadow: "shadow-[0_4px_12px_rgba(0,114,249,0.25)]",
    },
    amber: {
      tile: "bg-thmanyah-amber text-thmanyah-black",
      shadow: "shadow-[0_4px_12px_rgba(255,188,10,0.30)]",
    },
  };
  const c = accents[accent];
  return (
    <div className="bg-thmanyah-off-white border border-thmanyah-warm-border rounded-2xl p-5 md:p-6 hover-lift">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${c.tile} ${c.shadow}`}>{icon}</div>
      <h3 className="font-ui font-black text-[14px] md:text-[15px] mb-2 text-thmanyah-black">{title}</h3>
      <p className="font-ui font-bold text-[12px] md:text-[13px] text-thmanyah-charcoal leading-relaxed">{description}</p>
    </div>
  );
}

function PipelineStage({
  index,
  icon,
  title,
  description,
  tone = "amber",
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "amber" | "sky" | "green" | "pink" | "lavender";
}) {
  // Varied tone per stage so the 3-step pipeline reads like a journey instead
  // of three identical amber nodes. Each tone uses a distinct brand hue for
  // the node surface, badge accent, and headline.
  const tones: Record<string, { node: string; text: string; badgeBorder: string; badgeText: string; titleText: string }> = {
    amber: {
      node: "bg-thmanyah-amber",
      text: "text-thmanyah-black",
      badgeBorder: "border-thmanyah-amber",
      badgeText: "text-thmanyah-amber",
      titleText: "text-thmanyah-amber",
    },
    sky: {
      node: "bg-thmanyah-sky",
      text: "text-thmanyah-dark-slate",
      badgeBorder: "border-thmanyah-sky",
      badgeText: "text-thmanyah-sky",
      titleText: "text-thmanyah-sky",
    },
    green: {
      node: "bg-thmanyah-green",
      text: "text-white",
      badgeBorder: "border-thmanyah-green",
      badgeText: "text-thmanyah-green",
      titleText: "text-thmanyah-green",
    },
    pink: {
      node: "bg-thmanyah-hot-pink",
      text: "text-white",
      badgeBorder: "border-thmanyah-hot-pink",
      badgeText: "text-thmanyah-pink-light",
      titleText: "text-thmanyah-pink-light",
    },
    lavender: {
      node: "bg-thmanyah-lavender",
      text: "text-thmanyah-charcoal",
      badgeBorder: "border-thmanyah-lavender",
      badgeText: "text-thmanyah-lavender",
      titleText: "text-thmanyah-lavender",
    },
  };
  const c = tones[tone];
  return (
    <div
      className="relative group pipeline-node-enter text-center"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Node circle */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className={`pipeline-node w-[104px] h-[104px] rounded-full flex items-center justify-center shadow-[0_0_0_6px_rgba(255,255,255,0.05)] transition-transform duration-500 group-hover:scale-[1.04] ${c.node} ${c.text}`}>
            {icon}
          </div>
          {/* Stage number badge */}
          <span className={`absolute -top-1 -right-1 w-7 h-7 rounded-full bg-thmanyah-black border-2 font-display font-black text-[12px] flex items-center justify-center ${c.badgeBorder} ${c.badgeText}`}>
            {index + 1}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-display font-black text-[19px] md:text-[21px] mb-3 leading-tight ${c.titleText}`}>
        {title}
      </h3>

      {/* Description */}
      <p className="font-ui font-bold text-[13px] md:text-[14px] text-white/85 leading-[1.8] max-w-[280px] mx-auto">
        {description}
      </p>
    </div>
  );
}
