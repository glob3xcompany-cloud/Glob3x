import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { leadFromFormData, validateLead, type LeadInput } from "@/lib/lead";
import { mailConfigured, sendLeadMail } from "@/lib/mailer";

/**
 * Lead intake for the group website. Every accepted lead is first appended to LEAD_LOG_DIR/leads.ndjson,
 * so it survives even if e-mail or the CRM is down, then e-mailed to the company inbox (SMTP_*) and,
 * if configured, forwarded to LEAD_WEBHOOK_URL (CRM / Make / Zapier / n8n) as JSON.
 */
export async function POST(request: NextRequest) {
  const fd = await request.formData();
  const lead = leadFromFormData(fd);

  // Honeypot filled in → silently accept, do nothing.
  if (lead.website) return NextResponse.json({ ok: true });

  const errors = validateLead(lead);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const record = {
    ...lead,
    website: undefined,
    source: "glob3x-group",
    receivedAt: new Date().toISOString(),
    referer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
  };

  await store(record);

  let delivered = false;

  if (mailConfigured) {
    try {
      await sendLeadMail(record);
      delivered = true;
    } catch (error) {
      console.error("Lead e-mail failed", error);
    }
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record),
      });
      if (res.ok) delivered = true;
      else console.error("Lead webhook failed", res.status, await res.text().catch(() => ""));
    } catch (error) {
      console.error("Lead webhook failed", error);
    }
  }

  // In development neither is usually configured; the on-disk log is enough.
  if (!delivered && process.env.NODE_ENV === "production" && (mailConfigured || webhook)) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

/** Append-only log, so a lead is never lost even when delivery fails. */
async function store(record: LeadInput & Record<string, unknown>) {
  try {
    const dir = process.env.LEAD_LOG_DIR ?? path.join(process.cwd(), ".leads");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "leads.ndjson"), JSON.stringify(record) + "\n", "utf8");
  } catch (error) {
    console.error("Lead log failed", error);
  }
}
