"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  ShieldCheck,
  BarChart3,
  Clock,
  Send,
  CheckCircle2,
  Eye,
  FileText,
  Users,
  Sparkles,
  Zap,
  Building2,
  Target,
  Mail,
  ChevronDown,
  LogOut,
  FlaskConical,
  Trash2,
  Database,
} from "lucide-react";
import Button from "@/components/ui/Button";
import LoginScreen from "@/components/ui/LoginScreen";
import { AuthProvider, useAuth } from "@/lib/auth";
import { APPROVAL_CHAIN_TEMPLATE, SLA_TOTAL } from "@/lib/constants";
import { getAllRequests, getDashboardStats } from "@/lib/store";
import { seedDemoData, hasDemoData, clearAllData } from "@/lib/seedData";

function HomeContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [hasRequests, setHasRequests] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [seedCount, setSeedCount] = useState(0);

  useEffect(() => {
    const all = getAllRequests();
    setHasRequests(all.length > 0);
    setSeedCount(all.length);
    setSeeded(hasDemoData());
  }, []);

  const handleSeed = () => {
    const data = seedDemoData();
    setSeeded(true);
    setHasRequests(true);
    setSeedCount(data.length);
  };

  const handleClear = () => {
    clearAllData();
    setSeeded(false);
    setHasRequests(false);
    setSeedCount(0);
  };

  if (!isAuthenticated) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-thmanyah-off-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-thmanyah-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image src="/thamanyah.png" alt="ثمانية" width={28} height={28} className="brightness-0 invert" />
            <span className="font-display font-black text-white text-[14px] md:text-[15px] hidden sm:block">ثمانية</span>
          </Link>
          <nav className="flex items-center gap-1 md:gap-2">
            <Link href="/dashboard" className="px-3 md:px-4 py-2 text-[12px] md:text-[13px] font-ui font-bold text-white/60 hover:text-white rounded-full transition-all">
              لوحة المتابعة
            </Link>
            <Link href="/submit">
              <Button variant="accent" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                <span className="hidden sm:inline">تقديم طلب</span>
                <span className="sm:hidden">طلب</span>
              </Button>
            </Link>
            <button
              onClick={logout}
              className="px-2 py-2 text-white/30 hover:text-thmanyah-red rounded-full transition-all cursor-pointer"
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
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-thmanyah-green blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-thmanyah-blue blur-3xl animate-float-slow-reverse" />
        </div>

        {/* Flying notification bubbles */}
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          {/* Approvals - green */}
          <span className="flying-bubble fly-right bg-thmanyah-green/15 text-thmanyah-green border border-thmanyah-green/20" style={{ top: "18%", right: "8%", "--duration": "11s", "--delay": "0.5s" } as React.CSSProperties}>
            تم اعتماد الطلب ✓
          </span>
          <span className="flying-bubble fly-left bg-thmanyah-green/15 text-thmanyah-green border border-thmanyah-green/20" style={{ top: "72%", left: "5%", "--duration": "13s", "--delay": "4s" } as React.CSSProperties}>
            مبروك! تمت الموافقة على التوظيف
          </span>

          {/* Rejections - red */}
          <span className="flying-bubble fly-left bg-thmanyah-red/15 text-thmanyah-red border border-thmanyah-red/20" style={{ top: "28%", left: "3%", "--duration": "10s", "--delay": "2s" } as React.CSSProperties}>
            تم رفض الطلب — الميزانية غير كافية
          </span>
          <span className="flying-bubble fly-right bg-thmanyah-red/15 text-thmanyah-red border border-thmanyah-red/20" style={{ top: "82%", right: "12%", "--duration": "12s", "--delay": "7s" } as React.CSSProperties}>
            مرفوض: الدور قابل للأتمتة بالذكاء الاصطناعي
          </span>

          {/* Funny / salary */}
          <span className="flying-bubble fly-up bg-thmanyah-amber/15 text-thmanyah-amber border border-thmanyah-amber/20" style={{ top: "55%", left: "15%", "--duration": "9s", "--delay": "1s" } as React.CSSProperties}>
            يريد راتب ٥٠,٠٠٠ ريال 💸
          </span>
          <span className="flying-bubble fly-right bg-thmanyah-amber/15 text-thmanyah-amber border border-thmanyah-amber/20" style={{ top: "40%", right: "4%", "--duration": "14s", "--delay": "5.5s" } as React.CSSProperties}>
            المرشح لم يحضر المقابلة 🫠
          </span>

          {/* Interviews / pending - blue */}
          <span className="flying-bubble fly-left bg-thmanyah-blue/15 text-thmanyah-blue border border-thmanyah-blue/20" style={{ top: "15%", left: "12%", "--duration": "12s", "--delay": "3s" } as React.CSSProperties}>
            تمت جدولة المقابلة — الأحد القادم
          </span>
          <span className="flying-bubble fly-up bg-thmanyah-blue/15 text-thmanyah-blue border border-thmanyah-blue/20" style={{ top: "65%", right: "20%", "--duration": "10s", "--delay": "8s" } as React.CSSProperties}>
            بانتظار اعتماد المدير المالي
          </span>

          {/* More fun ones */}
          <span className="flying-bubble fly-right bg-thmanyah-peach/20 text-thmanyah-peach border border-thmanyah-peach/20" style={{ top: "48%", right: "2%", "--duration": "11s", "--delay": "6s" } as React.CSSProperties}>
            إنهاء خدمات — عدم الالتزام
          </span>
          <span className="flying-bubble fly-left bg-thmanyah-pink-light/20 text-thmanyah-pink-light border border-thmanyah-pink-light/20" style={{ top: "35%", left: "8%", "--duration": "13s", "--delay": "9s" } as React.CSSProperties}>
            &quot;خبرة ١٥ سنة&quot; — عمره ٢٣ سنة
          </span>
          <span className="flying-bubble fly-up bg-thmanyah-sky/15 text-thmanyah-sky border border-thmanyah-sky/20" style={{ top: "78%", left: "30%", "--duration": "10s", "--delay": "3.5s" } as React.CSSProperties}>
            نحتاج ٥ مطورين... أمس!
          </span>
          <span className="flying-bubble fly-right bg-thmanyah-mint/20 text-thmanyah-mint border border-thmanyah-mint/20" style={{ top: "22%", right: "25%", "--duration": "12s", "--delay": "10s" } as React.CSSProperties}>
            العرض الوظيفي جاهز للإرسال
          </span>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 md:px-6 pt-14 md:pt-20 pb-16 md:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-thmanyah-green/10 border border-thmanyah-green/20 rounded-full mb-6 md:mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-thmanyah-green" />
            <span className="font-ui text-[12px] md:text-[13px] text-thmanyah-green font-bold">
              منظومة اعتماد الشواغر الوظيفية
            </span>
          </div>

          <h1 className="font-display font-black text-[32px] md:text-[52px] lg:text-[64px] leading-[1.1] mb-5 md:mb-6 animate-fade-in-up">
            التوظيف الصح
            <br />
            <span className="relative">
              يبدأ من هنا
              <span className="absolute bottom-0 md:bottom-1 right-0 left-0 h-2 md:h-3 bg-thmanyah-green/20 -z-10 rounded-sm" />
            </span>
          </h1>

          <p className="font-body font-bold text-[15px] md:text-[19px] text-white/50 leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            كل شاغر تفتحه هو قرار استثماري.
            <br className="hidden md:block" />
            هذه المنظومة تضمن أن قرارات التوظيف تمر بمسار محوكم
            <br className="hidden md:block" />
            يدعم نمونا واستدامتنا.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/submit">
              <Button variant="accent" size="lg" icon={<Send className="w-4 h-4" />} className="text-[14px] md:text-[15px] w-full sm:w-auto font-black">
                تقديم طلب فتح شاغر
              </Button>
            </Link>
            {hasRequests && (
              <Link href="/dashboard">
                <Button variant="secondary" size="lg" icon={<BarChart3 className="w-4 h-4" />} className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20 text-[14px] md:text-[15px] w-full sm:w-auto font-black">
                  لوحة المتابعة
                </Button>
              </Link>
            )}
          </div>

          {/* Demo Data Panel */}
          <div className="mt-10 md:mt-14 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
            <div className="inline-block bg-white/[0.06] border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-sm max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className="w-4 h-4 text-thmanyah-amber" />
                <span className="font-ui font-black text-[13px] text-white/80">بيانات تجريبية</span>
              </div>
              <p className="font-ui text-[12px] text-white/40 mb-4 leading-relaxed">
                أنشئ طلبات تجريبية بمراحل مختلفة (معتمدة، مرفوضة، قيد المعالجة) لاستعراض جميع واجهات المنصة.
              </p>
              {seedCount > 0 && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-thmanyah-green/10 rounded-xl">
                  <Database className="w-3.5 h-3.5 text-thmanyah-green" />
                  <span className="font-ui font-bold text-[12px] text-thmanyah-green">{seedCount} طلب في النظام</span>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSeed}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-thmanyah-amber/90 hover:bg-thmanyah-amber text-thmanyah-black rounded-full font-ui font-black text-[12px] transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  {seedCount > 0 ? "إعادة التعبئة" : "تعبئة البيانات"}
                </button>
                {seedCount > 0 && (
                  <button
                    onClick={handleClear}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-thmanyah-red/20 text-white/60 hover:text-thmanyah-red rounded-full font-ui font-bold text-[12px] transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    مسح
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 animate-bounce">
            <ChevronDown className="w-5 h-5 text-white/20 mx-auto" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-thmanyah-green-light/30 rounded-full font-ui text-[12px] text-emerald-700 font-bold mb-4">
              <Zap className="w-3.5 h-3.5" />
              كيف يعمل النظام
            </span>
            <h2 className="font-display font-black text-[26px] md:text-[40px]">
              مسار واضح من الطلب إلى التوظيف
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 stagger-children">
            <StepCard number="1" icon={<FileText className="w-6 h-6" />} title="تقديم الطلب" description="املأ النموذج بتفاصيل الشاغر، التبرير، وتقييم الحاجة. النموذج ذكي ويتكيّف مع إجاباتك." color="green" />
            <StepCard number="2" icon={<ShieldCheck className="w-6 h-6" />} title="مسار الاعتماد" description="الطلب يمر بـ 6 مراحل اعتماد متسلسلة مع SLA محدد لكل مرحلة. تتبّع طلبك لحظة بلحظة." color="blue" />
            <StepCard number="3" icon={<CheckCircle2 className="w-6 h-6" />} title="بدء التوظيف" description="بعد اعتماد جميع الأطراف، يتواصل معك فريق استقطاب المواهب خلال 24 ساعة عمل." color="amber" />
          </div>
        </div>
      </section>

      {/* Approval chain */}
      <section className="py-14 md:py-20 bg-thmanyah-off-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-thmanyah-cream rounded-full font-ui text-[12px] text-thmanyah-muted font-bold mb-4">
              <Building2 className="w-3.5 h-3.5" />
              مسار الاعتماد
            </span>
            <h2 className="font-display font-black text-[26px] md:text-[40px] mb-3">
              6 مراحل — {SLA_TOTAL}
            </h2>
            <p className="font-body font-bold text-[14px] md:text-[16px] text-thmanyah-muted">
              كل مرحلة لها مسؤول محدد ومهلة زمنية واضحة
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto stagger-children">
            {APPROVAL_CHAIN_TEMPLATE.map((step, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4 bg-white rounded-2xl p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover-lift">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-thmanyah-black text-white flex items-center justify-center font-display font-black text-[14px] md:text-[16px] shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-ui font-black text-[14px] md:text-[15px]">{step.role}</p>
                  {step.approverName && (
                    <p className="font-ui font-bold text-[12px] md:text-[13px] text-thmanyah-muted mt-0.5 truncate">{step.approverName}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 bg-thmanyah-cream rounded-full shrink-0">
                  <Clock className="w-3 md:w-3.5 h-3 md:h-3.5 text-thmanyah-muted" />
                  <span className="font-ui font-bold text-[12px] md:text-[13px] text-thmanyah-charcoal">{step.slaHours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="font-display font-black text-[26px] md:text-[40px] mb-3">مبنية للإحسان</h2>
            <p className="font-body font-bold text-[14px] md:text-[16px] text-thmanyah-muted">أداة تعكس معايير ثمانية في كل تفصيل</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 stagger-children">
            <FeatureCard icon={<Eye className="w-5 h-5" />} title="تتبع لحظي" description="اعرف وين وصل طلبك بالضبط مع شريط تقدم بصري واضح" />
            <FeatureCard icon={<Mail className="w-5 h-5" />} title="إشعارات ذكية" description="إشعار عند كل انتقال حالة وتذكير تلقائي عند تجاوز SLA" />
            <FeatureCard icon={<ShieldCheck className="w-5 h-5" />} title="صلاحيات محكمة" description="كل شخص يرى ما يخصه فقط مع فصل بين التعليقات العامة والداخلية" />
            <FeatureCard icon={<Target className="w-5 h-5" />} title="أسئلة ذكية" description="النموذج يتكيّف مع إجاباتك ويعرض أسئلة مختلفة حسب نوع الشاغر" />
            <FeatureCard icon={<BarChart3 className="w-5 h-5" />} title="لوحة تحليلية" description="إحصائيات شاملة حسب الإدارة مع نسب القبول والرفض" />
            <FeatureCard icon={<Users className="w-5 h-5" />} title="تعليقات ثنائية" description="تعليقات عامة لمقدم الطلب وملاحظات داخلية للمعتمدين فقط" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-thmanyah-black text-white text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="font-display font-black text-[24px] md:text-[40px] mb-4">
            الشركة الاستثنائية لا تُبنى بالتوظيف الكثير
          </h2>
          <p className="font-display font-black text-[20px] md:text-[24px] text-thmanyah-green mb-8">بل بالتوظيف الصح</p>
          <Link href="/submit">
            <Button variant="accent" size="lg" icon={<Send className="w-4 h-4" />} className="text-[15px] font-black">ابدأ بتقديم طلبك</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-thmanyah-dark-slate text-white/40 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/thamanyah.png" alt="ثمانية" width={20} height={20} className="brightness-0 invert opacity-40" />
            <span className="font-ui font-bold text-[11px] md:text-[12px]">ثمانية — إدارة الثقافة</span>
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

function StepCard({ number, icon, title, description, color }: { number: string; icon: React.ReactNode; title: string; description: string; color: "green" | "blue" | "amber" }) {
  const colors = { green: "bg-thmanyah-green-light/30 text-thmanyah-green", blue: "bg-thmanyah-sky/20 text-thmanyah-blue", amber: "bg-thmanyah-pale-yellow/40 text-amber-600" };
  return (
    <div className="relative bg-thmanyah-off-white rounded-2xl p-6 md:p-7 text-center hover-lift">
      <span className="absolute top-3 left-3 md:top-4 md:left-4 font-display font-black text-[40px] md:text-[48px] text-thmanyah-warm-border leading-none">{number}</span>
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${colors[color]}`}>{icon}</div>
      <h3 className="font-display font-black text-[16px] md:text-[18px] mb-2">{title}</h3>
      <p className="font-ui font-bold text-[13px] md:text-[14px] text-thmanyah-muted leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-thmanyah-off-white rounded-2xl p-5 md:p-6 hover-lift">
      <div className="w-10 h-10 rounded-xl bg-thmanyah-green-light/30 flex items-center justify-center mb-4 text-thmanyah-green">{icon}</div>
      <h3 className="font-ui font-black text-[14px] md:text-[15px] mb-2">{title}</h3>
      <p className="font-ui font-bold text-[12px] md:text-[13px] text-thmanyah-muted leading-relaxed">{description}</p>
    </div>
  );
}
