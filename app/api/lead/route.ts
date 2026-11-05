import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { leadFromFormData, validateLead, type LeadInput } from "@/lib/lead";

/**
 * Lead intake for the group website.
 * - Production: forwards to LEAD_WEBHOOK_URL (CRM / Make / Zapier / n8n) as JSON.
 * - Development without a webhook: appends to .leads/leads.ndjson so leads are never lost while testing.
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

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) {
      console.error("Lead webhook failed", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  if (process.env.NODE_ENV !== "production") {
    await storeLocally(record);
    return NextResponse.json({ ok: true });
  }

  console.error("LEAD_WEBHOOK_URL is not configured; lead dropped", record.email);
  return NextResponse.json({ ok: false }, { status: 503 });
}

async function storeLocally(record: LeadInput & Record<string, unknown>) {
  const dir = path.join(process.cwd(), ".leads");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "leads.ndjson"), JSON.stringify(record) + "\n", "utf8");
}
