"use client";

import { useState, type FormEvent } from "react";
import type { LeadErrors } from "@/lib/lead";

export type ContactDict = {
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  interestOptions: string[];
  message: string;
  consent: string;
  submit: string;
  sending: string;
  whatsapp: string;
  success: string;
  error: string;
  invalid: string;
};

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "success" } | { kind: "error"; invalid?: boolean };

const field =
  "w-full border-0 border-b border-paper/30 bg-transparent px-0 py-3 text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none focus:ring-0";
const label = "eyebrow block text-paper/60";

export function ContactForm({
  dict,
  locale,
  whatsappHref,
  defaultInterest,
}: {
  dict: ContactDict;
  locale: string;
  whatsappHref: string;
  defaultInterest?: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<LeadErrors>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    setErrors({});
    try {
      const res = await fetch("/api/lead", { method: "POST", body: new FormData(form) });
      if (res.status === 422) {
        const data = (await res.json()) as { errors: LeadErrors };
        setErrors(data.errors);
        setStatus({ kind: "error", invalid: true });
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus({ kind: "success" });
    } catch {
      setStatus({ kind: "error" });
    }
  }

  const invalid = (k: keyof LeadErrors) => (errors[k] ? "border-red-400" : "");

  if (status.kind === "success") {
    return (
      <div className="border border-gold/60 p-8" role="status">
        <p className="font-display text-2xl">{dict.success}</p>
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-6 inline-block text-[0.75rem] font-semibold tracking-[0.18em] text-gold uppercase">
          {dict.whatsapp} →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-7">
      <input type="hidden" name="locale" value={locale} />
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-7 md:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={label}>{dict.name}</label>
          <input id="lead-name" name="name" autoComplete="name" required className={`${field} ${invalid("name")}`} />
        </div>
        <div>
          <label htmlFor="lead-country" className={label}>{dict.country}</label>
          <input id="lead-country" name="country" autoComplete="country-name" required className={`${field} ${invalid("country")}`} />
        </div>
        <div>
          <label htmlFor="lead-email" className={label}>{dict.email}</label>
          <input id="lead-email" name="email" type="email" autoComplete="email" required className={`${field} ${invalid("email")}`} />
        </div>
        <div>
          <label htmlFor="lead-phone" className={label}>{dict.phone}</label>
          <input id="lead-phone" name="phone" type="tel" autoComplete="tel" placeholder="+" required className={`${field} ${invalid("phone")}`} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="lead-interest" className={label}>{dict.interest}</label>
          <select
            id="lead-interest"
            name="interest"
            required
            defaultValue={defaultInterest && dict.interestOptions.includes(defaultInterest) ? defaultInterest : ""}
            className={`${field} ${invalid("interest")} appearance-none [&>option]:text-ink`}
          >
            <option value="" disabled>—</option>
            {dict.interestOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="lead-message" className={label}>{dict.message}</label>
        <textarea id="lead-message" name="message" rows={3} className={`${field} resize-none`} />
      </div>

      <label className={`flex items-start gap-3 text-sm text-paper/70 ${errors.consent ? "text-red-300" : ""}`}>
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-gold" />
        <span>{dict.consent}</span>
      </label>

      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-red-300">
          {status.invalid ? dict.invalid : dict.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={status.kind === "sending"} className="btn-primary">
          {status.kind === "sending" ? dict.sending : dict.submit}
        </button>
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline border-paper/30 hover:border-paper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3Z" />
          </svg>
          {dict.whatsapp}
        </a>
      </div>
    </form>
  );
}
