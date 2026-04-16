"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Filter,
  Search,
  Eye,
  ShieldCheck,
  Users,
  Briefcase,
  BarChart3,
  Send,
} from "lucide-react";
import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoginScreen from "@/components/ui/LoginScreen";
import { useAuth, AuthUser } from "@/lib/auth";
import {
  getAllRequests,
  getRequestsByEmail,
  getDashboardStats,
  getTopRequestingManagers,
} from "@/lib/store";
import { VacancyRequest } from "@/lib/types";
import { DEPARTMENTS } from "@/lib/constants";

type FilterStatus = "all" | "received" | "pending_approval" | "approved" | "rejected";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) return <LoginScreen />;
  return <DashboardView user={user} />;
}

function DashboardView({ user }: { user: AuthUser }) {
  const isAdmin = user.role === "culture_admin";
  const isApprover = user.role === "approver" || user.role === "department_head";
  const canSeeAll = isAdmin || isApprover;

  const [requests, setRequests] = useState<VacancyRequest[]>([]);
  const [orgStats, setOrgStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    avgApprovalDays: 0,
  });
  const [topManagers, setTopManagers] = useState<{ name: string; count: number }[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterDept, setFilterDept] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (canSeeAll) {
          const [reqs, s, top] = await Promise.all([
            getAllRequests(),
            getDashboardStats(),
            getTopRequestingManagers(),
          ]);
          if (cancelled) return;
          setRequests(reqs);
          setOrgStats(s);
          setTopManagers(top);
        } else {
          // Requester: only own rows, no org-wide analytics
          const reqs = await getRequestsByEmail(user.email);
          if (cancelled) return;
          setRequests(reqs);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [canSeeAll, user.email]);

  const mineStats = useMemo(() => {
    const approved = requests.filter(
      (r) => r.status === "approved" || r.status === "hiring_started"
    ).length;
    const rejected = requests.filter((r) => r.status === "rejected").length;
    const pending = requests.filter(
      (r) =>
        r.status === "received" ||
        r.status === "under_review" ||
        r.status === "pending_approval"
    ).length;
    return {
      total: requests.length,
      pending,
      approved,
      rejected,
    };
  }, [requests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (filterStatus !== "all") {
        if (filterStatus === "pending_approval") {
          if (!["received", "under_review", "pending_approval"].includes(r.status)) return false;
        } else if (r.status !== filterStatus) return false;
      }
      if (filterDept && r.department !== filterDept) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          r.requesterName.toLowerCase().includes(q) ||
          r.jobTitle.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, filterStatus, filterDept, searchQuery]);

  const deptStats = useMemo(() => {
    const map: Record<string, { total: number; approved: number; rejected: number }> = {};
    for (const r of requests) {
      if (!map[r.department]) map[r.department] = { total: 0, approved: 0, rejected: 0 };
      map[r.department].total++;
      if (r.status === "approved" || r.status === "hiring_started") map[r.department].approved++;
      if (r.status === "rejected") map[r.department].rejected++;
    }
    return Object.entries(map)
      .map(([dept, s]) => ({ dept, ...s }))
      .sort((a, b) => b.total - a.total);
  }, [requests]);

  if (loading) {
    return (
      <div className="min-h-screen page-bg-dashboard">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="animate-pulse-soft font-ui text-thmanyah-muted">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg-dashboard">
      <Header />

      <div className="bg-thmanyah-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard className="w-5 h-5 text-thmanyah-green" />
            <span className="font-ui text-[13px] text-thmanyah-green font-medium">
              {canSeeAll ? "لوحة المتابعة" : "طلباتي"}
            </span>
          </div>
          <h1 className="font-display font-black text-[28px] md:text-[36px]">
            {canSeeAll ? "إدارة طلبات التوظيف" : `أهلًا ${user.username}`}
          </h1>
          <p className="font-ui text-[14px] text-white/50 mt-1">
            {canSeeAll
              ? "مراجعة واعتماد طلبات فتح الشواغر الوظيفية"
              : "تابع طلباتك المقدّمة ومكانها في مسار الاعتماد"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Stats row */}
        {canSeeAll ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            <StatCard
              label="إجمالي الطلبات"
              value={orgStats.totalRequests}
              icon={<FileText className="w-5 h-5" />}
              color="lavender"
            />
            <StatCard
              label="قيد المعالجة"
              value={orgStats.pendingRequests}
              icon={<Clock className="w-5 h-5" />}
              color="amber"
            />
            <StatCard
              label="معتمدة"
              value={orgStats.approvedRequests}
              icon={<CheckCircle2 className="w-5 h-5" />}
              color="mint"
            />
            <StatCard
              label="مرفوضة"
              value={orgStats.rejectedRequests}
              icon={<XCircle className="w-5 h-5" />}
              color="peach"
            />
            <StatCard
              label="متوسط أيام المعالجة"
              value={orgStats.avgApprovalDays || "—"}
              icon={<TrendingUp className="w-5 h-5" />}
              color="sky"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              label="طلباتي"
              value={mineStats.total}
              icon={<FileText className="w-5 h-5" />}
              color="lavender"
            />
            <StatCard
              label="قيد المعالجة"
              value={mineStats.pending}
              icon={<Clock className="w-5 h-5" />}
              color="amber"
            />
            <StatCard
              label="معتمدة"
              value={mineStats.approved}
              icon={<CheckCircle2 className="w-5 h-5" />}
              color="mint"
            />
            <StatCard
              label="مرفوضة"
              value={mineStats.rejected}
              icon={<XCircle className="w-5 h-5" />}
              color="peach"
            />
          </div>
        )}

        <div className={`grid grid-cols-1 gap-6 ${canSeeAll ? "lg:grid-cols-4" : ""}`}>
          {/* Main area */}
          <div className={canSeeAll ? "lg:col-span-3 space-y-4" : "space-y-4"}>
            {/* Filters */}
            <Card padding="sm">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-thmanyah-muted" />
                  <input
                    type="text"
                    placeholder={
                      canSeeAll
                        ? "بحث بالاسم، المسمى، أو رقم الطلب..."
                        : "بحث بالمسمى أو رقم الطلب..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent font-ui text-[13px] placeholder:text-thmanyah-muted/50 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-thmanyah-muted" />
                  {(["all", "pending_approval", "approved", "rejected"] as FilterStatus[]).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`
                        px-3 py-1.5 rounded-full font-ui text-[12px] font-medium transition-all cursor-pointer
                        ${
                          filterStatus === s
                            ? "bg-thmanyah-black text-white"
                            : "bg-thmanyah-cream text-thmanyah-muted hover:bg-thmanyah-warm-border"
                        }
                      `}
                      >
                        {s === "all"
                          ? "الكل"
                          : s === "pending_approval"
                          ? "قيد المعالجة"
                          : s === "approved"
                          ? "معتمدة"
                          : "مرفوضة"}
                      </button>
                    )
                  )}
                  {canSeeAll && (
                    <select
                      value={filterDept}
                      onChange={(e) => setFilterDept(e.target.value)}
                      className="px-3 py-1.5 rounded-full font-ui text-[12px] bg-thmanyah-cream text-thmanyah-muted border-0 cursor-pointer focus:outline-none"
                    >
                      <option value="">كل الإدارات</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </Card>

            {/* Requests list */}
            {filtered.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-thmanyah-cream mx-auto flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-thmanyah-muted" />
                  </div>
                  <p className="font-ui text-[14px] text-thmanyah-muted">
                    {requests.length === 0
                      ? canSeeAll
                        ? "لا توجد طلبات بعد"
                        : "ما قدّمت أي طلب بعد"
                      : "لا توجد نتائج مطابقة للفلتر"}
                  </p>
                  {requests.length === 0 && !canSeeAll && (
                    <p className="font-ui text-[12px] text-thmanyah-muted/80 mt-1 mb-4">
                      ابدأ بتقديم أول طلب لفتح شاغر في فريقك
                    </p>
                  )}
                  {requests.length === 0 && (
                    <Link href="/submit" className="mt-4 inline-block">
                      <Button variant="accent" size="sm" icon={<Send className="w-4 h-4" />}>
                        {canSeeAll ? "تقديم أول طلب" : "تقديم طلب جديد"}
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {filtered.map((r) => (
                  <RequestCard key={r.id} request={r} canApprove={canSeeAll} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar analytics — admins/approvers only */}
          {canSeeAll && (
            <div className="space-y-4">
              {/* Dept breakdown */}
              <Card>
                <h3 className="font-ui font-bold text-[14px] mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-thmanyah-blue" />
                  الطلبات حسب الإدارة
                </h3>
                {deptStats.length === 0 ? (
                  <p className="font-ui text-[13px] text-thmanyah-muted">لا توجد بيانات</p>
                ) : (
                  <div className="space-y-3">
                    {deptStats.map((d) => (
                      <div key={d.dept}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-ui text-[12px] text-thmanyah-charcoal">
                            {d.dept}
                          </span>
                          <span className="font-ui font-bold text-[12px]">
                            {d.total}
                          </span>
                        </div>
                        <div className="h-2 bg-thmanyah-cream rounded-full overflow-hidden flex">
                          {d.approved > 0 && (
                            <div
                              className="h-full bg-thmanyah-green rounded-full"
                              style={{ width: `${(d.approved / d.total) * 100}%` }}
                            />
                          )}
                          {d.rejected > 0 && (
                            <div
                              className="h-full bg-thmanyah-peach rounded-full"
                              style={{ width: `${(d.rejected / d.total) * 100}%` }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Top managers */}
              <Card>
                <h3 className="font-ui font-bold text-[14px] mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-thmanyah-hot-pink" />
                  الأكثر طلبًا للتوظيف
                </h3>
                {topManagers.length === 0 ? (
                  <p className="font-ui text-[13px] text-thmanyah-muted">لا توجد بيانات</p>
                ) : (
                  <div className="space-y-2.5">
                    {topManagers.map((m, i) => {
                      // Rotate ranking badge hues so the list reads like a
                      // small spectrum instead of a single neutral chip.
                      const rankStyles = [
                        "bg-thmanyah-amber/25 text-amber-800",
                        "bg-thmanyah-lavender/50 text-thmanyah-charcoal",
                        "bg-thmanyah-mint/50 text-emerald-700",
                        "bg-thmanyah-rose/60 text-thmanyah-burgundy",
                        "bg-thmanyah-sky-light/70 text-thmanyah-blue",
                      ];
                      return (
                        <div key={m.name} className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-ui font-bold text-[11px] shrink-0 ${
                              rankStyles[i % rankStyles.length]
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className="font-ui text-[13px] flex-1">{m.name}</span>
                          <span className="font-ui font-bold text-[13px] text-thmanyah-green">
                            {m.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              {/* Quick actions */}
              <Card className="bg-thmanyah-black text-white">
                <h3 className="font-ui font-bold text-[14px] mb-3">إجراءات سريعة</h3>
                <div className="space-y-2">
                  <Link href="/submit" className="block">
                    <Button variant="accent" size="sm" className="w-full" icon={<Briefcase className="w-4 h-4" />}>
                      تقديم طلب جديد
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request, canApprove }: { request: VacancyRequest; canApprove: boolean }) {
  const currentApprover =
    request.approvalChain[request.currentApprovalStep];

  // Tint each card by its lifecycle state so the dashboard reads as a heat-
  // map at a glance: approved = green rail, rejected = peach, hiring = sky,
  // received = lavender, under_review / pending_approval = amber.
  const statusTone = ((): "green" | "peach" | "sky" | "lavender" | "amber" => {
    switch (request.status) {
      case "approved":
        return "green";
      case "rejected":
        return "peach";
      case "hiring_started":
        return "sky";
      case "received":
        return "lavender";
      default:
        return "amber";
    }
  })();

  return (
    <Card tone={statusTone} className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge
              status={request.status}
              approverName={currentApprover?.approverName}
            />
            <span className="font-ui text-[11px] text-thmanyah-muted">
              #{request.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <h4 className="font-ui font-bold text-[15px] text-thmanyah-black mb-1 truncate">
            {request.jobTitle}
          </h4>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-ui text-[12px] text-thmanyah-muted flex items-center gap-1">
              <Users className="w-3 h-3" />
              {request.requesterName}
            </span>
            <span className="font-ui text-[12px] text-thmanyah-muted flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {request.department}
            </span>
            <span className="font-ui text-[12px] text-thmanyah-muted flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(request.createdAt).toLocaleDateString("ar-SA", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Mini stepper */}
          <div className="flex items-center gap-1 mt-3">
            {request.approvalChain.map((step, i) => (
              <div key={step.id} className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step.status === "approved"
                      ? "bg-thmanyah-green"
                      : step.status === "rejected"
                      ? "bg-thmanyah-red"
                      : i === request.currentApprovalStep && request.status !== "rejected"
                      ? "bg-thmanyah-amber animate-pulse-soft"
                      : "bg-thmanyah-warm-border"
                  }`}
                  title={step.role}
                />
                {i < request.approvalChain.length - 1 && (
                  <div className={`w-3 h-0.5 ${
                    step.status === "approved" ? "bg-thmanyah-green" : "bg-thmanyah-warm-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <Link href={`/track/${request.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              عرض
            </Button>
          </Link>
          {canApprove && request.status !== "approved" && request.status !== "rejected" && (
            <Link href={`/approve/${request.id}?step=${request.currentApprovalStep}`}>
              <Button variant="secondary" size="sm" icon={<ShieldCheck className="w-4 h-4" />}>
                اعتماد
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
