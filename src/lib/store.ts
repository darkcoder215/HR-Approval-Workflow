/**
 * Supabase-backed store for vacancy requests and their approval chains.
 *
 * Tables: hr_vacancy_requests, hr_approval_steps.
 */

import { supabase } from "./supabase";
import {
  ApprovalStatus,
  ApprovalStep,
  RequestStatus,
  VacancyRequest,
} from "./types";
import { getSettings } from "./settings";

interface VacancyRequestRow {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  status: RequestStatus;
  current_approval_step: number;
  requester_name: string;
  requester_email: string;
  department: string;
  section: string;
  team: string;
  project: string;
  budget_owner: string;
  vacancy_type: "replacement" | "new_position";
  positions_count: number;
  previous_employee_name: string | null;
  departure_date: string | null;
  departure_type: "resignation" | "termination" | null;
  departure_reason: string | null;
  is_in_approved_structure: boolean | null;
  structure_justification: string | null;
  job_title: string;
  job_title_en: string;
  job_level: string;
  role_nature: VacancyRequest["roleNature"];
  job_description: string;
  country: string;
  preferred_country: string | null;
  work_location: string | null;
  nationality: VacancyRequest["nationality"];
  non_arab_justification: string | null;
  tried_alternatives: boolean;
  alternatives_description: string | null;
  risks_if_not_hired: string;
  ai_role_integration: string;
  ai_automation_potential: string;
  ai_replacement_assessment: string;
  hiring_bar_commitment: string;
  rejection_reason: string | null;
}

interface ApprovalStepRow {
  id: string;
  request_id: string;
  step_order: number;
  role: string;
  approver_name: string;
  approver_email: string;
  sla_hours: number;
  status: ApprovalStatus;
  comment: string | null;
  internal_comment: string | null;
  decided_at: string | null;
  reminder_sent_at: string | null;
}

function rowToRequest(
  row: VacancyRequestRow,
  steps: ApprovalStepRow[]
): VacancyRequest {
  const chain: ApprovalStep[] = [...steps]
    .sort((a, b) => a.step_order - b.step_order)
    .map((s) => ({
      id: s.id,
      order: s.step_order,
      role: s.role,
      approverName: s.approver_name,
      approverEmail: s.approver_email,
      slaHours: s.sla_hours,
      status: s.status,
      comment: s.comment ?? undefined,
      internalComment: s.internal_comment ?? undefined,
      decidedAt: s.decided_at ?? undefined,
      reminderSentAt: s.reminder_sent_at ?? undefined,
    }));

  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    currentApprovalStep: row.current_approval_step,
    requesterName: row.requester_name,
    requesterEmail: row.requester_email,
    department: row.department,
    section: row.section,
    team: row.team,
    project: row.project,
    budgetOwner: row.budget_owner,
    vacancyType: row.vacancy_type,
    positionsCount: row.positions_count,
    previousEmployeeName: row.previous_employee_name ?? undefined,
    departureDate: row.departure_date ?? undefined,
    departureType: row.departure_type ?? undefined,
    departureReason: row.departure_reason ?? undefined,
    isInApprovedStructure: row.is_in_approved_structure ?? undefined,
    structureJustification: row.structure_justification ?? undefined,
    jobTitle: row.job_title,
    jobTitleEn: row.job_title_en,
    jobLevel: row.job_level,
    roleNature: row.role_nature,
    jobDescription: row.job_description,
    country: row.country,
    preferredCountry: row.preferred_country ?? undefined,
    workLocation: row.work_location ?? undefined,
    nationality: row.nationality,
    nonArabJustification: row.non_arab_justification ?? undefined,
    triedAlternatives: row.tried_alternatives,
    alternativesDescription: row.alternatives_description ?? undefined,
    risksIfNotHired: row.risks_if_not_hired,
    aiRoleIntegration: row.ai_role_integration,
    aiAutomationPotential: row.ai_automation_potential,
    aiReplacementAssessment: row.ai_replacement_assessment,
    hiringBarCommitment: row.hiring_bar_commitment,
    approvalChain: chain,
    rejectionReason: row.rejection_reason ?? undefined,
  };
}

async function fetchStepsByRequestIds(
  requestIds: string[]
): Promise<Map<string, ApprovalStepRow[]>> {
  const map = new Map<string, ApprovalStepRow[]>();
  if (requestIds.length === 0) return map;
  const { data, error } = await supabase
    .from("hr_approval_steps")
    .select("*")
    .in("request_id", requestIds);
  if (error) throw error;
  for (const r of (data ?? []) as ApprovalStepRow[]) {
    const arr = map.get(r.request_id) ?? [];
    arr.push(r);
    map.set(r.request_id, arr);
  }
  return map;
}

export async function getAllRequests(): Promise<VacancyRequest[]> {
  const { data, error } = await supabase
    .from("hr_vacancy_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as VacancyRequestRow[];
  const stepsMap = await fetchStepsByRequestIds(rows.map((r) => r.id));
  return rows.map((r) => rowToRequest(r, stepsMap.get(r.id) ?? []));
}

export async function getRequestById(
  id: string
): Promise<VacancyRequest | null> {
  const { data, error } = await supabase
    .from("hr_vacancy_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as VacancyRequestRow;
  const { data: stepsData, error: stepsError } = await supabase
    .from("hr_approval_steps")
    .select("*")
    .eq("request_id", id)
    .order("step_order", { ascending: true });
  if (stepsError) throw stepsError;
  return rowToRequest(row, (stepsData ?? []) as ApprovalStepRow[]);
}

export async function getRequestsByDepartment(
  department: string
): Promise<VacancyRequest[]> {
  const { data, error } = await supabase
    .from("hr_vacancy_requests")
    .select("*")
    .eq("department", department)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as VacancyRequestRow[];
  const stepsMap = await fetchStepsByRequestIds(rows.map((r) => r.id));
  return rows.map((r) => rowToRequest(r, stepsMap.get(r.id) ?? []));
}

export async function getRequestsByEmail(
  email: string
): Promise<VacancyRequest[]> {
  const { data, error } = await supabase
    .from("hr_vacancy_requests")
    .select("*")
    .eq("requester_email", email)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as VacancyRequestRow[];
  const stepsMap = await fetchStepsByRequestIds(rows.map((r) => r.id));
  return rows.map((r) => rowToRequest(r, stepsMap.get(r.id) ?? []));
}

export async function createRequest(
  data: Omit<
    VacancyRequest,
    "id" | "createdAt" | "updatedAt" | "status" | "currentApprovalStep" | "approvalChain"
  >
): Promise<VacancyRequest> {
  const settings = await getSettings();
  const chainTemplate = settings.approvalChain;

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id ?? null;

  const insertPayload = {
    created_by: userId,
    status: "received" as RequestStatus,
    current_approval_step: 0,
    requester_name: data.requesterName,
    requester_email: data.requesterEmail,
    department: data.department,
    section: data.section,
    team: data.team,
    project: data.project,
    budget_owner: data.budgetOwner,
    vacancy_type: data.vacancyType,
    positions_count: data.positionsCount,
    previous_employee_name: data.previousEmployeeName ?? null,
    departure_date: data.departureDate ?? null,
    departure_type: data.departureType ?? null,
    departure_reason: data.departureReason ?? null,
    is_in_approved_structure:
      typeof data.isInApprovedStructure === "boolean"
        ? data.isInApprovedStructure
        : null,
    structure_justification: data.structureJustification ?? null,
    job_title: data.jobTitle,
    job_title_en: data.jobTitleEn,
    job_level: data.jobLevel,
    role_nature: data.roleNature,
    job_description: data.jobDescription,
    country: data.country,
    preferred_country: data.preferredCountry ?? null,
    work_location: data.workLocation ?? null,
    nationality: data.nationality,
    non_arab_justification: data.nonArabJustification ?? null,
    tried_alternatives: data.triedAlternatives,
    alternatives_description: data.alternativesDescription ?? null,
    risks_if_not_hired: data.risksIfNotHired,
    ai_role_integration: data.aiRoleIntegration,
    ai_automation_potential: data.aiAutomationPotential,
    ai_replacement_assessment: data.aiReplacementAssessment,
    hiring_bar_commitment: data.hiringBarCommitment,
  };

  const { data: requestRow, error: insertError } = await supabase
    .from("hr_vacancy_requests")
    .insert(insertPayload)
    .select("*")
    .single();
  if (insertError) throw insertError;

  const requestId = (requestRow as VacancyRequestRow).id;

  const stepsPayload = chainTemplate.map((step, index) => ({
    request_id: requestId,
    step_order: step.order,
    role: step.role,
    approver_name: index === 0 ? data.budgetOwner : step.approverName || "",
    approver_email: step.approverEmail || "",
    sla_hours: step.slaHours,
    status: "pending" as ApprovalStatus,
  }));

  const { data: stepsData, error: stepsError } = await supabase
    .from("hr_approval_steps")
    .insert(stepsPayload)
    .select("*");
  if (stepsError) throw stepsError;

  return rowToRequest(
    requestRow as VacancyRequestRow,
    (stepsData ?? []) as ApprovalStepRow[]
  );
}

export async function approveStep(
  requestId: string,
  stepIndex: number,
  comment?: string,
  internalComment?: string
): Promise<VacancyRequest | null> {
  const current = await getRequestById(requestId);
  if (!current) return null;
  const step = current.approvalChain[stepIndex];
  if (!step) return null;

  const nowIso = new Date().toISOString();
  const { error: stepErr } = await supabase
    .from("hr_approval_steps")
    .update({
      status: "approved",
      comment: comment ?? null,
      internal_comment: internalComment ?? null,
      decided_at: nowIso,
    })
    .eq("id", step.id);
  if (stepErr) throw stepErr;

  const isLast = stepIndex === current.approvalChain.length - 1;
  const nextStatus: RequestStatus = isLast ? "approved" : "pending_approval";
  const nextStep = isLast ? stepIndex : stepIndex + 1;

  const { error: reqErr } = await supabase
    .from("hr_vacancy_requests")
    .update({ status: nextStatus, current_approval_step: nextStep })
    .eq("id", requestId);
  if (reqErr) throw reqErr;

  return getRequestById(requestId);
}

export async function rejectStep(
  requestId: string,
  stepIndex: number,
  reason: string,
  internalComment?: string
): Promise<VacancyRequest | null> {
  const current = await getRequestById(requestId);
  if (!current) return null;
  const step = current.approvalChain[stepIndex];
  if (!step) return null;

  const nowIso = new Date().toISOString();
  const { error: stepErr } = await supabase
    .from("hr_approval_steps")
    .update({
      status: "rejected",
      comment: reason,
      internal_comment: internalComment ?? null,
      decided_at: nowIso,
    })
    .eq("id", step.id);
  if (stepErr) throw stepErr;

  const { error: reqErr } = await supabase
    .from("hr_vacancy_requests")
    .update({ status: "rejected", rejection_reason: reason })
    .eq("id", requestId);
  if (reqErr) throw reqErr;

  return getRequestById(requestId);
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus
): Promise<VacancyRequest | null> {
  const { error } = await supabase
    .from("hr_vacancy_requests")
    .update({ status })
    .eq("id", requestId);
  if (error) throw error;
  return getRequestById(requestId);
}

export async function deleteRequest(requestId: string): Promise<boolean> {
  const { error } = await supabase
    .from("hr_vacancy_requests")
    .delete()
    .eq("id", requestId);
  if (error) throw error;
  return true;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  avgApprovalDays: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const all = await getAllRequests();
  const approved = all.filter(
    (r) => r.status === "approved" || r.status === "hiring_started"
  );
  const rejected = all.filter((r) => r.status === "rejected");
  const pending = all.filter(
    (r) =>
      r.status === "received" ||
      r.status === "under_review" ||
      r.status === "pending_approval"
  );

  let totalDays = 0;
  let countCompleted = 0;
  for (const r of [...approved, ...rejected]) {
    const start = new Date(r.createdAt).getTime();
    const end = new Date(r.updatedAt).getTime();
    totalDays += (end - start) / (1000 * 60 * 60 * 24);
    countCompleted++;
  }

  return {
    totalRequests: all.length,
    pendingRequests: pending.length,
    approvedRequests: approved.length,
    rejectedRequests: rejected.length,
    avgApprovalDays:
      countCompleted > 0
        ? Math.round((totalDays / countCompleted) * 10) / 10
        : 0,
  };
}

export async function getTopRequestingManagers(): Promise<
  { name: string; count: number }[]
> {
  const all = await getAllRequests();
  const counts: Record<string, number> = {};
  for (const r of all) {
    counts[r.requesterName] = (counts[r.requesterName] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
