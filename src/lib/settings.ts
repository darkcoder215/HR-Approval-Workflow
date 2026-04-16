/**
 * Supabase-backed settings store. Falls back to constants.ts defaults when
 * the singleton row hasn't been written yet.
 */

import {
  DEPARTMENTS,
  JOB_LEVELS,
  ROLE_NATURES,
  COUNTRIES,
  APPROVAL_CHAIN_TEMPLATE,
  INTRO_CHALLENGE,
  INTRO_OPPORTUNITY,
  HIRING_BAR_MESSAGE,
  APPROVAL_FLOW_NOTE,
  SLA_TOTAL,
} from "./constants";
import { supabase } from "./supabase";

export interface ApprovalStepConfig {
  order: number;
  role: string;
  /**
   * Which profile role is authorised to approve this step.
   * - "requester_manager" → the person whose email was entered as budget-owner
   *   / direct manager on the request itself (resolved per-request).
   * - "department_head" | "approver" | "culture_admin" → any logged-in user
   *   with that `hr_profiles.role`.
   * - "specific" → only the `approverEmail` pinned on this step can approve.
   */
  approverRole: ApproverRole;
  approverName: string;
  approverEmail: string;
  slaHours: number;
}

export type ApproverRole =
  | "requester_manager"
  | "department_head"
  | "approver"
  | "culture_admin"
  | "specific";

export const APPROVER_ROLE_LABELS: Record<ApproverRole, string> = {
  requester_manager: "المدير المباشر لمقدم الطلب",
  department_head: "رئيس إدارة (department_head)",
  approver: "معتمد (approver)",
  culture_admin: "إدارة الثقافة (culture_admin)",
  specific: "شخص محدد بالبريد فقط",
};

export interface AppSettings {
  departments: string[];
  jobLevels: string[];
  roleNatures: { value: string; label: string }[];
  countries: string[];
  approvalChain: ApprovalStepConfig[];
  introChallenge: string;
  introOpportunity: string;
  hiringBarMessage: string;
  approvalFlowNote: string;
  slaTotal: string;
}

function defaultApproverRoleFor(role: string): ApproverRole {
  if (role.includes("المدير المباشر")) return "requester_manager";
  if (role.includes("الرئيس التنفيذي للإدارة")) return "department_head";
  return "specific";
}

export function getDefaultSettings(): AppSettings {
  return {
    departments: [...DEPARTMENTS],
    jobLevels: [...JOB_LEVELS],
    roleNatures: ROLE_NATURES.map((r) => ({ ...r })),
    countries: [...COUNTRIES],
    approvalChain: APPROVAL_CHAIN_TEMPLATE.map((s) => ({
      order: s.order,
      role: s.role,
      approverRole: defaultApproverRoleFor(s.role),
      approverName: s.approverName,
      approverEmail: s.approverEmail,
      slaHours: s.slaHours,
    })),
    introChallenge: INTRO_CHALLENGE,
    introOpportunity: INTRO_OPPORTUNITY,
    hiringBarMessage: HIRING_BAR_MESSAGE,
    approvalFlowNote: APPROVAL_FLOW_NOTE,
    slaTotal: SLA_TOTAL,
  };
}

export async function getSettings(): Promise<AppSettings> {
  const defaults = getDefaultSettings();
  try {
    const { data, error } = await supabase
      .from("hr_settings")
      .select("data")
      .eq("id", "singleton")
      .maybeSingle();
    if (error) return defaults;
    if (!data) return defaults;
    const saved = (data.data ?? {}) as Partial<AppSettings>;
    const merged: AppSettings = { ...defaults, ...saved };
    // Back-fill approverRole on any legacy chain rows so the editor + runtime
    // gating always have a value to read.
    merged.approvalChain = merged.approvalChain.map((s) => ({
      ...s,
      approverRole: s.approverRole ?? defaultApproverRoleFor(s.role),
    }));
    return merged;
  } catch {
    return defaults;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id ?? null;

  const { error } = await supabase
    .from("hr_settings")
    .upsert(
      {
        id: "singleton",
        data: settings,
        updated_by: userId,
      },
      { onConflict: "id" }
    );
  if (error) throw error;
}

export async function resetSettings(): Promise<void> {
  const { error } = await supabase
    .from("hr_settings")
    .delete()
    .eq("id", "singleton");
  if (error) throw error;
}

export async function hasCustomSettings(): Promise<boolean> {
  const { data, error } = await supabase
    .from("hr_settings")
    .select("id")
    .eq("id", "singleton")
    .maybeSingle();
  if (error) return false;
  return !!data;
}
