/**
 * One-off seed: creates two demo users and their `hr_profiles` rows so the
 * platform can be explored end-to-end now that public signup is disabled.
 *
 *   - Admin  (culture_admin) — sees Settings, full dashboard, approvals.
 *   - Regular (requester)    — only submits + tracks their own requests.
 *
 * Usage:
 *   1. In .env.local, add SUPABASE_SERVICE_ROLE_KEY=... (Project Settings → API)
 *   2. npm install   (already done if you've run the app)
 *   3. node scripts/seed-users.mjs
 *
 * Re-running the script is safe: existing users are updated in place rather
 * than duplicated.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local is optional if vars are already in the shell
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing env vars. Required:\n" +
      "  NEXT_PUBLIC_SUPABASE_URL\n" +
      "  SUPABASE_SERVICE_ROLE_KEY\n" +
      "Add them to .env.local and re-run."
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = [
  {
    email: "admin@thmanyah.com",
    password: "Admin@Thmanyah2026",
    displayName: "زكية حكمي",
    role: "culture_admin",
  },
  {
    email: "requester@thmanyah.com",
    password: "Requester@Thmanyah2026",
    displayName: "خالد العتيبي",
    role: "requester",
  },
];

async function findUserByEmail(email) {
  // listUsers is paginated; page size max is 1000 which is ample for a demo.
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 1000) return null;
    page += 1;
  }
}

async function upsertUser({ email, password, displayName, role }) {
  const existing = await findUserByEmail(email);

  let userId;
  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`↻ updated ${email}`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`✓ created ${email}`);
  }

  const { error: profileErr } = await admin
    .from("hr_profiles")
    .upsert(
      { id: userId, email, display_name: displayName, role },
      { onConflict: "id" }
    );
  if (profileErr) throw profileErr;
}

async function main() {
  for (const user of USERS) {
    await upsertUser(user);
  }

  console.log("\nDone. You can now sign in with:");
  for (const u of USERS) {
    console.log(`  ${u.role.padEnd(14)} ${u.email} / ${u.password}`);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
