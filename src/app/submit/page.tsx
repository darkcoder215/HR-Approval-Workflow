"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Briefcase,
  FileText,
  Brain,
  Target,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Send,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Wand2,
} from "lucide-react";
import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import RadioGroup from "@/components/ui/RadioGroup";
import Button from "@/components/ui/Button";
import FormSection from "@/components/form/FormSection";
import LoginScreen from "@/components/ui/LoginScreen";
import { AuthProvider, useAuth } from "@/lib/auth";
import { createRequest } from "@/lib/store";
import { DUMMY_PROFILES, DummyProfile } from "@/lib/dummyProfiles";
import {
  DEPARTMENTS,
  JOB_LEVELS,
  ROLE_NATURES,
  COUNTRIES,
  INTRO_CHALLENGE,
  INTRO_OPPORTUNITY,
  HIRING_BAR_MESSAGE,
  APPROVAL_FLOW_NOTE,
  APPROVAL_CHAIN_TEMPLATE,
} from "@/lib/constants";

type FormData = {
  requesterName: string;
  requesterEmail: string;
  department: string;
  section: string;
  team: string;
  project: string;
  budgetOwner: string;
  vacancyType: string;
  positionsCount: string;
  previousEmployeeName: string;
  departureDate: string;
  departureType: string;
  departureReason: string;
  isInApprovedStructure: string;
  structureJustification: string;
  jobTitle: string;
  jobLevel: string;
  roleNature: string;
  jobDescription: string;
  country: string;
  nationality: string;
  triedAlternatives: string;
  alternativesDescription: string;
  risksIfNotHired: string;
  aiRoleIntegration: string;
  aiAutomationPotential: string;
  aiReplacementAssessment: string;
  hiringBarCommitment: string;
  directManagerName: string;
  directManagerEmail: string;
  deptCeoName: string;
  deptCeoEmail: string;
};

const initial: FormData = {
  requesterName: "",
  requesterEmail: "",
  department: "",
  section: "",
  team: "",
  project: "",
  budgetOwner: "",
  vacancyType: "",
  positionsCount: "1",
  previousEmployeeName: "",
  departureDate: "",
  departureType: "",
  departureReason: "",
  isInApprovedStructure: "",
  structureJustification: "",
  jobTitle: "",
  jobLevel: "",
  roleNature: "",
  jobDescription: "",
  country: "",
  nationality: "",
  triedAlternatives: "",
  alternativesDescription: "",
  risksIfNotHired: "",
  aiRoleIntegration: "",
  aiAutomationPotential: "",
  aiReplacementAssessment: "",
  hiringBarCommitment: "",
  directManagerName: "",
  directManagerEmail: "",
  deptCeoName: "",
  deptCeoEmail: "",
};

function SubmitContent() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginScreen />;
  return <SubmitForm />;
}

export default function SubmitPage() {
  return (
    <AuthProvider>
      <SubmitContent />
    </AuthProvider>
  );
}

function SubmitForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [showApprovals, setShowApprovals] = useState(false);
  const [showPrefill, setShowPrefill] = useState(false);
  const [prefillFlash, setPrefillFlash] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const prefill = (profile: DummyProfile) => {
    const newForm = { ...initial };
    for (const [key, value] of Object.entries(profile.data)) {
      if (key in newForm) {
        (newForm as Record<string, string>)[key] = value;
      }
    }
    setForm(newForm);
    setErrors({});
    setShowPrefill(false);
    setPrefillFlash(true);
    setTimeout(() => setPrefillFlash(false), 1500);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setRadio = (field: keyof FormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.requesterName.trim()) newErrors.requesterName = "مطلوب";
    if (!form.requesterEmail.trim()) newErrors.requesterEmail = "مطلوب";
    if (!form.department) newErrors.department = "مطلوب";
    if (!form.team.trim()) newErrors.team = "مطلوب";
    if (!form.budgetOwner.trim()) newErrors.budgetOwner = "مطلوب";
    if (!form.vacancyType) newErrors.vacancyType = "مطلوب";

    if (form.vacancyType === "replacement") {
      if (!form.previousEmployeeName.trim()) newErrors.previousEmployeeName = "مطلوب";
      if (!form.departureDate) newErrors.departureDate = "مطلوب";
      if (!form.departureType) newErrors.departureType = "مطلوب";
      if (!form.departureReason.trim()) newErrors.departureReason = "مطلوب";
    }

    if (form.vacancyType === "new_position") {
      if (!form.isInApprovedStructure) newErrors.isInApprovedStructure = "مطلوب";
      if (form.isInApprovedStructure === "no" && !form.structureJustification.trim()) {
        newErrors.structureJustification = "مطلوب";
      }
    }

    if (!form.jobTitle.trim()) newErrors.jobTitle = "مطلوب";
    if (!form.jobLevel) newErrors.jobLevel = "مطلوب";
    if (!form.roleNature) newErrors.roleNature = "مطلوب";
    if (!form.jobDescription.trim()) newErrors.jobDescription = "مطلوب";
    if (!form.country) newErrors.country = "مطلوب";
    if (!form.nationality) newErrors.nationality = "مطلوب";

    if (!form.triedAlternatives) newErrors.triedAlternatives = "مطلوب";
    if (form.triedAlternatives === "yes" && !form.alternativesDescription.trim()) {
      newErrors.alternativesDescription = "مطلوب";
    }
    if (!form.risksIfNotHired.trim()) newErrors.risksIfNotHired = "مطلوب";
    if (!form.aiRoleIntegration.trim()) newErrors.aiRoleIntegration = "مطلوب";
    if (!form.aiAutomationPotential.trim()) newErrors.aiAutomationPotential = "مطلوب";
    if (!form.aiReplacementAssessment.trim()) newErrors.aiReplacementAssessment = "مطلوب";
    if (!form.hiringBarCommitment.trim()) newErrors.hiringBarCommitment = "مطلوب";

    if (!form.directManagerName.trim()) newErrors.directManagerName = "مطلوب";
    if (!form.directManagerEmail.trim()) newErrors.directManagerEmail = "مطلوب";
    if (!form.deptCeoName.trim()) newErrors.deptCeoName = "مطلوب";
    if (!form.deptCeoEmail.trim()) newErrors.deptCeoEmail = "مطلوب";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = document.querySelector('[data-error="true"]');
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const request = createRequest({
      requesterName: form.requesterName,
      requesterEmail: form.requesterEmail,
      department: form.department,
      section: form.section,
      team: form.team,
      project: form.project,
      budgetOwner: form.budgetOwner,
      vacancyType: form.vacancyType as "replacement" | "new_position",
      positionsCount: parseInt(form.positionsCount) || 1,
      previousEmployeeName: form.previousEmployeeName || undefined,
      departureDate: form.departureDate || undefined,
      departureType: (form.departureType as "resignation" | "termination") || undefined,
      departureReason: form.departureReason || undefined,
      isInApprovedStructure: form.isInApprovedStructure === "yes" ? true : form.isInApprovedStructure === "no" ? false : undefined,
      structureJustification: form.structureJustification || undefined,
      jobTitle: form.jobTitle,
      jobLevel: form.jobLevel,
      roleNature: form.roleNature as "full_time" | "part_time" | "contract" | "freelance" | "intern",
      jobDescription: form.jobDescription,
      country: form.country,
      nationality: form.nationality as "saudi" | "arab",
      triedAlternatives: form.triedAlternatives === "yes",
      alternativesDescription: form.alternativesDescription || undefined,
      risksIfNotHired: form.risksIfNotHired,
      aiRoleIntegration: form.aiRoleIntegration,
      aiAutomationPotential: form.aiAutomationPotential,
      aiReplacementAssessment: form.aiReplacementAssessment,
      hiringBarCommitment: form.hiringBarCommitment,
    });

    setTimeout(() => {
      router.push(`/track/${request.id}`);
    }, 800);
  };

  return (
    <div className={`min-h-screen bg-thmanyah-off-white ${prefillFlash ? "animate-glow-pulse" : ""}`}>
      <Header />

      {/* Test Prefill FAB */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative">
          {showPrefill && (
            <div className="absolute bottom-14 left-0 bg-white rounded-2xl shadow-lg border border-thmanyah-warm-border p-4 w-[280px] md:w-[320px] animate-scale-in">
              <p className="font-ui font-black text-[13px] mb-3 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-thmanyah-green" />
                تعبئة تجريبية
              </p>
              <div className="space-y-2">
                {DUMMY_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => prefill(profile)}
                    className={`w-full text-right px-4 py-3 rounded-xl border transition-all hover-lift cursor-pointer ${profile.color}`}
                  >
                    <p className="font-ui font-black text-[13px]">{profile.label}</p>
                    <p className="font-ui font-bold text-[11px] opacity-70 mt-0.5">{profile.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setShowPrefill(!showPrefill)}
            className="w-12 h-12 md:w-14 md:h-14 bg-thmanyah-charcoal hover:bg-thmanyah-black text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
            title="تعبئة تجريبية"
          >
            <Wand2 className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Hero intro */}
      <div className="bg-thmanyah-black text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-thmanyah-green/10 border border-thmanyah-green/30 rounded-full mb-6">
            <Briefcase className="w-4 h-4 text-thmanyah-green" />
            <span className="font-ui text-[13px] text-thmanyah-green font-medium">
              نموذج طلب فتح شاغر وظيفي
            </span>
          </div>
          <h1 className="font-display font-black text-[26px] md:text-[40px] leading-tight mb-4">
            كل شاغر هو قرار استثماري
          </h1>
          <p className="font-body text-[16px] text-white/70 leading-relaxed max-w-2xl mx-auto mb-6">
            {INTRO_OPPORTUNITY}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 text-right">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-thmanyah-amber" />
                <span className="font-ui font-bold text-[13px] text-thmanyah-amber">
                  التحدي
                </span>
              </div>
              <p className="font-ui text-[13px] text-white/60 leading-relaxed">
                {INTRO_CHALLENGE}
              </p>
            </div>
            <div className="flex-1 bg-thmanyah-green/10 border border-thmanyah-green/20 rounded-2xl p-5 text-right">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-thmanyah-green" />
                <span className="font-ui font-bold text-[13px] text-thmanyah-green">
                  الفرصة
                </span>
              </div>
              <p className="font-ui text-[13px] text-white/60 leading-relaxed">
                الشركة الاستثنائية لا تُبنى بالتوظيف الكثير، بل بالتوظيف الصح.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval flow overview */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 -mt-4 mb-8 relative z-10">
        <Card className="border border-thmanyah-warm-border">
          <button
            onClick={() => setShowApprovals(!showApprovals)}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-thmanyah-green-light/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-thmanyah-green" />
              </div>
              <div className="text-right">
                <h3 className="font-ui font-bold text-[14px]">مسار الاعتماد</h3>
                <p className="font-ui text-[12px] text-thmanyah-muted">
                  6 مراحل — 5–10 أيام عمل
                </p>
              </div>
            </div>
            {showApprovals ? (
              <ChevronUp className="w-5 h-5 text-thmanyah-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-thmanyah-muted" />
            )}
          </button>

          {showApprovals && (
            <div className="mt-5 pt-5 border-t border-thmanyah-warm-border stagger-children">
              <div className="bg-thmanyah-pale-yellow/20 rounded-xl p-3 mb-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-ui text-[12px] text-amber-800 leading-relaxed">
                  {APPROVAL_FLOW_NOTE}
                </p>
              </div>
              <div className="space-y-3">
                {APPROVAL_CHAIN_TEMPLATE.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-thmanyah-cream/60"
                  >
                    <span className="w-7 h-7 rounded-full bg-thmanyah-black text-white flex items-center justify-center font-ui font-bold text-[12px] shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-ui font-medium text-[13px]">
                        {step.role}
                      </p>
                      {step.approverName && (
                        <p className="font-ui text-[12px] text-thmanyah-muted">
                          {step.approverName}
                        </p>
                      )}
                    </div>
                    <span className="font-ui text-[12px] text-thmanyah-muted bg-white px-2.5 py-1 rounded-full">
                      {step.slaHours} ساعة
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-4 md:px-6 pb-24 space-y-6"
      >
        {/* Section 1: Requester Info */}
        <FormSection
          title="بيانات مقدم الطلب"
          subtitle="معلوماتك الأساسية وموقعك التنظيمي"
          icon={<User className="w-5 h-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="الاسم الكامل"
              placeholder="مثال: أحمد محمد الفهد"
              value={form.requesterName}
              onChange={set("requesterName")}
              error={errors.requesterName}
              required
              data-error={!!errors.requesterName}
            />
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="name@thmanyah.com"
              value={form.requesterEmail}
              onChange={set("requesterEmail")}
              error={errors.requesterEmail}
              required
              data-error={!!errors.requesterEmail}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="الإدارة"
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              value={form.department}
              onChange={set("department")}
              error={errors.department}
              required
            />
            <Input
              label="القسم"
              placeholder="مثال: قسم الهندسة"
              value={form.section}
              onChange={set("section")}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="الفريق"
              placeholder="مثال: فريق المنصة"
              value={form.team}
              onChange={set("team")}
              error={errors.team}
              required
              data-error={!!errors.team}
            />
            <Input
              label="المشروع"
              placeholder="مثال: مشروع إعادة تصميم المنصة"
              value={form.project}
              onChange={set("project")}
            />
          </div>
          <Input
            label="صاحب الميزانية"
            hint="الرئيس التنفيذي لكل قسم هو صاحب الميزانية"
            placeholder="مثال: خالد العتيبي — الرئيس التنفيذي للتقنية"
            value={form.budgetOwner}
            onChange={set("budgetOwner")}
            error={errors.budgetOwner}
            required
            data-error={!!errors.budgetOwner}
          />
        </FormSection>

        {/* Section 2: Vacancy Type */}
        <FormSection
          title="تفاصيل الشاغر"
          subtitle="نوع الشاغر والمعلومات المرتبطة"
          icon={<Building2 className="w-5 h-5" />}
        >
          <RadioGroup
            label="نوع الشاغر"
            name="vacancyType"
            options={[
              { value: "replacement", label: "بديل", description: "بديل لموظف سابق غادر المنظمة" },
              { value: "new_position", label: "مستحدث", description: "شاغر جديد غير موجود سابقًا" },
            ]}
            value={form.vacancyType}
            onChange={setRadio("vacancyType")}
            required
            error={errors.vacancyType}
          />

          <Input
            label="العدد المطلوب"
            type="number"
            min="1"
            max="50"
            placeholder="1"
            value={form.positionsCount}
            onChange={set("positionsCount")}
            required
          />

          {/* Conditional: Replacement */}
          {form.vacancyType === "replacement" && (
            <div className="space-y-5 p-5 bg-thmanyah-cream/40 rounded-xl border border-thmanyah-warm-border animate-fade-in-up">
              <p className="font-ui font-bold text-[14px] text-thmanyah-charcoal flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-thmanyah-blue" />
                بيانات الموظف السابق
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="اسم الموظف السابق"
                  placeholder="الاسم الكامل"
                  value={form.previousEmployeeName}
                  onChange={set("previousEmployeeName")}
                  error={errors.previousEmployeeName}
                  required
                  data-error={!!errors.previousEmployeeName}
                />
                <Input
                  label="تاريخ المغادرة"
                  type="date"
                  value={form.departureDate}
                  onChange={set("departureDate")}
                  error={errors.departureDate}
                  required
                  data-error={!!errors.departureDate}
                />
              </div>
              <RadioGroup
                label="نوع المغادرة"
                name="departureType"
                options={[
                  { value: "resignation", label: "استقالة" },
                  { value: "termination", label: "فصل" },
                ]}
                value={form.departureType}
                onChange={setRadio("departureType")}
                required
                error={errors.departureType}
              />
              <Textarea
                label="سبب المغادرة بالتفصيل"
                placeholder="اشرح سبب مغادرة الموظف السابق بشكل مفصل..."
                value={form.departureReason}
                onChange={set("departureReason")}
                error={errors.departureReason}
                required
              />
            </div>
          )}

          {/* Conditional: New position */}
          {form.vacancyType === "new_position" && (
            <div className="space-y-5 p-5 bg-thmanyah-cream/40 rounded-xl border border-thmanyah-warm-border animate-fade-in-up">
              <RadioGroup
                label="هل الدور موجود ضمن الهيكلة المعتمدة؟"
                name="isInApprovedStructure"
                options={[
                  { value: "yes", label: "نعم" },
                  { value: "no", label: "لا" },
                ]}
                value={form.isInApprovedStructure}
                onChange={setRadio("isInApprovedStructure")}
                required
                error={errors.isInApprovedStructure}
              />

              {form.isInApprovedStructure === "no" && (
                <div className="animate-fade-in-up">
                  <div className="bg-thmanyah-pale-yellow/20 rounded-xl p-3 mb-4 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="font-ui text-[12px] text-amber-800 leading-relaxed">
                      فتح شاغر خارج الهيكلة المعتمدة يتطلب مبررات إضافية واعتماد استثناء، وقد يتم الموافقة عليه أو لا.
                    </p>
                  </div>
                  <Textarea
                    label="تبرير فتح شاغر خارج الهيكلة المعتمدة"
                    placeholder="اشرح بالتفصيل لماذا تحتاج لفتح هذا الشاغر خارج الهيكلة المعتمدة..."
                    value={form.structureJustification}
                    onChange={set("structureJustification")}
                    error={errors.structureJustification}
                    required
                  />
                </div>
              )}
            </div>
          )}
        </FormSection>

        {/* Section 3: Role Details */}
        <FormSection
          title="تفاصيل الدور الوظيفي"
          subtitle="المسمى والمستوى والوصف"
          icon={<Briefcase className="w-5 h-5" />}
        >
          <Input
            label="المسمى الوظيفي"
            placeholder="مثال: مهندس برمجيات أول"
            value={form.jobTitle}
            onChange={set("jobTitle")}
            error={errors.jobTitle}
            required
            data-error={!!errors.jobTitle}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="المستوى الوظيفي"
              options={JOB_LEVELS.map((l) => ({ value: l, label: l }))}
              value={form.jobLevel}
              onChange={set("jobLevel")}
              error={errors.jobLevel}
              required
            />
            <Select
              label="طبيعة الدور"
              options={ROLE_NATURES}
              value={form.roleNature}
              onChange={set("roleNature")}
              error={errors.roleNature}
              required
            />
          </div>
          <Textarea
            label="الوصف الوظيفي"
            hint="اكتب وصفًا تفصيليًا للمهام والمسؤوليات المتوقعة"
            placeholder="المهام الرئيسية، المسؤوليات، المتطلبات..."
            value={form.jobDescription}
            onChange={set("jobDescription")}
            error={errors.jobDescription}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="الدولة"
              options={COUNTRIES.map((c) => ({ value: c, label: c }))}
              value={form.country}
              onChange={set("country")}
              error={errors.country}
              required
            />
            <RadioGroup
              label="الجنسية"
              name="nationality"
              options={[
                { value: "saudi", label: "سعودي" },
                { value: "arab", label: "عربي" },
              ]}
              value={form.nationality}
              onChange={setRadio("nationality")}
              required
              error={errors.nationality}
            />
          </div>
        </FormSection>

        {/* Section 4: AI Assessment */}
        <FormSection
          title="تقييم الذكاء الاصطناعي"
          subtitle="ضمن تطوير قراراتنا، شاركنا رؤيتك للدور من منظور تقني"
          icon={<Brain className="w-5 h-5" />}
          highlight
        >
          <div className="bg-thmanyah-green-light/10 rounded-xl p-4 mb-2">
            <p className="font-ui text-[13px] text-emerald-800 leading-relaxed">
              الهدف: رفع جودة قرارات التوظيف وربطها بالكفاءة المستقبلية والتحول التقني.
            </p>
          </div>
          <Textarea
            label="كيف يمكن تفعيل الذكاء الاصطناعي في هذا الدور؟"
            placeholder="شاركنا رؤيتك لكيفية استفادة هذا الدور من أدوات الذكاء الاصطناعي..."
            value={form.aiRoleIntegration}
            onChange={set("aiRoleIntegration")}
            error={errors.aiRoleIntegration}
            required
          />
          <Textarea
            label="هل توجد مهام تشغيلية يمكن أتمتتها لتوفير الوقت والتركيز على مهام أعلى قيمة؟"
            placeholder="حدد المهام التي يمكن أتمتتها وأثر ذلك على الإنتاجية..."
            value={form.aiAutomationPotential}
            onChange={set("aiAutomationPotential")}
            error={errors.aiAutomationPotential}
            required
          />
          <Textarea
            label="إلى أي مدى يمكن للذكاء الاصطناعي دعم أو استبدال هذا الدور؟ وهل العنصر البشري أساسي؟"
            placeholder="قيّم مدى إمكانية استبدال هذا الدور بالذكاء الاصطناعي أو دعمه..."
            value={form.aiReplacementAssessment}
            onChange={set("aiReplacementAssessment")}
            error={errors.aiReplacementAssessment}
            required
          />
        </FormSection>

        {/* Section 5: Assessment */}
        <FormSection
          title="تقييم الحاجة"
          subtitle="ساعدنا نفهم ليش هذا الشاغر مهم الآن"
          icon={<FileText className="w-5 h-5" />}
        >
          <RadioGroup
            label="هل جربت حلول أخرى غير التوظيف؟"
            name="triedAlternatives"
            options={[
              { value: "yes", label: "نعم" },
              { value: "no", label: "لا" },
            ]}
            value={form.triedAlternatives}
            onChange={setRadio("triedAlternatives")}
            required
            error={errors.triedAlternatives}
          />

          {form.triedAlternatives === "yes" && (
            <div className="animate-fade-in-up">
              <Textarea
                label="ما الحلول الأخرى التي جربتها قبل طلب التوظيف؟"
                placeholder="اذكر البدائل التي جربتها ونتائجها..."
                value={form.alternativesDescription}
                onChange={set("alternativesDescription")}
                error={errors.alternativesDescription}
                required
              />
            </div>
          )}

          <Textarea
            label="ما المخاطر والآثار السلبية في حال ما وظفنا؟"
            hint="بالتفصيل، شاركنا الأثر على الفريق والمشاريع والأهداف"
            placeholder="اشرح بالتفصيل ماذا يحدث لو لم نوظف في هذا الشاغر..."
            value={form.risksIfNotHired}
            onChange={set("risksIfNotHired")}
            error={errors.risksIfNotHired}
            required
          />
        </FormSection>

        {/* Section 6: Hiring Bar */}
        <FormSection
          title="رفع معيار التوظيف"
          icon={<Target className="w-5 h-5" />}
          highlight
        >
          <div className="bg-thmanyah-black rounded-xl p-5 text-white">
            <p className="font-body text-[15px] leading-relaxed text-white/80">
              {HIRING_BAR_MESSAGE}
            </p>
          </div>
          <Textarea
            label="مستهدفاتك لرفع المعيار"
            placeholder="شاركنا خطتك لاختيار الأفضل هذه المرة..."
            value={form.hiringBarCommitment}
            onChange={set("hiringBarCommitment")}
            error={errors.hiringBarCommitment}
            required
          />
        </FormSection>

        {/* Section 7: Approval Chain Contacts */}
        <FormSection
          title="بيانات المعتمدين"
          subtitle="أدخل بيانات المدير المباشر والرئيس التنفيذي لإدارتك"
          icon={<ShieldCheck className="w-5 h-5" />}
        >
          <p className="font-ui text-[13px] text-thmanyah-muted leading-relaxed">
            المعتمدون الآخرون (استقطاب المواهب، الثقافة، المالية، الرئيس التنفيذي) محددون مسبقًا في النظام.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="اسم المدير المباشر"
              placeholder="الاسم الكامل"
              value={form.directManagerName}
              onChange={set("directManagerName")}
              error={errors.directManagerName}
              required
              data-error={!!errors.directManagerName}
            />
            <Input
              label="البريد الإلكتروني للمدير المباشر"
              type="email"
              placeholder="manager@thmanyah.com"
              value={form.directManagerEmail}
              onChange={set("directManagerEmail")}
              error={errors.directManagerEmail}
              required
              data-error={!!errors.directManagerEmail}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="اسم الرئيس التنفيذي للإدارة"
              placeholder="الاسم الكامل"
              value={form.deptCeoName}
              onChange={set("deptCeoName")}
              error={errors.deptCeoName}
              required
              data-error={!!errors.deptCeoName}
            />
            <Input
              label="البريد الإلكتروني للرئيس التنفيذي للإدارة"
              type="email"
              placeholder="ceo-dept@thmanyah.com"
              value={form.deptCeoEmail}
              onChange={set("deptCeoEmail")}
              error={errors.deptCeoEmail}
              required
              data-error={!!errors.deptCeoEmail}
            />
          </div>
        </FormSection>

        {/* Submit */}
        <Card className="border-2 border-thmanyah-green/20 bg-thmanyah-green-light/5">
          <div className="text-center space-y-4">
            <div className="bg-thmanyah-green/10 rounded-xl p-4 max-w-lg mx-auto">
              <p className="font-ui text-[13px] text-emerald-800 leading-relaxed">
                بعد الإرسال، لن يكون بالإمكان تعديل الطلب. تأكد من مراجعة جميع البيانات قبل الإرسال.
              </p>
            </div>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              loading={submitting}
              icon={<Send className="w-4 h-4" />}
              className="min-w-[200px]"
            >
              إرسال الطلب
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
