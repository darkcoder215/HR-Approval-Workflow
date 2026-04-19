"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Briefcase,
  User,
  Brain,
  Target,
  Clock,
  AlertTriangle,
  Building2,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import ApprovalStepper from "@/components/ui/ApprovalStepper";
import AuthGate from "@/components/ui/AuthGate";
import { useAuth } from "@/lib/auth";
import { getRequestById, approveStep, rejectStep } from "@/lib/store";
import { getSettings, ApproverRole } from "@/lib/settings";
import { VacancyRequest } from "@/lib/types";

export default function ApprovePage() {
  return (
    <AuthGate>
      <ApproveView />
    </AuthGate>
  );
}

function ApproveView() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [request, setRequest] = useState<VacancyRequest | null>(null);
  const [stepApproverRole, setStepApproverRole] = useState<ApproverRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [internalComment, setInternalComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionDone, setActionDone] = useState<"approved" | "rejected" | null>(null);
  const [processing, setProcessing] = useState(false);

  const stepParam = searchParams.get("step");
  const stepIndex = stepParam ? parseInt(stepParam) : -1;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [r, settings] = await Promise.all([
          getRequestById(params.id as string),
          getSettings(),
        ]);
        if (cancelled) return;
        setRequest(r || null);
        if (r && stepIndex >= 0) {
          const step = r.approvalChain[stepIndex];
          // Resolve who can approve this step by matching the saved step's
          // `order` against the current settings chain. This keeps authority
          // assignments editable from /settings without a DB migration.
          const cfg = settings.approvalChain.find(
            (s) => s.order === step?.order
          );
          setStepApproverRole(cfg?.approverRole ?? "specific");
        }
      } catch (err) {
        console.error("Failed to load request", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params.id, stepIndex]);

  const handleApprove = async () => {
    if (!request) return;
    setProcessing(true);
    try {
      const updated = await approveStep(request.id, stepIndex, comment, internalComment);
      if (updated) {
        setRequest(updated);
        setActionDone("approved");
        // Invalidate the router cache so /dashboard refetches when the user
        // navigates back instead of showing the pre-approval snapshot.
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to approve step", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!request || !rejectionReason.trim()) return;
    setProcessing(true);
    try {
      const updated = await rejectStep(request.id, stepIndex, rejectionReason, internalComment);
      if (updated) {
        setRequest(updated);
        setActionDone("rejected");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to reject step", err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen page-bg-approve">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="animate-pulse-soft font-ui text-thmanyah-muted">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen page-bg-approve">
        <Header />
        <div className="max-w-lg mx-auto px-4 md:px-6 py-32 text-center">
          <h2 className="font-display font-bold text-[24px] mb-2">الطلب غير موجود</h2>
          <Link href="/dashboard"><Button>العودة للوحة المتابعة</Button></Link>
        </div>
      </div>
    );
  }

  const step = request.approvalChain[stepIndex];

  // Authority gate: does the signed-in user have permission to approve THIS
  // step? The rule set mirrors the five `approverRole` options exposed in
  // /settings. culture_admin is always an allowed override (it also satisfies
  // a "culture_admin" approverRole trivially).
  const hasAuthority = (() => {
    if (!user || !step) return false;
    const role = user.role;
    if (role === "culture_admin") return true;
    // Email pinned on the step always counts (e.g. a specific CEO mailbox).
    if (step.approverEmail && user.email.toLowerCase() === step.approverEmail.toLowerCase()) {
      return true;
    }
    switch (stepApproverRole) {
      case "specific":
        // Only the exact email pinned on the step (already handled above).
        return false;
      case "requester_manager":
        // The "direct manager" is the budget-owner email entered on the request.
        return (
          !!request.budgetOwner &&
          user.email.toLowerCase() === request.budgetOwner.toLowerCase()
        );
      case "department_head":
        return role === "department_head";
      case "approver":
        return role === "approver";
      case "culture_admin":
        // Handled by the early return above; non-admins never pass here.
        return false;
      default:
        return false;
    }
  })();

  // Requesters never reach the approval UI. Culture-admin is the only role
  // that can *view* an approval page for a step they don't own, and even then
  // their action buttons are gated on step timing below.
  const canView =
    user?.role === "culture_admin" ||
    user?.role === "approver" ||
    user?.role === "department_head" ||
    hasAuthority;

  if (!canView) {
    return (
      <div className="min-h-screen page-bg-approve">
        <Header />
        <div className="max-w-lg mx-auto px-4 md:px-6 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10 text-thmanyah-red" />
          </div>
          <h2 className="font-display font-black text-[24px] mb-2">لا تملك صلاحية الاعتماد</h2>
          <p className="font-ui text-[13px] text-thmanyah-muted mb-6">
            هذه الصفحة مخصصة للمعتمدين فقط. يمكنك متابعة طلباتك من لوحة «طلباتي».
          </p>
          <Link href="/dashboard"><Button>العودة لطلباتي</Button></Link>
        </div>
      </div>
    );
  }

  const canAct =
    step &&
    step.status === "pending" &&
    request.currentApprovalStep === stepIndex &&
    hasAuthority;

  if (actionDone) {
    // The chain in `request` is already the post-decision snapshot that came
    // back from approveStep/rejectStep, so all the counters below reflect the
    // state AFTER this approver's action.
    const totalSteps = request.approvalChain.length;
    const approvedCount = request.approvalChain.filter((s) => s.status === "approved").length;
    const isFinal = approvedCount === totalSteps && actionDone === "approved";
    const nextStep =
      actionDone === "approved" && !isFinal
        ? request.approvalChain[request.currentApprovalStep]
        : null;
    const stepLabel = step?.role ?? `المرحلة ${stepIndex + 1}`;

    return (
      <div className="min-h-screen page-bg-approve">
        <Header />
        <div className="max-w-xl mx-auto px-4 md:px-6 py-16 animate-fade-in-up">
          <div className="text-center">
            <div
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${
                actionDone === "approved" ? "bg-thmanyah-green-light/30" : "bg-red-50"
              }`}
            >
              {actionDone === "approved" ? (
                <CheckCircle2 className="w-10 h-10 text-thmanyah-green" />
              ) : (
                <XCircle className="w-10 h-10 text-thmanyah-red" />
              )}
            </div>
            <h2 className="font-display font-black text-[28px] mb-2">
              {actionDone === "rejected"
                ? "رفضت الطلب"
                : isFinal
                ? "اكتمل اعتماد الطلب"
                : `وافقت على مرحلة «${stepLabel}»`}
            </h2>
            <p className="font-ui text-[14px] text-thmanyah-muted mb-6">
              {request.jobTitle} — {request.requesterName}
            </p>
          </div>

          {/* Progress summary card */}
          <Card tone={actionDone === "rejected" ? "peach" : isFinal ? "green" : "mint"} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-ui font-bold text-[13px] text-thmanyah-charcoal">
                تقدم الاعتماد
              </span>
              <span className="font-ui font-bold text-[13px] text-thmanyah-green">
                {approvedCount} من {totalSteps} مراحل
              </span>
            </div>
            <div className="flex items-center gap-1">
              {request.approvalChain.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1 flex-1">
                  <div
                    className={`h-2 flex-1 rounded-full ${
                      s.status === "approved"
                        ? "bg-thmanyah-green"
                        : s.status === "rejected"
                        ? "bg-thmanyah-red"
                        : i === request.currentApprovalStep && request.status !== "rejected"
                        ? "bg-thmanyah-amber animate-pulse-soft"
                        : "bg-thmanyah-warm-border"
                    }`}
                    title={s.role}
                  />
                </div>
              ))}
            </div>
            <p className="font-ui text-[12px] text-thmanyah-muted mt-4 leading-relaxed">
              {actionDone === "rejected"
                ? "أوقفنا المسار وأشعرنا مقدم الطلب بالرفض. لن تتم أي اعتمادات لاحقة."
                : isFinal
                ? "هذه كانت المرحلة الأخيرة. انتقل الطلب لمرحلة بدء التوظيف."
                : nextStep
                ? `مرّرنا الطلب إلى «${nextStep.role}»${
                    nextStep.approverName ? ` — ${nextStep.approverName}` : ""
                  }.`
                : "تم حفظ قرارك."}
            </p>
          </Card>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={`/track/${request.id}`}>
              <Button variant="secondary" icon={<FileText className="w-4 h-4" />}>
                عرض تفاصيل الطلب
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
                العودة للوحة المتابعة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg-approve">
      <Header />

      {/* Header */}
      <div className="bg-thmanyah-black text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-thmanyah-green" />
            <span className="font-ui font-medium text-[13px] text-thmanyah-green">
              صفحة الاعتماد — {step?.role}
            </span>
          </div>
          <h1 className="font-display font-black text-[28px] leading-tight mb-2">
            {request.jobTitle}
          </h1>
          <p className="font-ui text-[14px] text-white/60">
            مقدم الطلب: {request.requesterName} — {request.department}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Badge
              status={request.status}
              approverName={request.approvalChain[request.currentApprovalStep]?.approverName}
              className="!bg-white/15 !text-white"
            />
            <span className="font-ui text-[12px] text-white/40">
              <Clock className="w-3 h-3 inline ml-1" />
              {new Date(request.createdAt).toLocaleDateString("ar-SA-u-nu-latn")}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card tone="blue">
              <h3 className="font-display font-bold text-[18px] mb-5 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-thmanyah-blue" />
                ملخص الطلب
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <MiniInfo label="نوع الشاغر" value={request.vacancyType === "replacement" ? "بديل" : "مستحدث"} />
                <MiniInfo label="العدد" value={String(request.positionsCount)} />
                <MiniInfo label="المستوى" value={request.jobLevel} />
                <MiniInfo label="طبيعة الدور" value={
                  { full_time: "دوام كامل", part_time: "دوام جزئي", contract: "عقد محدد", freelance: "مستقل", intern: "متدرب" }[request.roleNature] || ""
                } />
                <MiniInfo label="موقع العمل" value={request.country} />
                <MiniInfo label="الجنسية" value={request.nationality === "saudi" ? "سعودي فقط" : request.nationality === "arab" ? "مرن عربيًا" : "غير عربي"} />
                {request.preferredCountry && (
                  <MiniInfo label="دولة" value={request.preferredCountry} />
                )}
                {request.workLocation && (
                  <MiniInfo label="طبيعة العمل" value={request.workLocation === "remote" ? "عن بُعد" : "حضوري"} />
                )}
              </div>
            </Card>

            {/* Job Description */}
            <Card tone="amber">
              <h3 className="font-display font-bold text-[16px] mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-700" />
                الوصف الوظيفي
              </h3>
              <p className="font-body text-[14px] text-thmanyah-charcoal leading-relaxed whitespace-pre-wrap">
                {request.jobDescription}
              </p>
            </Card>

            {/* Replacement info */}
            {request.vacancyType === "replacement" && request.previousEmployeeName && (
              <Card tone="pink">
                <h3 className="font-display font-bold text-[16px] mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-thmanyah-burgundy" />
                  الموظف السابق
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <MiniInfo label="الاسم" value={request.previousEmployeeName} />
                  <MiniInfo label="نوع المغادرة" value={request.departureType === "resignation" ? "استقالة" : "فصل"} />
                </div>
                {request.departureReason && (
                  <p className="font-body text-[13px] text-thmanyah-muted mt-3 leading-relaxed">
                    {request.departureReason}
                  </p>
                )}
              </Card>
            )}

            {/* New position */}
            {request.vacancyType === "new_position" && (
              <Card tone="sky">
                <h3 className="font-display font-bold text-[16px] mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-thmanyah-blue" />
                  تفاصيل الشاغر المستحدث
                </h3>
                <MiniInfo
                  label="ضمن الهيكلة المعتمدة"
                  value={request.isInApprovedStructure ? "نعم" : "لا"}
                />
                {request.structureJustification && (
                  <div className="mt-3 p-3 bg-thmanyah-pale-yellow/20 rounded-xl">
                    <p className="font-ui text-[12px] text-amber-700 font-bold mb-1">تبرير الاستثناء:</p>
                    <p className="font-body text-[13px] text-amber-900 leading-relaxed">
                      {request.structureJustification}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Non-Arab talent justification */}
            {request.nationality === "non_arab" && request.nonArabJustification && (
              <Card tone="burgundy">
                <h3 className="font-display font-bold text-[16px] mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-thmanyah-burgundy" />
                  تبرير الحاجة لمواهب غير عربية
                </h3>
                <p className="font-body text-[14px] text-thmanyah-charcoal leading-relaxed whitespace-pre-wrap">
                  {request.nonArabJustification}
                </p>
              </Card>
            )}

            {/* AI + Assessment */}
            <Card tone="lavender">
              <h3 className="font-display font-bold text-[16px] mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-thmanyah-charcoal" />
                التقييم
              </h3>
              <div className="space-y-3">
                <ReviewBlock label="تفعيل AI في الدور" value={request.aiRoleIntegration} />
                <ReviewBlock label="إمكانية الأتمتة" value={request.aiAutomationPotential} />
                <ReviewBlock label="استبدال الدور بـ AI" value={request.aiReplacementAssessment} />
                <ReviewBlock label="المخاطر إذا لم نوظف" value={request.risksIfNotHired} />
                <ReviewBlock label="رفع معيار التوظيف" value={request.hiringBarCommitment} />
              </div>
            </Card>

            {/* Action area */}
            {canAct && (
              <Card tone="green" className="border-2 border-thmanyah-green/20" padding="lg">
                <h3 className="font-display font-bold text-[20px] mb-5 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-thmanyah-green" />
                  قرارك
                </h3>

                <Textarea
                  label="تعليق (اختياري — يظهر لمقدم الطلب)"
                  placeholder="أضف تعليقًا إن أحببت..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <div className="mt-4">
                  <Textarea
                    label="ملاحظة داخلية (تظهر فقط للمعتمدين وفريق الثقافة)"
                    placeholder="ملاحظة داخلية بين المعتمدين..."
                    value={internalComment}
                    onChange={(e) => setInternalComment(e.target.value)}
                  />
                </div>

                {!showRejectForm ? (
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="accent"
                      size="lg"
                      icon={<CheckCircle2 className="w-5 h-5" />}
                      onClick={handleApprove}
                      loading={processing}
                      className="flex-1"
                    >
                      موافقة
                    </Button>
                    <Button
                      variant="danger"
                      size="lg"
                      icon={<XCircle className="w-5 h-5" />}
                      onClick={() => setShowRejectForm(true)}
                      className="flex-1"
                    >
                      رفض
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4 animate-fade-in-up">
                    <div className="bg-red-50 rounded-xl p-4 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-thmanyah-red shrink-0 mt-0.5" />
                      <p className="font-ui text-[13px] text-red-800">
                        رفض الطلب سيوقف مسار الاعتماد بالكامل وسيتم إشعار مقدم الطلب.
                      </p>
                    </div>
                    <Textarea
                      label="سبب الرفض (مطلوب)"
                      placeholder="اكتب سبب الرفض بالتفصيل..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="danger"
                        size="lg"
                        icon={<XCircle className="w-5 h-5" />}
                        onClick={handleReject}
                        loading={processing}
                        disabled={!rejectionReason.trim()}
                        className="flex-1"
                      >
                        تأكيد الرفض
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setShowRejectForm(false)}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {!canAct && step && (
              <Card tone="lavender">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-thmanyah-lavender" />
                  <div>
                    <p className="font-ui font-bold text-[14px]">
                      {step.status === "approved"
                        ? "وافق المعتمد على هذه المرحلة"
                        : step.status === "rejected"
                        ? "رفض المعتمد الطلب في هذه المرحلة"
                        : "ليس دورك بعد"}
                    </p>
                    <p className="font-ui text-[13px] text-thmanyah-muted">
                      {step.status === "pending" && request.currentApprovalStep !== stepIndex
                        ? "الطلب لم يصل لمرحلتك بعد"
                        : step.decidedAt
                        ? `القرار بتاريخ ${new Date(step.decidedAt).toLocaleDateString("ar-SA-u-nu-latn")}`
                        : ""}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card tone="sky">
              <h3 className="font-display font-bold text-[16px] mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-thmanyah-blue" />
                مقدم الطلب
              </h3>
              <div className="space-y-2.5">
                <SmallInfo label="الاسم" value={request.requesterName} />
                <SmallInfo label="البريد" value={request.requesterEmail} />
                <SmallInfo label="الإدارة" value={request.department} />
                <SmallInfo label="الفريق" value={request.team} />
                <SmallInfo label="الميزانية" value={request.budgetOwner} />
              </div>
            </Card>

            <Card tone="mint">
              <h3 className="font-display font-bold text-[16px] mb-5">مسار الاعتماد</h3>
              <ApprovalStepper
                steps={request.approvalChain}
                currentStep={request.currentApprovalStep}
                isRejected={request.status === "rejected"}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2">
      <p className="font-ui text-[11px] text-thmanyah-muted">{label}</p>
      <p className="font-ui font-medium text-[14px]">{value}</p>
    </div>
  );
}

function SmallInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-ui text-[11px] text-thmanyah-muted">{label}</p>
      <p className="font-ui font-medium text-[13px] break-all">{value}</p>
    </div>
  );
}

function ReviewBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-thmanyah-cream/60 rounded-xl">
      <p className="font-ui font-bold text-[12px] text-thmanyah-charcoal mb-1">{label}</p>
      <p className="font-ui text-[13px] text-thmanyah-muted leading-relaxed">{value}</p>
    </div>
  );
}
