import nodemailer, { type Transporter } from "nodemailer";
import { site } from "./site";

/**
 * Contact-form notifications. Configure SMTP_HOST / SMTP_USER / SMTP_PASS in .env.production;
 * without them the route falls back to the webhook and the on-disk log, so a lead is never lost.
 */
const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const port = Number(process.env.SMTP_PORT ?? 465);

export const mailConfigured = Boolean(host && user && pass);

let transporter: Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: user!, pass: pass! },
    });
  }
  return transporter;
}

export type LeadMail = {
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  message: string;
  locale: string;
  referer: string | null;
  receivedAt: string;
};

const escape = (value: string) => value.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const ROWS: { label: string; key: keyof LeadMail }[] = [
  { label: "Emri", key: "name" },
  { label: "Email", key: "email" },
  { label: "Telefon", key: "phone" },
  { label: "Shteti", key: "country" },
  { label: "Interesi", key: "interest" },
  { label: "Gjuha e faqes", key: "locale" },
  { label: "Faqja", key: "referer" },
  { label: "Marrë më", key: "receivedAt" },
];

/** Sends the lead to the company inbox with the visitor as Reply-To. Throws if SMTP rejects it. */
export async function sendLeadMail(lead: LeadMail) {
  const to = process.env.LEAD_TO ?? site.email;
  const rows = ROWS.map(({ label, key }) => `<tr><td style="padding:6px 16px 6px 0;color:#6b7280">${label}</td><td style="padding:6px 0"><strong>${escape(String(lead[key] ?? "—"))}</strong></td></tr>`).join("");

  await getTransporter().sendMail({
    from: `"${site.company} — formular" <${user}>`,
    to,
    replyTo: `"${lead.name}" <${lead.email}>`,
    subject: `Kërkesë e re: ${lead.interest} — ${lead.name}`,
    text: [...ROWS.map(({ label, key }) => `${label}: ${lead[key] ?? "—"}`), "", "Mesazhi:", lead.message || "—"].join("\n"),
    html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;color:#111827">
      <h2 style="font-weight:600;margin:0 0 18px">Kërkesë e re nga ${escape(site.domain.replace(/^https?:\/\//, ""))}</h2>
      <table style="border-collapse:collapse">${rows}</table>
      <p style="margin:22px 0 6px;color:#6b7280">Mesazhi</p>
      <p style="margin:0;white-space:pre-wrap">${escape(lead.message || "—")}</p>
    </div>`,
  });
}
